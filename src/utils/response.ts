const response = ({ res, message, status = 200, data = undefined }: any) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export default response;
