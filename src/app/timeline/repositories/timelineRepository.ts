import { PatientRepository } from "../../patient/repositories/patientRepository";
import { CreateTimelineDto } from "../dtos/createTimelineDto";
import { UpdateTimelineDTO } from "../dtos/updateTimelineDto";
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

  async updateTimeline(id: string, payload: UpdateTimelineDTO) {
    return await this.model.findByIdAndUpdate(id, payload, { new: true });
  }

  async associateOccurrence(id: string, occurrenceId: string) {
    return await this.model.findByIdAndUpdate(id, {
      $push: { occurrences: [occurrenceId] },
    });
  }
}
