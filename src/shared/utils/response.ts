const response = ({ res, message, status = 200, data = {} }: any) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export default response;
