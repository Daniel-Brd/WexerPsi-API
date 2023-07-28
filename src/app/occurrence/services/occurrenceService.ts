import { FileService } from "../../file/services/fileService";
import { TimelineService } from "../../timeline/services/timelineService";
import { CreateOccurenceServiceDto } from "../dtos/createOccurrenceServiceDto";
import { UpdateOccurenceServiceDto } from "../dtos/updateOccurrenceServiceDto";
import { OccurrenceRepository } from "../repositories/occurrenceRepository";

export class OccurrenceService {
  constructor(
    private repository: OccurrenceRepository,
    private timelineService: TimelineService,
    private fileService: FileService
  ) {}

  async create(params: CreateOccurenceServiceDto, timelineId: string) {
    const isTimelineValid = await this.timelineService.getTimelineById(timelineId);

    if (!isTimelineValid) {
      return {
        error: true,
        message: "Timeline not found",
        status: 404,
      };
    }

    const files = params.files ? await this.fileService.create(params.files) : [];

    if ("error" in files) {
      return { error: true, message: "Cannot upload files", status: 400 };
    }

    const payload = {
      timelineId,
      ...params,
      files: files.map((file) => file._id.toString()),
    };

    try {
      return await this.repository.create(payload);
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }

  async getOccurrenceById(id: string) {
    try {
      return await this.repository.getOccurrenceById(id);
    } catch (err) {
      return { error: true, message: "Occurrence not found", status: 404 };
    }
  }

  async updateOccurrence(id: string, params: UpdateOccurenceServiceDto) {
    const occurrence = await this.repository.getOccurrenceById(id);

    if (!Boolean(Object.keys(params).length)) {
      return { error: true, message: "Empty body", status: 400 };
    }

    if (!occurrence) {
      return { error: true, message: "Occurrence not found", status: 404 };
    }

    const files = params.files ? await this.fileService.create(params.files) : [];

    if ("error" in files) {
      return { error: true, message: "Cannot upload files", status: 400 };
    }

    const payload = {
      ...params,
    };

    try {
      return await this.repository.updateOccurrence(id, payload);
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }
}
