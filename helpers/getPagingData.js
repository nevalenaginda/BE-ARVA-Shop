const getPagingData = (data, page, limit, req) => {
  const product = data.rows;
  const { count: totalItems } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, product, totalPages, currentPage };
};

module.exports = getPagingData;
