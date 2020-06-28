const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepositorySpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'
  return tokenGeneratorSpy
}
const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
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
  test('should throw if no dependency is provided', () => {
    const sut = new AuthUseCase()
    const email = 'any_email@email.com'
    const password = 'any_password'
    const promise = sut.auth(email, password)
    expect(promise).rejects.toThrow()
  })
  test('should throw if no LoadUserByEmailRepository is provided', () => {
    const sut = new AuthUseCase({})
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
  test('should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const email = 'invalid_email@email.com'
    const password = 'any_password'
    const accessToken = await sut.auth(email, password)
    expect(accessToken).toBeNull()
  })
  test('should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const email = 'valid_email@email.com'
    const password = 'invalid_password'
    const accessToken = await sut.auth(email, password)
    expect(accessToken).toBeNull()
  })
  test('should call Encrypter with correct password', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    const email = 'any_email@email.com'
    const password = 'any_password'
    await sut.auth(email, password)
    expect(encrypterSpy.password).toBe(password)
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
  test('should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    const email = 'valid_email@email.com'
    const password = 'valid_password'
    await sut.auth(email, password)
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })
  test('should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const email = 'valid_email@email.com'
    const password = 'valid_password'
    const accessToken = await sut.auth(email, password)
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })
})
