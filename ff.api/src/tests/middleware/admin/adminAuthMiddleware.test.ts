import { Request, Response, NextFunction } from "express";
import adminAuthMiddleware from "../../../middleware/adminAuthMiddleware";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";

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

    require("../../../middleware/authMiddleware").default(
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
        callback(null, { id: "123" });
      });

    adminAuthMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      process.env.VITE_JWT_SECRET ?? ""
    );
  });

  it("should return 403 if token is invalid", () => {
    const token = jwt.sign("invalidUser", "invalidSecret");
    mockRequest = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    jest.spyOn(jwt, "verify");

    adminAuthMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      process.env.VITE_JWT_SECRET ?? ""
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "Forbidden: Token verification failed" });
  });
});
