import { umsStages } from '@/api/endpoints';

export const imageUrlWithBase = (url: string) => {
  if (url) {
    return `${umsStages?.apiUrl}/uploads/${url}`;
  }

  return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzG8YKX7mfchn4PMy-6mE_PETf6MSRUHGHfwi0KYUaGw&s';
};
