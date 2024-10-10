import { Request, Response, NextFunction } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";

// Mocking the jsonwebtoken verify method
// jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = httpMocks.createResponse();
    jest.spyOn(mockResponse, "status").mockReturnThis();
    jest.spyOn(mockResponse, "send").mockReturnThis();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 401 if no token is provided", () => {
    mockRequest = {
      headers: {},
    };

    require("../../middleware/authMiddleware").default(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "Unauthorized: No token provided",
    });
  });

  it("should validate token and execute the callback", () => {
    const token = "validToken";

    mockRequest = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    jest
      .spyOn(jwt, "verify")
      .mockImplementation((token, secret, callback: any) => {
        callback(null, { userId: "123" });
      });

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      process.env.VITE_JWT_SECRET ?? "",
      expect.any(Function)
    );

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should return 403 if token is invalid", () => {
    const token = jwt.sign("invalidUser", "invalidSecret");
    mockRequest = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    jest.spyOn(jwt, "verify");

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      process.env.VITE_JWT_SECRET ?? "",
      expect.any(Function)
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "Token verification failed.",
      error: "invalid signature",
    });
  });
});
