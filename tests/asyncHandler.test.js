const asyncHandler = require("../utils/asyncHandler");

describe("asyncHandler", () => {
  test("calls the wrapped function successfully", async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const handler = asyncHandler(async (req, res, next) => {
      res.success = true;
    });

    await handler(req, res, next);

    expect(res.success).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test("passes a rejected error to next", async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const error = new Error("Something went wrong");

    const handler = asyncHandler(async () => {
      throw error;
    });

    await handler(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});