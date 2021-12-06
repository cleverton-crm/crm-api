export const ResponseSuccessData = (message: string) => {
  return {
    statusCode: 200,
    message: message,
    status: true,
  };
};
