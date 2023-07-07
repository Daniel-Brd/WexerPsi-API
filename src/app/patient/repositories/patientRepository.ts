import { CreatePatientDto } from "../dtos/createPatientDto";
import { Patient } from "../models/patient";

export class PatientRepository {
  constructor(private model: typeof Patient) {}

  async create(patient: CreatePatientDto) {
    const result = this.model.create(patient);
    return result;
  }

  async getPatientByUser(userId) {
    const result = this.model.find({ user: userId });
  }
}
