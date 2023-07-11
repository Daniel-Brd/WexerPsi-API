import { PatientRepository } from "../../patient/repositories/patientRepository";
import { CreateTimelineDto } from "../dtos/createTimelineDto";
import { Timeline } from "../models/timeline";

export class TimelineRepository {
  constructor(private model: typeof Timeline, private patientRepository: PatientRepository) {}

  async create(timeline: CreateTimelineDto) {
    const result = await this.model.create(timeline);
    this.patientRepository.associateTimeline(timeline.patientId, result._id.toString());

    return result;
  }

  async getTimelineById(id: string) {
    return await this.model.findById(id);
  }
}
