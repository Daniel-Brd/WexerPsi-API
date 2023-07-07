import { UserRepository } from "../../user/repositories/userRepository";
import { CreatePatientDTO } from "../dtos/createPatientDto";
import { Patient } from "../models/patient";

export class PatientRepository {
  constructor(
    private model: typeof Patient,
    private userRepository: UserRepository
  ) {}

  async create(patient: CreatePatientDTO) {
    const result = await this.model.create(patient);
    this.userRepository.associatePatient(
      result.user.toString(),
      result._id.toString()
    );
    return result;
  }

  async getPatientByUser(userId: string) {
    const result = this.model.find({ user: userId });
    return result;
  }

  async getPatientById(id: string) {
    return this.model.findById(id);
  }
}
