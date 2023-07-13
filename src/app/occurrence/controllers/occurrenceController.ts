import { Request, Response } from "express";
import { OccurrenceService } from "../services/occurrenceService";
import { makeCreateOccurrenceSchema } from "../schemas/occurrenceSchema";

export class OccurrenceController {
  constructor(private service: OccurrenceService) {}

  async create(req: Request, res: Response) {
    const {
      params: { id: timelineId },
      body,
    } = req;

    try {
      await makeCreateOccurrenceSchema().validate(body);
    } catch (err: any) {
      return res.status(400).json({ error: err.errors });
    }

    const result = await this.service.create(body, timelineId);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    res.status(201).json(result);
  }

  async getOccurrenceById(req: Request, res: Response) {
    const {
      params: { id },
    } = req;

    const result = await this.service.getOccurrenceById(id);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(200).json(result);
  }
}
