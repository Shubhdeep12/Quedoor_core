import logger from "../middlewares/logger";

const createError = (status: number, message: any) => {
  logger.error(message);
  const err: any = new Error();
  err.status = status;
  err.message = message;
  return err;
};

export default createError;
