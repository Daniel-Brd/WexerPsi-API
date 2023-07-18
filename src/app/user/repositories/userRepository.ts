import { CreateUserDTO, UpdateUserDTO } from "../dtos/createUserDto";
import { User } from "../models/user";

export class UserRepository {
  constructor(private model: typeof User) {}

  async create(user: CreateUserDTO) {
    return (await this.model.create(user)).populate("file");
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).select("+password").populate("patients");
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async updateById(id: string, payload: UpdateUserDTO) {
    return this.model.findByIdAndUpdate(id, { ...payload }, { new: true }).populate("file");
  }

  async associatePatient(id: string, patientId: string) {
    return this.model.findByIdAndUpdate(id, {
      $push: { patients: [patientId] },
    });
  }
}
