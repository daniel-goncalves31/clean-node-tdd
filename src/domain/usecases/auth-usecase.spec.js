const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

describe('UseCase', () => {
  test('should throw if no email is provided', () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('should throw if no password is provided', async () => {
    const sut = new AuthUseCase()
    const email = 'any_email@email.com'
    const promise = sut.auth(email)
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
