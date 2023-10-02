const createError = (status: number, message: any) => {
  const err: any = new Error();
  err.status = status;
  err.message = message;
  return err;
};

export default createError;
