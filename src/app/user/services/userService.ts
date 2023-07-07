import { hashSync } from "bcrypt";
import { CreateUserServiceDTO, FindUserByEmailDTO, UpdateUserDTO } from "../dtos/createUserDTO";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  constructor(private repository: UserRepository) {}

  async create(body: CreateUserServiceDTO) {
    const registeredEmail = await this.repository.findByEmail(body.email);

    if (registeredEmail) {
      return { error: true, message: "E-mail already registered", status: 400 };
    }

    const payload = {
      ...body,
      password: hashSync(body.password, 8),
    };

    return this.repository.create(payload);
  }

  async findByEmail(body: FindUserByEmailDTO) {
    const result = await this.repository.findByEmail(body.email);

    if (!result) {
      return { error: true, message: "E-mail not found", status: 404 };
    }

    return result;
  }

  async deleteById(id: string) {
    const result = await this.repository.deleteById(id);

    if (!result) {
      return { error: true, message: "User not found", status: 404 };
    }

    return result;
  }

  async updateById(id: string, body: UpdateUserDTO) {
    let payload = body;

    if (body.password) {
      payload = { ...body, password: hashSync(body.password, 8) };
    }

    const result = await this.repository.updateById(id, payload);

    if (!result) {
      return { error: true, message: "User not found", status: 404 };
    }

    return result;
  }
}
