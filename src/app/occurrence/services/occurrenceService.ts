import { TimelineService } from "../../timeline/services/timelineService";
import { CreateOccurenceServiceDto } from "../dtos/createOccurrenceServiceDto";
import { UpdateOccurenceDto } from "../dtos/updateOccurrenceDto";
import { OccurrenceRepository } from "../repositories/occurrenceRepository";

export class OccurrenceService {
  constructor(private repository: OccurrenceRepository, private timelineService: TimelineService) {}

  async create(body: CreateOccurenceServiceDto, timelineId: string) {
    const payload = {
      timelineId,
      ...body,
    };

    const isTimelineValid = await this.timelineService.getTimelineById(timelineId);

    if (!isTimelineValid) {
      return {
        error: true,
        message: "Timeline not found",
        status: 404,
      };
    }

    try {
      return await this.repository.create(payload);
    } catch (err) {
      return { error: true, message: " Internal server error", status: 500 };
    }
  }

  async getOccurrenceById(id: string) {
    const result = await this.repository.getOccurrenceById(id);

    if (!result) {
      return { error: true, message: "Occurrence not found", status: 404 };
    }

    return result;
  }

  async updateOccurrence(id: string, payload: UpdateOccurenceDto) {
    const occurrence = await this.getOccurrenceById(id);

    if (!Boolean(Object.keys(payload).length)) {
      return { error: true, message: "Empty body", status: 400 };
    }

    if ("error" in occurrence) {
      return occurrence;
    }

    try {
      const result = await this.repository.updateOccurrence(id, payload);
      return result ? result : { error: true, message: "Internal server error", status: 500 };
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }
}
