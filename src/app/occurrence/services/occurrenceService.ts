import { TimelineService } from "../../timeline/services/timelineService";
import { createOccurenceServiceDto } from "../dtos/createOccurrenceServiceDto";
import { OccurrenceRepository } from "../repositories/occurrenceRepository";

export class OccurrenceService {
  constructor(private repository: OccurrenceRepository, private timelineService: TimelineService) {}

  async create(body: createOccurenceServiceDto, timelineId: string) {
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
}
