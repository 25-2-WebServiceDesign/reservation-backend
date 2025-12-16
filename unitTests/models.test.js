const {sequelize, User, RefreshToken} = require("./models")


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

describe("User CRUD", () => {
    test('user table create', async () => {
        const userData = {
            nickname: "nn1",
            email: "asd@naver.com",
        }

        const user = await User.create(userData);
        const plainUser = user.toJSON();
        expect(plainUser).toMatchObject(userData)
    })

    test('user table read', async () => {
        const data = {
            nickname: "nn1",
            email: "assdfd@naver.com",
        }

        const user = await User.create(data);
        const readUser = await User.findByPk(user.id);

        expect(readUser.toJSON()).toMatchObject(user.toJSON())
    })

    test('user table update', async () => {
        const data = {
            nickname: "test1",
            email: "sdfsdf@naver.com",
        }
        const newEmail = "updated@naver.com"

        const user = await User.create(data);
        const [affected] = await User.update({
            email: newEmail
        }, {where: {id: user.id}});

        const updatedUser = await User.findByPk(user.id)

        expect(affected).toBe(1);
        
        expect(updatedUser.toJSON()).toMatchObject({
            ...data,
            email: newEmail
        })
    })

    test('user table soft delete & restore', async () => {
        const data = {
            nickname: "test1",
            email: "sdfsfsfds@naver.com"
        }

        const user = await User.create(data);
        let affected = await User.destroy({where: {id: user.id}});

        expect(affected).toBe(1);

        const deletedUser = await User.findByPk(user.id, {
            paranoid: false
        })

        expect(deletedUser.toJSON().deletedAt).toBeTruthy()

        // restore
        affected = await User.restore({where: {id: user.id}});
        expect(affected).toBe(1);

        const restoredUser = await User.findByPk(user.id);
        expect(restoredUser.toJSON().deletedAt).toBeNull()
    })
})


// RefreshToken Table Test
describe("RefreshToken CRUD", () => {
    test("CREATE: refresh token 생성", async () => {
        const user = await createUser();

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
        const refreshToken = await RefreshToken.create({
            userId: user.id,
            token: "test-refresh-token",
            expiresAt,
        });

        expect(refreshToken.toJSON()).toMatchObject({
            userId: user.id,
            token: "test-refresh-token",
            revokedAt: null,
        });

        expect(refreshToken.expiresAt).toBeInstanceOf(Date);
    });


    test("READ: token으로 refresh token 조회", async () => {
        const user = await createUser();

        const refreshToken = await RefreshToken.create({
            userId: user.id,
            token: "read-token",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        });

        const found = await RefreshToken.findOne({
            where: { token: "read-token" },
        });

        expect(found).not.toBeNull();
        expect(found.toJSON()).toMatchObject({
            userId: user.id,
            token: "read-token",
        });
    });


    test("UPDATE: refresh token revoke 처리", async () => {
        const user = await createUser();

        const refreshToken = await RefreshToken.create({
            userId: user.id,
            token: "revoke-token",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        });

        const revokedAt = new Date();

        const [affected] = await RefreshToken.update(
            { revokedAt },
            { where: { id: refreshToken.id } }
        );

        expect(affected).toBe(1);

        const updated = await RefreshToken.findByPk(refreshToken.id);
        expect(updated.revokedAt).not.toBeNull();
    });


    test("DELETE: refresh token 삭제", async () => {
        const user = await createUser();

        const refreshToken = await RefreshToken.create({
            userId: user.id,
            token: "delete-token",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        });

        const affected = await RefreshToken.destroy({
            where: { id: refreshToken.id },
        });

        expect(affected).toBe(1);

        const deleted = await RefreshToken.findByPk(refreshToken.id);
        expect(deleted).toBeNull();
    });


    test("CASCADE: user 삭제 시 refresh token도 삭제", async () => {
        const user = await createUser();

        await RefreshToken.create({
            userId: user.id,
            token: "cascade-token",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        });

        await User.destroy({ where: { id: user.id }, force: true });

        const token = await RefreshToken.findOne({
            where: { token: "cascade-token" },
        });

        expect(token).toBeNull();
    });

});
