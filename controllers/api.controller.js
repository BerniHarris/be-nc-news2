import fs from "fs/promises";
import path from "path";

export const getApi = async (req, res, next) => {
  try {
    const filePath = path.join(process.cwd(), "endpoints.json");
    const data = await fs.readFile(filePath, "utf8");
    const endpointsJson = JSON.parse(data);

    res.status(200).send({ endpoints: endpointsJson });
  } catch (err) {
    next(err);
  }
};
