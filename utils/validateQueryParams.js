exports.validateQueryParams = (query = {}) => {
  let { searchTerm, page, limit, sortBy, sortOrder } = query;

  if (searchTerm === "undefined" || searchTerm === "null") searchTerm = "";
  if (sortBy === "undefined" || sortBy === "null") sortBy = undefined;
  if (sortOrder === "undefined" || sortOrder === "null") sortOrder = undefined;
  if (page === "undefined" || page === "null") page = undefined;
  if (limit === "undefined" || limit === "null") limit = undefined;

  searchTerm = typeof searchTerm === "string" ? searchTerm.trim() : "";
  page = parseInt(page);
  limit = parseInt(limit);
  sortBy = typeof sortBy === "string" ? sortBy : "createdAt";
  sortOrder = typeof sortOrder === "string" ? sortOrder.toLowerCase() : "desc";

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;
  if (!["asc", "desc"].includes(sortOrder)) sortOrder = "desc";

  return {
    searchTerm,
    page,
    limit,
    offset: (page - 1) * limit,
    sortBy,
    sortOrder,
  };
};
