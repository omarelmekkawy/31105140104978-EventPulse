const AppError = require("../utils/AppError");

describe("AppError", () => {
  test("creates an operational error with message and status code", () => {
    const error = new AppError("Event not found", 404);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Event not found");
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  test("creates an error with the supplied status code", () => {
    const error = new AppError("Access denied", 403);

    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Access denied");
    expect(error.isOperational).toBe(true);
  });
});