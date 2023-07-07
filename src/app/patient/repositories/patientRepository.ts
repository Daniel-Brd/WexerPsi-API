import { createPatientDto } from "../dtos/createPatientDto";
import { Patient } from "../models/patient";

export class PatientRepository {
  constructor(private model: typeof Patient) {}

  async create(patient: createPatientDto) {
    const result = this.model.create(patient);
    return result;
  }
}
