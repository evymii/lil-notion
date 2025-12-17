import app from "../src/index.js";

export default async (req: any, res: any) => {
  await app(req, res);
};
