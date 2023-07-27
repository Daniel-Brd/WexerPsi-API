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

    const result = await this.repository.create(payload);

    if (result) {
      return result;
    }
    return { error: true, message: "Internal server error", status: 500 };
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
    const result = await this.repository.getPatientById(id);

    if (!result) {
      return { error: true, message: "Patient not found", status: 404 };
    }
    return result;
  }

  async updatePatient(id: string, body: UpdatePatientDTO) {
    const patient = await this.repository.getPatientById(id);

    if (!Boolean(Object.keys(body).length)) {
      return { error: true, message: "Empty body", status: 400 };
    }

    if (!patient) {
      return { error: true, message: "Patient not found", status: 404 };
    }

    const result = await this.repository.updatePatient(id, body);

    if (result) {
      return result;
    }
    return { error: true, message: "Internal server error", status: 500 };
  }

  async getTimelinesByPatient(id: string) {
    const isPatientValid = await this.repository.getPatientById(id);

    if (!isPatientValid) {
      return { error: true, message: "Patient not found", status: 404 };
    }

    const result = await this.repository.getPatientById(id);

    if (result) {
      return result.timelines;
    }
    return { error: true, message: "Internal server error", status: 500 };
  }
}
