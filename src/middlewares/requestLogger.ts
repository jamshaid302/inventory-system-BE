import { NextFunction, Request, Response } from "express";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    console.info(`[${method}] ${originalUrl} - ${statusCode} (${duration}ms)`);
  });

  next();
};

export { requestLogger };
