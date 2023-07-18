import { hashSync } from "bcrypt";
import { CreateUserServiceDTO, FindUserByEmailDTO, UpdateUserDTO } from "../dtos/createUserDto";
import { UserRepository } from "../repositories/userRepository";
import { FileService } from "../../file/services/fileService";

export class UserService {
  constructor(private repository: UserRepository, private fileService: FileService) {}

  async create(params: CreateUserServiceDTO) {
    const registeredEmail = await this.repository.findByEmail(params.email);

    if (registeredEmail) {
      return { error: true, message: "E-mail already registered", status: 400 };
    }

    const photo = await this.fileService.create([params.file]);

    if ("error" in photo) {
      return { error: true, message: "Cannot upload photo", status: 400 };
    }

    const payload = {
      ...params,
      password: hashSync(params.password, 8),
      file: photo[0]._id,
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

  async updateById(id: string, params: UpdateUserDTO) {
    if (!Boolean(Object.keys(params).length)) {
      return { error: true, message: "Empty body", status: 400 };
    }

    let payload = params;

    if (params.password) {
      payload = { ...params, password: hashSync(params.password, 8) };
    }

    const photo = params.file ? await this.fileService.create([params.file]) : [];

    if ("error" in photo) {
      return { error: true, message: "Cannot upload photo", status: 400 };
    }

    payload = { ...payload, file: photo[0] };

    const result = await this.repository.updateById(id, payload);

    if (!result) {
      return { error: true, message: "User not found", status: 404 };
    }

    return result;
  }
}
