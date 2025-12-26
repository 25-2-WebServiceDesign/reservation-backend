process.env.NODE_ENV = "test";

jest.mock("../src/utils/jwt.util", () => ({
  verifyAccessToken: jest.fn(),
}));

const { authenticate, authenticateRole } = require("../src/middleware/auth.middleware");
const jwtUtils = require("../src/utils/jwt.util");

function makeReq({ authHeader, user } = {}) {
  return {
    user,
    get: jest.fn((key) => (key === "Authorization" ? authHeader : undefined)),
  };
}

describe("auth.middleware unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Authorization 헤더 없음 → 401", () => {
    const req = makeReq();
    const next = jest.fn();

    authenticate(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("Bearer 토큰 없음 → 401", () => {
    const req = makeReq({ authHeader: "Bearer" });
    const next = jest.fn();

    authenticate(req, {}, next);

    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("토큰 검증 실패 → 401", () => {
    jwtUtils.verifyAccessToken.mockReturnValue(null);

    const req = makeReq({ authHeader: "Bearer bad.token" });
    const next = jest.fn();

    authenticate(req, {}, next);

    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("정상 토큰 → req.user 세팅", () => {
    jwtUtils.verifyAccessToken.mockReturnValue({ id: 1, role: "OWNER" });

    const req = makeReq({ authHeader: "Bearer good.token" });
    const next = jest.fn();

    authenticate(req, {}, next);

    expect(req.user).toEqual({ id: 1, role: "OWNER" });
    expect(next).toHaveBeenCalledWith();
  });

  test("authenticateRole: req.user 없음 → 401", () => {
    const req = makeReq();
    const next = jest.fn();

    authenticateRole(["OWNER"])(req, {}, next);

    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("authenticateRole: 권한 없음 → 403", () => {
    const req = makeReq({ user: { id: 1, role: "CUSTOMER" } });
    const next = jest.fn();

    authenticateRole(["OWNER"])(req, {}, next);

    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test("authenticateRole: 권한 있음 → 통과", () => {
    const req = makeReq({ user: { id: 1, role: "ADMIN" } });
    const next = jest.fn();

    authenticateRole(["OWNER", "ADMIN"])(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });
});
