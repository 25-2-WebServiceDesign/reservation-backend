process.env.NODE_ENV = "test";

jest.mock("../src/services/stores.service", () => ({
  createStore: jest.fn(),
  getStores: jest.fn(),
  getStoreReviews: jest.fn(),
  getStoreReservations: jest.fn(),
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
}));

const storesController = require("../src/controllers/stores.controller");
const storesService = require("../src/services/stores.service");

function makeRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
}

describe("stores.controller unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createStore: req.user.id를 ownerId로 합쳐서 서비스 호출", async () => {
    storesService.createStore.mockResolvedValue({ id: 1, name: "A" });

    const req = { body: { name: "A" }, user: { id: 10 } };
    const res = makeRes();
    const next = jest.fn();

    await storesController.createStore(req, res, next);

    expect(storesService.createStore).toHaveBeenCalledWith({ name: "A", ownerId: 10 });
    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({ store: { id: 1, name: "A" } });
  });

  test("createStore: 서비스 에러 발생 시 next(err)", async () => {
    const err = new Error("fail");
    storesService.createStore.mockRejectedValue(err);

    const req = { body: { name: "A" }, user: { id: 1 } };
    const res = makeRes();
    const next = jest.fn();

    await storesController.createStore(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  test("getStores: 200 응답", async () => {
  storesService.getStores.mockResolvedValue({
    data: [{ id: 1 }],
    totalCount: 1,
    totalPage: 1,
  });

  const req = { query: {} }; 
  const res = makeRes();
  const next = jest.fn();

  await storesController.getStores(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);

  expect(res.json).toHaveBeenCalledWith({
    data: { stores: [{ id: 1 }] },
    meta: {
      page: 1,
      limit: 5,
      totalCount: 1,
      totalPage: 1,
      timestamp: expect.any(String),
            },
        });
    });


  test("getStoreReviews: storeId invalid → 400", async () => {
    const req = { params: { id: "abc" }, query: {} };
    const res = makeRes();
    const next = jest.fn();

    await storesController.getStoreReviews(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(400);
  });

  test("getStoreReviews: 정상 파라미터 → service 호출", async () => {
    storesService.getStoreReviews.mockResolvedValue({ data: [] });

    const req = {
      params: { id: "3" },
      query: { page: "1", limit: "10", order: "DESC" },
    };
    const res = makeRes();
    const next = jest.fn();

    await storesController.getStoreReviews(req, res, next);

    expect(storesService.getStoreReviews).toHaveBeenCalledWith(3, {
      page: 1,
      limit: 10,
      order: "desc",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("addFavorite: storeId invalid → 400", async () => {
    const req = { params: { id: "0" }, user: { id: 1 } };
    const res = makeRes();
    const next = jest.fn();

    await storesController.addFavorite(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(storesService.addFavorite).not.toHaveBeenCalled();
  });

  test("removeFavorite: storeId invalid → 400", async () => {
    const req = { params: { id: "x" }, user: { id: 1 } };
    const res = makeRes();
    const next = jest.fn();

    await storesController.removeFavorite(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(storesService.removeFavorite).not.toHaveBeenCalled();
  });
});
