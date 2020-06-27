class EmailValidator {
  isValid (email) {
    return true
  }
}
describe('EmailValidator', () => {
  test('should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('invalid@email.com')
    expect(isEmailValid).toBe(true)
  })
})
