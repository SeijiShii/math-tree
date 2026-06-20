// 送信前 PII scrub（SEC-003）。email / 電話 / 緯度経度を除去してから外部 AI へ。
const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const PHONE = /(?:\+?\d{1,3}[-\s]?)?(?:0\d{1,4}[-\s]?)\d{1,4}[-\s]?\d{3,4}/g
const LATLNG = /\b-?\d{1,3}\.\d{4,},\s*-?\d{1,3}\.\d{4,}\b/g

export function scrubPII(text: string): string {
  return text
    .replace(EMAIL, '[email]')
    .replace(LATLNG, '[location]')
    .replace(PHONE, '[phone]')
}
