import { User } from "../user/models/user";
import { UserRepository } from "../user/repositories/userRepository";
import { PatientController } from "./controllers/patientController";
import { Patient } from "./models/patient";
import { PatientRepository } from "./repositories/patientRepository";
import { PatientService } from "./services/patientService";

export class PatientModule {
  static build() {
    const userRepository = new UserRepository(User);
    const repository = new PatientRepository(Patient, userRepository);
    const service = new PatientService(repository, userRepository);
    const controller = new PatientController(service);
    return { repository, userRepository, service, controller };
  }
}
