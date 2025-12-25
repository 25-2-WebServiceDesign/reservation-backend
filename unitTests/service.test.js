process.env.NODE_ENV = "test";

jest.mock("../src/repositories", () => ({
  storeRepo: {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  reservationRepo: {
    findAll: jest.fn(),
  },
  reservationUnitRepo: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
  reviewRepo: {
    findAll: jest.fn(),
  },
  favoriteRepo: {},
}));

jest.mock("../src/models", () => {
  const actual = jest.requireActual("../src/models");
  return {
    ...actual,
    Store: {
      findByPk: jest.fn(),
      findAll: jest.fn(),
    },
  };
});

const AppError = require("../src/responses/AppError");
const storesService = require("../src/services/stores.service");
const { storeRepo, reservationUnitRepo } = require("../src/repositories");
const { Store } = require("../src/models");

describe("stores.service (unit tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createStore: name 없으면 400 VALIDATION_ERROR", async () => {
    await expect(storesService.createStore({})).rejects.toMatchObject({
      name: "VALIDATION_ERROR",
      statusCode: 400,
    });
  });

  test("createStore: 정상이면 storeRepo.create 호출", async () => {
    storeRepo.create.mockResolvedValue({ id: 1, name: "A" });
    const res = await storesService.createStore({ name: "A" });
    expect(storeRepo.create).toHaveBeenCalledWith({ name: "A" });
    expect(res).toMatchObject({ id: 1, name: "A" });
  });

  test("getStoreById: 잘못된 id면 400 BAD_REQUEST", async () => {
    await expect(storesService.getStoreById("abc")).rejects.toMatchObject({
      name: "BAD_REQUEST",
      statusCode: 400,
    });
  });

  test("getStoreById: 없으면 404 NOT_FOUND", async () => {
    Store.findByPk.mockResolvedValue(null);
    await expect(storesService.getStoreById(999)).rejects.toMatchObject({
      name: "NOT_FOUND",
      statusCode: 404,
    });
  });

  test("deleteStore: store 없으면 404", async () => {
    storeRepo.findById.mockResolvedValue(null);
    await expect(storesService.deleteStore(1, { id: 1, role: "OWNER" })).rejects.toMatchObject({
      name: "NOT_FOUND",
      statusCode: 404,
    });
  });

  test("deleteStore: OWNER가 남의 store 삭제하면 403 FORBIDDEN", async () => {
    storeRepo.findById.mockResolvedValue({ id: 10, ownerId: 999 });
    await expect(storesService.deleteStore(10, { id: 1, role: "OWNER" })).rejects.toMatchObject({
      name: "FORBIDDEN",
      statusCode: 403,
    });
  });

  test("getStoreUnits: order가 asc/desc 아니면 400", async () => {
    await expect(storesService.getStoreUnits(1, { page: 1, limit: 10, order: "xxx" })).rejects.toMatchObject({
      name: "BAD_REQUEST",
      statusCode: 400,
    });
  });

  test("createStoreUnit: description 없으면 400 VALIDATION_ERROR", async () => {
    storeRepo.findById.mockResolvedValue({ id: 1, ownerId: 1 });
    await expect(
      storesService.createStoreUnit(1, { name: "unitA" }, { id: 1, role: "OWNER" })
    ).rejects.toMatchObject({
      name: "VALIDATION_ERROR",
      statusCode: 400,
    });
  });
});
