import { Request, Response } from "express";
import {
  makeCreateUserSchema,
  makeFindByEmailUserSchema,
  makeUpdateUserSchema,
} from "../schemas/userSchema";
import { UserService } from "../services/userService";
import { log } from "console";

export class UserController {
  constructor(private service: UserService) {}

  async create(req: Request, res: Response) {
    const { body, file } = req;

    try {
      await makeCreateUserSchema().validate(body);
    } catch (err: any) {
      return res.status(400).json({ errors: err.errors });
    }

    const payload = {
      ...body,
      file: {
        filename: file?.filename,
        mimetype: file?.mimetype,
      },
    };

    const result = (await this.service.create(payload)) as any;

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(201).json(result);
  }

  async findByEmail(req: Request, res: Response) {
    const { body } = req;

    try {
      await makeFindByEmailUserSchema().validate(body);
    } catch (err: any) {
      return res.status(400).json({ errors: err.errors });
    }

    const result = await this.service.findByEmail(body);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(200).json(result);
  }

  async deleteById(req: Request, res: Response) {
    const {
      params: { id },
    } = req;

    const result = await this.service.deleteById(id);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(200).json(result);
  }

  async updateById(req: Request, res: Response) {
    const {
      params: { id },
      body,
      file,
    } = req;

    try {
      await makeUpdateUserSchema().validate(body);
    } catch (err: any) {
      return res.status(400).json({ errors: err.errors });
    }

    const payload = file
      ? {
          ...body,
          file: {
            filename: file?.filename,
            mimetype: file?.mimetype,
          },
        }
      : { ...body };

    const result = await this.service.updateById(id, payload);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(200).json(result);
  }
}
