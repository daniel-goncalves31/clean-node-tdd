const { MongoClient } = require('mongodb')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let client, db

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
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = client.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
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
})
