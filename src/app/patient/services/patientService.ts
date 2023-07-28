import { UserRepository } from "../../user/repositories/userRepository";
import { CreatePatientServiceDTO } from "../dtos/createPatientServiceDto";
import { UpdatePatientDTO } from "../dtos/updatePatientDto";
import { PatientRepository } from "../repositories/patientRepository";

export class PatientService {
  constructor(private repository: PatientRepository, private userRepository: UserRepository) {}

  async create({ body, userId }: CreatePatientServiceDTO) {
    const payload = {
      user: userId,
      ...body,
    };

    const isUserValid = await this.userRepository.findById(userId);

    if (!isUserValid) {
      return { error: true, message: "User not found", status: 404 };
    }

    try {
      return await this.repository.create(payload);
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }

  async getPatientByUser(userId: string) {
    const isUserValid = await this.userRepository.findById(userId);

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
      return await this.repository.getPatientById(id);
    } catch (err) {
      return { error: true, message: "Patient not found", status: 404 };
    }
  }

  async updatePatient(id: string, body: UpdatePatientDTO) {
    const patient = await this.getPatientById(id);

    if (!Boolean(Object.keys(body).length)) {
      return { error: true, message: "Empty body", status: 400 };
    }

    if (!patient) {
      return { error: true, message: "Patient not found", status: 404 };
    }

    try {
      return await this.repository.updatePatient(id, body);
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }

  async getTimelinesByPatient(id: string) {
    const isPatientValid = await this.getPatientById(id);

    if (!isPatientValid) {
      return { error: true, message: "Patient not found", status: 404 };
    }

    try {
      const result = await this.repository.getPatientById(id);
      return result?.timelines;
    } catch (err) {
      return { error: true, message: "Internal server error", status: 500 };
    }
  }
}
