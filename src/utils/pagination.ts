export const getPagination = (page: number = 1, limit: number = 10): number => {
  const skip = (page - 1) * limit;
  return skip;
};