import { Request, Response } from "express";
import { TimelineService } from "../services/timelineService";

export class TimelineController {
  constructor(private service: TimelineService) {}

  async create(req: Request, res: Response) {
    const {
      params: { id: patientId },
      body,
    } = req;

    const result = await this.service.create({ patientId, body });

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    res.status(200).json(result);
  }
}
