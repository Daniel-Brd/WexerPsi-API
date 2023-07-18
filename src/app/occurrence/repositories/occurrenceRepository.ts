import { TimelineRepository } from "../../timeline/repositories/timelineRepository";
import { CreateOccurenceDto } from "../dtos/createOccurrenceDto";
import { UpdateOccurenceDto } from "../dtos/updateOccurrenceDto";
import { Occurrence } from "../models/occurrence";

export class OccurrenceRepository {
  constructor(private model: typeof Occurrence, private timelineRepository: TimelineRepository) {}

  async create(occurrence: CreateOccurenceDto) {
    const result = await (await this.model.create(occurrence)).populate("files");
    this.timelineRepository.associateOccurrence(occurrence.timelineId, result._id.toString());

    return result;
  }

  async getOccurrenceById(id: string) {
    return await this.model.findById(id).populate("files");
  }

  async updateOccurrence(id: string, payload: UpdateOccurenceDto) {
    return await this.model.findByIdAndUpdate(id, payload, { new: true }).populate("files");
  }
}
