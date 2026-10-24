export const successResponse = (res, { statusCode = 200, message = 'Success', data = null, ...rest }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...rest
  });
};

export const errorResponse = (res, { statusCode = 500, message = 'An error occurred', errors = null }) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
