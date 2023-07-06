import { CreateUserDTO, UpdateUserDTO } from "../dtos/createUserDto";
import { User } from "../models/user";

export class UserRepository {
  constructor(private model: typeof User) {}

  async create(user: CreateUserDTO) {
    return this.model.create(user);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).select("+password");
  }

  async deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async updateById(id: string, payload: UpdateUserDTO) {
    return this.model.findByIdAndUpdate(id, { ...payload }, { new: true }).select("+password");
  }
}
