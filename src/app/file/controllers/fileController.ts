import { Request, Response } from "express";
import { FileService } from "../services/fileService";

export class FileController {
  constructor(private service: FileService) {}

  async create(req: Request, res: Response) {
    const { body } = req;

    const result = await this.service.create(body);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    res.status(201).json(result);
  }
}
