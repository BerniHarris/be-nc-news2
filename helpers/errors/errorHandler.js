export const psqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ message: "Invalid input." });
  }
  if (err.code === "23503") {
    return res.status(404).send({ message: "Input not found." });
  }
  next(err);
};

export const customError = (err, req, res, next) => {
  if (err.status && err.message) {
    return res.status(err.status).send({ message: err.message });
  }
  next(err);
};

export const error500 = (err, req, res, next) => {
  return res.status(500).send({ message: "Internal Server Error" });
};

export const error404 = (req, res) => {
  return res.status(404).send({ message: "Path not found." });
};
