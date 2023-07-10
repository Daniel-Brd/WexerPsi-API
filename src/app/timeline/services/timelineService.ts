import { PatientRepository } from "../../patient/repositories/patientRepository";
import { CreateTimelineServiceDto } from "../dtos/createTimelineServiceDto";
import { TimelineRepository } from "../repositories/timelineRepository";

export class TimelineService {
  constructor(private repository: TimelineRepository) {}

  async create({ patientId, body }: CreateTimelineServiceDto) {
    const payload = {
      patientId,
      ...body,
    };

    try {
      return await this.repository.create(payload);
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }
}
