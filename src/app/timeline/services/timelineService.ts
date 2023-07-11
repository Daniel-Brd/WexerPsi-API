import { CreateTimelineServiceDto } from "../dtos/createTimelineServiceDto";
import { UpdateTimelineDTO } from "../dtos/updateTimelineDto";
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

  async getTimelineById(id: string) {
    const timeline = await this.repository.getTimelineById(id);

    if (!timeline) {
      return { error: true, message: "Timeline not found", status: 404 };
    }

    return timeline;
  }

  async updateTimeline(id: string, body: UpdateTimelineDTO) {
    const isTimelineValid = await this.getTimelineById(id);

    if (!Boolean(Object.keys(body).length)) {
      return { error: true, message: "Empty body", status: 400 };
    }

    if (!isTimelineValid) {
      return { error: true, message: "Timeline not found", status: 404 };
    }

    try {
      return this.repository.updateTimeline(id, body);
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }
}
