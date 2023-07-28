import { Request, Response } from "express";
import { OccurrenceService } from "../services/occurrenceService";
import { makeCreateOccurrenceSchema } from "../schemas/occurrenceSchema";
import { makeUpdateOccurrenceSchema } from "../schemas/updateOccurrenceSchema";

export class OccurrenceController {
  constructor(private service: OccurrenceService) {}

  async create(req: Request, res: Response) {
    const {
      params: { id: timelineId },
      body,
      files,
    } = req;

    try {
      await makeCreateOccurrenceSchema().validate(body);
    } catch (err: any) {
      return res.status(400).json({ error: err.errors });
    }

    const payload = files ? { ...body, files } : { ...body };

    const result = await this.service.create(payload, timelineId);

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

    if (result) {
      if ("error" in result) {
        return res.status(result.status).json(result);
      }
      return res.status(200).json(result);
    }

    return res.status(200).json(result);
  }

  async updateOccurrence(req: Request, res: Response) {
    const {
      params: { id },
      body,
      files,
    } = req;

    try {
      await makeUpdateOccurrenceSchema().validate(body);
    } catch (err: any) {
      res.status(400).json({ error: err.errors });
    }

    const payload = files ? { ...body, files } : { ...body };

    const result = await this.service.updateOccurrence(id, payload);

    if (result) {
      if ("error" in result) {
        return res.status(result.status).json(result);
      }
      return res.status(200).json(result);
    }
  }
}
