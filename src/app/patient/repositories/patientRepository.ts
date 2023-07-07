import { CreatePatientDTO } from "../dtos/createPatientDto";
import { GetPatientByUserDTO } from "../dtos/getPatientByUserDto";
import { Patient } from "../models/patient";

export class PatientRepository {
  constructor(private model: typeof Patient) {}

  async create(patient: CreatePatientDTO) {
    const result = this.model.create(patient);
    return result;
  }

  async getPatientByUser(userId: GetPatientByUserDTO) {
    const result = this.model.find({ user: userId });
  }
}
