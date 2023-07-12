import { TimelineRepository } from "../../timeline/repositories/timelineRepository";
import { createOccurenceDto } from "../dtos/createOccurrenceDto";
import { Occurrence } from "../models/occurrence";

export class OccurrenceRepository {
  constructor(private model: typeof Occurrence, private timelineRepository: TimelineRepository) {}

  async create(occurrence: createOccurenceDto) {
    const result = await this.model.create(occurrence);
    this.timelineRepository.associateOccurrence(occurrence.timelineId, result._id.toString());

    return result;
  }
}
