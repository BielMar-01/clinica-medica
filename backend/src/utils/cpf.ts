export function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value)

  if (cpf.length !== 11) {
    return false
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  const digits = cpf
    .split('')
    .map(Number)

  const calculateDigit = (
    baseDigits: number[],
    initialWeight: number,
  ) => {
    const sum = baseDigits.reduce(
      (accumulator, digit, index) =>
        accumulator +
        digit * (initialWeight - index),
      0,
    )

    const remainder = sum % 11

    return remainder < 2
      ? 0
      : 11 - remainder
  }

  const firstDigit =
    calculateDigit(
      digits.slice(0, 9),
      10,
    )

  if (firstDigit !== digits[9]) {
    return false
  }

  const secondDigit =
    calculateDigit(
      digits.slice(0, 10),
      11,
    )

  return secondDigit === digits[10]
}