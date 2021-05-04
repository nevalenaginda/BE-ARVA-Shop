module.exports = (res, code, stat, msg, data) => {
  return res.status(code).json({
    status: stat,
    message: msg,
    data: data,
  });
};
