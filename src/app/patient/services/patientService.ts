import { UserRepository } from "../../user/repositories/userRepository";
import { CreatePatientServiceDTO } from "../dtos/createPatientServiceDto";
import { PatientRepository } from "../repositories/patientRepository";

export class PatientService {
  constructor(
    private repository: PatientRepository,
    private userRepositpry: UserRepository
  ) {}

  async create({ body, userId }: CreatePatientServiceDTO) {
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

  async getPatientByUser(userId: string) {
    const isUserValid = await this.userRepositpry.findById(userId);

    if (!isUserValid) {
      return { error: true, message: "User not found", status: 404 };
    }

    try {
      return this.repository.getPatientByUser(userId);
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }

  async getPatientById(id: string) {
    try {
      return this.repository.getPatientById(id);
    } catch (err) {
      return { error: true, message: "Patient not found", status: 404 };
    }
  }
}
