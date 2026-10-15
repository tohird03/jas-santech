import React, { forwardRef } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, Path } from '@react-pdf/renderer';
import { IOrder } from '@/api/order/types';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import LogoImg from '@/assets/img/jas-logo.jpg';
import CheckmarkIcon from '@/assets/img/check-mark.png';
import TelegramQr from '@/assets/img/telegram.jpg'; // Telegram/kanal QR kodi rasmi
import Insta from '@/assets/img/insta.png'; // Instagram QR kodi rasmi
import { phoneFormat } from '@/utils/phoneFormat';
import { imageUrlWithBase } from '@/utils/image';

Font.register({
  family: 'NotoSans',
  src: '/fonts/noto.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'NotoSansBold',
  fontWeight: 'bold',
  src: '/fonts/NotoSans-Bold.ttf',
});

type Props = {
  order: IOrder;
};

export const MyDocument = forwardRef<any, Props>(({ order }, ref) => (
  <Document ref={ref}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {/* HEADER: QR chap | Do'kon nomi + telefonlar | QR o'ng */}
        <View style={styles.headerRow}>
          <View style={styles.qrBox}>
            <Image style={styles.qrImage} src={Insta} />
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.shopName}>JASUR G BLOK 8-DO&lsquo;KON</Text>
            <Text style={styles.shopPhones}>
              Jasur 91-773-22-99  Dilshod 91-733-22-99  Axror 97-950-86-83
            </Text>
          </View>

          <View style={styles.qrBox}>
            <Image style={styles.qrImage} src={TelegramQr} />
          </View>
        </View>

        {/* Xaridor ma'lumotlari */}
        <View style={styles.buyerInfo}>
          <View style={styles.buyerRow}>
            <Text style={styles.buyerLabel}>Xaridor:</Text>
            <Text style={styles.buyerValue}>
              {order?.client?.fullname}
            </Text>
          </View>
          <View style={styles.buyerRow}>
            <Text style={styles.buyerLabel}>Telefon raqami:</Text>
            <Text style={styles.buyerValue}>
              {phoneFormat(order?.client?.phone?.slice(3))}
            </Text>
          </View>
          <View style={styles.buyerRow}>
            <Text style={styles.buyerLabel}>Sotuv vaqti:</Text>
            <Text style={styles.buyerValue}>
              {getFullDateFormat(order?.date)}
            </Text>
          </View>
        </View>

        {/* Jadval */}
        <View style={styles.table}>
          {/* HEADER */}
          <View style={styles.tableHeader} wrap={false}>
            <View style={[styles.tableCellWrap, styles.colNumber]}>
              <Text style={styles.tableHeaderText}>№</Text>
            </View>

            <View style={[styles.tableCellWrap, styles.colImage]}>
              <Text style={styles.tableHeaderText}>Расм</Text>
            </View>

            <View style={[styles.tableCellWrap, styles.colCategory]}>
              <Text style={styles.tableHeaderText}>Склад</Text>
            </View>

            <View style={[styles.tableCellWrap, styles.colName]}>
              <Text style={styles.tableHeaderText}>Махсулот номи</Text>
            </View>

            <View style={[styles.tableCellWrap, styles.colCheck]}>
              <Image
                src={CheckmarkIcon}
                style={{ width: 10, height: 10 }}
              />
            </View>

            <View style={[styles.tableCellWrap, styles.colCount]}>
              <Text style={styles.tableHeaderText}>Сони</Text>
            </View>

            <View style={[styles.tableCellWrap, styles.colPrice]}>
              <Text style={styles.tableHeaderText}>Нархи</Text>
            </View>

            <View style={[styles.tableCellWrap, styles.colTotal, { borderRightWidth: 0 }]}>
              <Text style={styles.tableHeaderText}>Суммаси</Text>
            </View>
          </View>

          {/* ROWS */}
          {[...(order?.products || [])]
            .sort((a, b) => {
              const categoryA = a?.product?.category?.name;
              const categoryB = b?.product?.category?.name;

              if (!categoryA && !categoryB) return 0;
              if (!categoryA) return 1;
              if (!categoryB) return -1;

              return categoryA.localeCompare(categoryB);
            })?.map((product, index) => (
              <View key={product?.id} style={styles.tableRow} wrap={false}>
                {/* № */}
                <View style={[styles.tableCellWrap, styles.colNumber]}>
                  <Text style={styles.tableCellText}>
                    {index + 1}
                  </Text>
                </View>

                {/* RASM */}
                <View style={[styles.tableCellWrap, styles.colImage]}>
                  {product?.product?.image ? (
                    <Image
                      src={imageUrlWithBase(product.product.image)}
                      style={styles.productImage}
                    />
                  ) : (
                    <Text style={styles.tableCellText}>-</Text>
                  )}
                </View>

                {/* SKLAD / CATEGORY */}
                <View style={[styles.tableCellWrap, styles.colCategory]}>
                  <Text style={styles.tableCellTextLeft}>
                    {product?.product?.category?.name}
                  </Text>
                </View>

                {/* PRODUCT NAME */}
                <View style={[styles.tableCellWrap, styles.colName]}>
                  <Text style={styles.tableCellTextLeft}>
                    {product?.product?.name}
                  </Text>
                </View>

                {/* CHECK */}
                <View style={[styles.tableCellWrap, styles.colCheck]} />

                {/* SONI */}
                <View style={[styles.tableCellWrap, styles.colCount]}>
                  <Text style={styles.tableCellText}>
                    {product?.count}
                  </Text>
                </View>

                {/* NARXI */}
                <View style={[styles.tableCellWrap, styles.colPrice]}>
                  <Text style={styles.tableCellTextRight}>
                    {priceFormat(
                      product?.prices?.selling?.price *
                      (100 - product?.prices?.selling?.discount) /
                      100
                    )}
                  </Text>
                </View>

                {/* SUMMASI */}
                <View
                  style={[
                    styles.tableCellWrap,
                    styles.colTotal,
                    { borderRightWidth: 0 },
                  ]}
                >
                  <Text style={styles.tableCellTextRight}>
                    {priceFormat(product?.prices?.selling?.totalPrice)}
                  </Text>
                </View>
              </View>
            ))
          }
        </View>

        <View>
          <View style={styles.totalCalcTextWrapper}>
            <Text style={styles.totalCalcText}>Жами сумма:</Text>
            <View style={styles.totalCalcPriceText}>
              {order?.totalPrices?.length ? (
                order.totalPrices.map(price => (
                  <Text key={price?.currencyId}>
                    {priceFormat(price?.total)} {price?.currency?.symbol}
                  </Text>
                ))
              ) : (
                <Text>0</Text>
              )}
            </View>
          </View>
          <View style={styles.totalCalcTextWrapper}>
            <Text style={styles.totalCalcText}>Тулов килинди:</Text>
            <View style={styles.totalCalcPriceText}>
              {order?.totalPayments?.length ? (
                order.totalPayments.map(price => (
                  <Text key={price?.currencyId}>
                    {priceFormat(price?.total)} {price?.currency?.symbol}
                  </Text>
                ))
              ) : (
                <Text>0</Text>
              )}
            </View>
          </View>
          <View style={styles.totalCalcTextWrapper}>
            <Text style={styles.totalCalcText}>Мижоз карзи:</Text>
            <View style={styles.totalCalcPriceText}>
              {order?.client?.debtByCurrency?.length ? (
                order.client.debtByCurrency.map(price => (
                  <Text key={price?.currency?.id}>
                    {priceFormat(price?.amount)} {price?.currency?.symbol}
                  </Text>
                ))
              ) : (
                <Text>0</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
));


// PDF uchun stil
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  logo: {
    textAlign: 'center',
    fontSize: '28px',
    fontFamily: 'NotoSansBold',
  },
  topData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: -40,
  },

  table: {
    width: '100%',
    marginBottom: 10,
    marginTop: 20,
  },

  tableHeader: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
  },

  tableHeaderText: {
    textAlign: 'center',
    fontFamily: 'NotoSansBold',
    fontSize: 9,
    fontWeight: 800,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },

  tableRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    minHeight: 28,
  },

  tableCellWrap: {
    borderRightWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ===== COLUMNS ===== */

  colNumber: {
    width: 28,
  },

  colCategory: {
    width: 65,
  },

  colName: {
    flex: 1,
    textAlign: 'left',
  },

  colCheck: {
    width: 30,
  },

  colCount: {
    width: 40,
  },

  colPrice: {
    width: 75,
  },

  colTotal: {
    width: 80,
  },

  /* ===== TEXT ===== */

  tableCellText: {
    textAlign: 'center',
    fontSize: 8,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },

  tableCellTextLeft: {
    textAlign: 'left',
    width: '100%',
    fontSize: 8,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  tableCellTextRight: {
    textAlign: 'right',
    fontSize: 8,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },

  colImage: {
    width: 28,
  },

  productImage: {
    width: 28,
    height: 28,
    objectFit: 'contain',
  },

  // === YANGI HEADER: QR chap | markazda nomi/telefon | QR o'ng ===
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  qrBox: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 70,
    height: 70,
    objectFit: 'contain',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopName: {
    fontSize: 16,
    fontFamily: 'NotoSansBold',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  shopPhones: {
    fontSize: 10,
    fontFamily: 'NotoSans',
    textAlign: 'center',
  },
  buyerInfo: {
    paddingTop: 8,
  },
  buyerRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  buyerLabel: {
    fontSize: 11,
    fontFamily: 'NotoSansBold',
    fontWeight: 'bold',
    marginRight: 6,
    width: 110,
  },
  buyerValue: {
    fontSize: 11,
    fontFamily: 'NotoSans',
    flex: 1,
    paddingRight: 25,
  },
  // === /YANGI HEADER ===

  titleInfo: {
    marginBottom: -30,
  },
  title: {
    fontSize: 12,
    fontFamily: 'NotoSans',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    width: '70%',
  },
  titleSpan: {
    fontSize: 12,
    fontFamily: 'NotoSansBold',
    fontWeight: 'bold',
    marginRight: 30,
  },
  titleSpanData: {
    fontSize: 12,
    fontFamily: 'NotoSans',
    maxWidth: '70%',
  },
  logoImage: {
    marginTop: 30,
    width: 80,
    height: 80,
    marginRight: 40,
  },
  content: {
    fontSize: 12,
    marginBottom: 20,
  },
  tablePriceCol: {
    textAlign: 'right',
  },
  totalCalcTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  totalCalcText: {
    textAlign: 'right',
    fontSize: 9,
    fontFamily: 'NotoSansBold',
    fontWeight: 'bold',
  },
  totalCalcPriceText: {
    textAlign: 'left',
    fontSize: 9,
    fontFamily: 'NotoSans',
    width: 100,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});
