const crypto = require('crypto');


export function getSignature(queryString) {
  return crypto
    .createHmac('sha256', process.env.NEXT_PUBLIC_SECRET_KEY)
    .update(queryString)
    .digest('hex');
}

export function toQueryString(params) {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}