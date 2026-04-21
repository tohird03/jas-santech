export const formatPhoneNumber = (phoneNumber?: string | number | null) => {
  if (!phoneNumber) return '998000000000';

  const cleaned = String(phoneNumber);

  const formattedNumber = cleaned.replace(
    /^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
    '$1 $2 $3 $4 $5'
  );

  return formattedNumber;
};

export function phoneFormat(input: string | number | undefined) {
  if (!input) {
    return '';
  }

  return String(input).replace(/^(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
}

export const regexPhoneNumber = new RegExp(/^\d{9}$/);
