import { hashSync } from "bcrypt";
import { CreateUserServiceDTO, FindUserByEmailDTO } from "../dtos/createUserDto";
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
}
