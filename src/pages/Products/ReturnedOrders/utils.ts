import { ICurrency } from '@/api/auth/types';
import { IOrder } from '@/api/order/types';
import { IReturnedOrder } from '@/api/returned-order/types';


export function calculateSettlement(
  order: IReturnedOrder,
  payments: { currencyId: string, amount: number }[],
  currencies: ICurrency[],
  defaultCurrencySymbol: 'UZS' | 'USD'
) {
  const getCurrency = (id: string) =>
    currencies.find(c => c.id === id);

  const usdRate =
    currencies.find(c => c.symbol === 'USD')?.exchangeRate || 1;

  // ---------------- ORDER
  const orderUZS =
    order.totalPrices.find(p => p.currency.symbol === 'UZS')?.total || 0;

  const orderUSD =
    order.totalPrices.find(p => p.currency.symbol === 'USD')?.total || 0;

  // ---------------- PAYMENTS
  const paymentUZS = payments
    .filter(p => getCurrency(p.currencyId)?.symbol === 'UZS')
    .reduce((s, p) => s + Number(p.amount || 0), 0);

  const paymentUSD = payments
    .filter(p => getCurrency(p.currencyId)?.symbol === 'USD')
    .reduce((s, p) => s + Number(p.amount || 0), 0);

  // ---------------- DEBT
  // ---------------- DEBT START
  let uzsDebt = orderUZS;
  let usdDebt = orderUSD;

  // ---------------- PAYMENTS START
  let payUZS = paymentUZS;
  let payUSD = paymentUSD;

  // ===============================
  // 1. USD payment → USD debt yopish
  // ===============================
  const usdUsed = Math.min(payUSD, usdDebt);

  usdDebt -= usdUsed;
  payUSD -= usdUsed;

  // ===============================
  // 2. qolgan USD → UZS ga convert
  // ===============================
  if (payUSD > 0) {
    payUZS += payUSD * usdRate;
    payUSD = 0;
  }

  // ===============================
  // 3. UZS payment → UZS debt yopish
  // ===============================
  const uzsUsed = Math.min(payUZS, uzsDebt);

  uzsDebt -= uzsUsed;
  payUZS -= uzsUsed;

  // ===============================
  // 4. qolgan UZS → USD ga convert
  // ===============================
  if (payUZS > 0) {
    const uzsToUsd = payUZS / usdRate;

    usdDebt -= uzsToUsd;
    payUZS = 0;
  }

  // ===============================
  // 5. safety clamp
  // ===============================
  if (usdDebt < 0) usdDebt = 0;
  if (uzsDebt < 0) uzsDebt = 0;

  // ---------------- CHANGE
  let changeUZS = 0;
  let changeUSD = 0;

  // copy
  let cPayUZS = paymentUZS;
  let cPayUSD = paymentUSD;

  let cOrdUZS = orderUZS;
  let cOrdUSD = orderUSD;

  // -------------------------------
  // 1. USD → USD yopish
  // -------------------------------
  const usdUsedChange = Math.min(cPayUSD, cOrdUSD);

  cPayUSD -= usdUsedChange;
  cOrdUSD -= usdUsedChange;

  // -------------------------------
  // 2. UZS → UZS yopish
  // -------------------------------
  const uzsUsedChange = Math.min(cPayUZS, cOrdUZS);

  cPayUZS -= uzsUsedChange;
  cOrdUZS -= uzsUsedChange;

  // -------------------------------
  // 3. CROSS yopish (faqat kerak bo‘lsa)
  // -------------------------------

  // USD ortiqcha bo‘lsa → UZS qarzni yopadi
  if (cPayUSD > 0 && cOrdUZS > 0) {
    const usdToUzs = cPayUSD * usdRate;

    if (usdToUzs >= cOrdUZS) {
      // hammasini yopadi
      const usedUSD = cOrdUZS / usdRate;

      cPayUSD -= usedUSD;
      cOrdUZS = 0;
    } else {
      // qisman yopadi
      cOrdUZS -= usdToUzs;
      cPayUSD = 0;
    }
  }

  // UZS ortiqcha bo‘lsa → USD qarzni yopadi
  if (cPayUZS > 0 && cOrdUSD > 0) {
    const uzsToUsd = cPayUZS / usdRate;

    if (uzsToUsd >= cOrdUSD) {
      const usedUZS = cOrdUSD * usdRate;

      cPayUZS -= usedUZS;
      cOrdUSD = 0;
    } else {
      cOrdUSD -= uzsToUsd;
      cPayUZS = 0;
    }
  }

  // -------------------------------
  // 4. qolgan = CHANGE
  // -------------------------------
  changeUZS = cPayUZS > 0 ? cPayUZS : 0;
  changeUSD = cPayUSD > 0 ? cPayUSD : 0;

  // default (faqat UI uchun)
  const changeDefault =
    defaultCurrencySymbol === 'USD'
      ? changeUSD || (changeUZS / usdRate)
      : changeUZS || (changeUSD * usdRate);

  return {
    order: {
      uzs: orderUZS,
      usd: orderUSD,
    },
    payment: {
      uzs: paymentUZS,
      usd: paymentUSD,
    },
    debt: {
      uzs: uzsDebt,
      usd: usdDebt,
    },
    change: {
      uzs: changeUZS,
      usd: changeUSD,
      default: changeDefault,
    },
  };
}
