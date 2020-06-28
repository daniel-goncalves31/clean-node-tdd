const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MongoHelper = require('../helpers/mongo-helper')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('valid_email@email.com')
    expect(user).toBeNull()
  })
  test('should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    const email = 'valid_email@email.com'
    const mockUser = await userModel.insertOne({
      email,
      password: 'hashed_password',
      name: 'John Doe'
    })
    const user = await sut.load(email)
    expect(user).toEqual({
      _id: mockUser.ops[0]._id,
      password: mockUser.ops[0].password
    })
  })
  test('should throws if no userModel is provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('valid_email@email.com')
    expect(promise).rejects.toThrow()
  })
})
