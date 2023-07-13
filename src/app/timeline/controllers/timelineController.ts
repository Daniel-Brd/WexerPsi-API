import { Request, Response } from "express";
import { TimelineService } from "../services/timelineService";
import { makeUpdateTimelineSchema } from "../schemas/updateTimelineSchema";

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

    res.status(201).json(result);
  }

  async getTimelineById(req: Request, res: Response) {
    const {
      params: { id },
    } = req;

    const result = await this.service.getTimelineById(id);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    res.status(200).json(result);
  }

  async updateTimeline(req: Request, res: Response) {
    const {
      params: { id },
      body,
    } = req;

    try {
      await makeUpdateTimelineSchema().validate(body);
    } catch (err: any) {
      return res.status(400).json({ error: err.errors });
    }

    const result = (await this.service.updateTimeline(id, body)) as any;

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    res.status(200).json(result);
  }

  async getOccurencesByTimeline(req: Request, res: Response) {
    const {
      params: { id: timelineId },
    } = req;

    const result = await this.service.getOccurrencesByTimeline(timelineId);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    res.status(200).json(result);
  }
}
