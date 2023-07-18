import { FileModule } from "../file/fileModule";
import { TimelineModule } from "../timeline/timelineModule";
import { OccurrenceController } from "./controllers/occurrenceController";
import { Occurrence } from "./models/occurrence";
import { OccurrenceRepository } from "./repositories/occurrenceRepository";
import { OccurrenceService } from "./services/occurrenceService";

export class OccurenceModule {
  static build() {
    const repository = new OccurrenceRepository(Occurrence, TimelineModule.build().repository);
    const service = new OccurrenceService(
      repository,
      TimelineModule.build().service,
      FileModule.build().service
    );
    const controller = new OccurrenceController(service);
    return { repository, service, controller };
  }
}
