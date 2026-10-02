export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function whatsappLink(value) {
  if (!value) return ''
  if (/^https?:/i.test(value)) return value
  const digits = String(value).replace(/\D/g, '')
  return `https://wa.me/${digits}`
}

export function mailtoLink(value) {
  if (!value) return ''
  return /^mailto:/i.test(value) ? value : `mailto:${value}`
}

export function cap(str) {
  return String(str || '').charAt(0).toUpperCase() + String(str || '').slice(1)
}
