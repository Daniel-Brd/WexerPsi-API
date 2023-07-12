import { Patient } from "../patient/models/patient";
import { PatientRepository } from "../patient/repositories/patientRepository";
import { Timeline } from "../timeline/models/timeline";
import { TimelineRepository } from "../timeline/repositories/timelineRepository";
import { TimelineService } from "../timeline/services/timelineService";
import { User } from "../user/models/user";
import { UserRepository } from "../user/repositories/userRepository";
import { OccurrenceController } from "./controllers/occurrenceController";
import { Occurrence } from "./models/occurrence";
import { OccurrenceRepository } from "./repositories/occurrenceRepository";
import { OccurrenceService } from "./services/occurrenceService";

export class OccurenceModule {
  static build() {
    const userRepository = new UserRepository(User);
    const patientRepository = new PatientRepository(Patient, userRepository);
    const timelineRepository = new TimelineRepository(Timeline, patientRepository);
    const repository = new OccurrenceRepository(Occurrence, timelineRepository);
    const timelineService = new TimelineService(timelineRepository);
    const service = new OccurrenceService(repository, timelineService);
    const controller = new OccurrenceController(service);
    return { repository, service, controller };
  }
}
