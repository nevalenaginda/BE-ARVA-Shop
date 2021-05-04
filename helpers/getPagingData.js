const getPagingData = (data, page, limit, req) => {
  const message = data.rows
    .filter((item) => item.to === req.body.to || item.from === req.body.to)
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((item) => {
      const date = new Date(item.createdAt).toDateString();
      return {
        ...item.dataValues,
        time: `${date.split(" ")[0]}, ${
          new Date(item.createdAt).getHours() < 10
            ? `0${new Date(item.createdAt).getHours()}`
            : new Date(item.createdAt).getHours()
        }:${
          new Date(item.createdAt).getMinutes() < 10
            ? `0${new Date(item.createdAt).getMinutes()}`
            : new Date(item.createdAt).getMinutes()
        }`,
      };
    });
  const { count: totalItems } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, message, totalPages, currentPage };
};

module.exports = getPagingData;
