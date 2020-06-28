class TokenGenerator {
  async generate (userId) {
    return null
  }
}

describe('Token Generator', () => {
  test('should return null if JWT return null', async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
})
