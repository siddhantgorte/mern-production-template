import mongoose from "mongoose";

import ApiError from "../utils/api-error.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  /**
   * Mongoose validation error.
   */
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    error = ApiError.badRequest(
      "Validation failed",
      errors
    );
  }

  /**
   * Mongoose invalid ObjectId.
   */
  if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(
      `Invalid ${err.path}: ${err.value}`
    );
  }

  /**
   * MongoDB duplicate key error.
   */
  if (err?.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});

    error = ApiError.conflict(
      `Duplicate value for field(s): ${fields.join(", ")}`
    );
  }

  /**
   * Convert unknown errors into ApiError.
   */
  if (!(error instanceof ApiError)) {
    error = ApiError.internal();
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    data: null,
    message: error.message,
  };

  if (error.errors?.length > 0) {
    response.errors = error.errors;
  }

  /**
   * Never expose internal stack traces in production.
   */
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  console.error({
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode: error.statusCode,
    message: error.message,
    stack: err.stack,
  });

  res.status(error.statusCode).json(response);
};

export default errorMiddleware;
