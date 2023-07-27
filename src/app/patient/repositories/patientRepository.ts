import { UserRepository } from "../../user/repositories/userRepository";
import { CreatePatientDTO } from "../dtos/createPatientDto";
import { UpdatePatientDTO } from "../dtos/updatePatientDto";
import { Patient } from "../models/patient";

export class PatientRepository {
  constructor(private model: typeof Patient, private userRepository: UserRepository) {}

  async create(patient: CreatePatientDTO) {
    const result = await this.model.create(patient);
    this.userRepository.associatePatient(result.user.toString(), result._id.toString());
    return result;
  }

  async getPatientByUser(userId: string) {
    return this.model.find({ user: userId });
  }

  async getPatientById(id: string) {
    return this.model.findById(id).populate("timelines");
  }

  async updatePatient(id: string, payload: UpdatePatientDTO) {
    return this.model.findByIdAndUpdate(id, payload, { new: true });
  }

  async associateTimeline(id: string, timelineId: string) {
    return this.model.findByIdAndUpdate(id, {
      $push: { timelines: [timelineId] },
    });
  }
}
