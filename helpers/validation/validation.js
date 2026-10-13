export const validateId = (id, name = "id") => {
  if (!id || isNaN(id)) {
    return { status: 400, message: `Invalid ${name}` };
  }
  return null;
};
