const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return {
    sut,
    loadUserByEmailRepositorySpy
  }
}

describe('UseCase', () => {
  test('should throw if no email is provided', () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('should throw if no password is provided', () => {
    const { sut } = makeSut()
    const email = 'any_email@email.com'
    const promise = sut.auth(email)
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
  test('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const email = 'any_email@email.com'
    const password = 'any_password'
    await sut.auth(email, password)
    expect(loadUserByEmailRepositorySpy.email).toBe(email)
  })
  test('should throw if no LoadUserByEmailRepository is provided', () => {
    const sut = new AuthUseCase()
    const email = 'any_email@email.com'
    const password = 'any_password'
    const promise = sut.auth(email, password)
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })
  test('should throw if LoadUserByEmailRepository has no method load', () => {
    class LoadUserByEmailRepositorySpy {}
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
    const email = 'any_email@email.com'
    const password = 'any_password'
    const promise = sut.auth(email, password)
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })
  test('should return null if LoadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const email = 'invalid_email@email.com'
    const password = 'any_password'
    const accessToken = await sut.auth(email, password)
    expect(accessToken).toBeNull()
  })
})
