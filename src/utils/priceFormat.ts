export const priceFormat = (price: string | number | null | undefined) => {
  if (!price) {
    return '0';
  }

  const numberPrice = Number(price);

  if (isNaN(numberPrice)) {
    return '0';
  }

  const formattedPrice = numberPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  }).replace(/,/g, ' ');

  return formattedPrice;
};
