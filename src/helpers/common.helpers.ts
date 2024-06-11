export function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const getExternalId = (partnerId: string, partnerCustomerId: string) => {
  return `${partnerId}_${partnerCustomerId}`;
};

export function isValidJWT(token: string) {
  const parts = token.split('.');
  return parts.length === 3;
}
