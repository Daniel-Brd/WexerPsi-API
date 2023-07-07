import { UserRepository } from "../../user/repositories/userRepository";
import { createPatientServiceDto } from "../dtos/createPatientServiceDto";
import { PatientRepository } from "../repositories/patientRepository";

export class PatientService {
  constructor(private repository: PatientRepository, private userRepositpry: UserRepository) {}

  async create({ body, userId }: createPatientServiceDto) {
    const payload = {
      user: userId,
      ...body,
    };

    const isUserValid = await this.userRepositpry.findById(userId);

    if (!isUserValid) {
      return { error: true, message: "User not found", status: 404 };
    }

    try {
      return this.repository.create(payload);
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }
}
