import { CreatePatientDTO } from "../dtos/createPatientDTO";
import { GetPatientByUserDTO } from "../dtos/getPatientByUserDTO";
import { Patient } from "../models/patient";

export class PatientRepository {
  constructor(private model: typeof Patient) {}

  async create(patient: CreatePatientDTO) {
    const result = this.model.create(patient);
    return result;
  }

  async getPatientByUser(userId: GetPatientByUser) {
    const result = this.model.find({ user: userId });
  }
}
