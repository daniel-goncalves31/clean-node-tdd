const jwt = require('jsonwebtoken')
const { MissingParamError } = require('../errors')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  test('should return null if JWT return null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
  test('should return null if JWT return null', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })
  test('should call jwt with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })
  test('should throw if no secret is provided', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })
  test('should throw if no secret is provided', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
