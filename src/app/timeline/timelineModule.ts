import { Patient } from "../patient/models/patient";
import { PatientRepository } from "../patient/repositories/patientRepository";
import { User } from "../user/models/user";
import { UserRepository } from "../user/repositories/userRepository";
import { TimelineController } from "./controllers/timelineController";
import { Timeline } from "./models/timeline";
import { TimelineRepository } from "./repositories/timelineRepository";
import { TimelineService } from "./services/timelineService";

export class TimelineModule {
  static build() {
    const userRepository = new UserRepository(User);
    const patientRepository = new PatientRepository(Patient, userRepository);
    const repository = new TimelineRepository(Timeline, patientRepository);
    const service = new TimelineService(repository);
    const controller = new TimelineController(service);
    return { repository, service, controller };
  }
}
