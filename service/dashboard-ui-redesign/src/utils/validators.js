export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhoneNumber(phone) {
  const re = /^[\d\s\-\+\(\)]{10,}$/
  return re.test(phone)
}

export function validateRequired(value) {
  return value && value.trim().length > 0
}

export function validateMinLength(value, min) {
  return value && value.length >= min
}
