const {sequelize, User, RefreshToken} = require("./models");

// test functions
beforeEach(async () => {
    await sequelize.sync({force: true});
})

afterEach(async () => {
    // await sequelize.truncate({cascade: true})
})

afterAll(async () => {
    await sequelize.close();
})

// 공통 테스트용 User 생성 함수
const createUser = async (override = {}) => {
    return User.create({
        nickname: "tester",
        email: `user_${Date.now()}@test.com`,
        ...override,
    });
};

describe("User Create", () => {
    test("user create with uid", async () => {
        const user = await createUser();
        expect(user).toMatchObject({
            nickname: "tester"
        });
    })
})