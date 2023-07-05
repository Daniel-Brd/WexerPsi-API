import * as JWT from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";

export class EnsureAuth {
  static async ensureAuth(req: Request, res: Response, next: NextFunction) {
    const {
      headers: { authorization = null },
    } = req;

    if (!authorization) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const [, token] = authorization.split(" ");

    try {
      JWT.verify(token, process.env.JWT_SECRET_KEY as string);
    } catch (err: any) {
      return res.status(401).json({ error: "Invalid token" });
    }

    next();
  }
}
