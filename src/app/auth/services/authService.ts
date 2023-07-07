import { compareSync } from "bcrypt";
import * as JWT from "jsonwebtoken";

import { UserRepository } from "../../user/repositories/userRepository";
import { LoginDTO } from "../dtos/loginDto";

export class AuthService {
  constructor(private repository: UserRepository) {}

  async login(body: LoginDTO) {
    const user = await this.repository.findByEmail(body.email);

    if (!user) {
      return { error: true, message: "Invalid e-mail or password", status: 400 };
    }

    const isPasswordValid = compareSync(body.password, user.password);

    if (!isPasswordValid) {
      return { error: true, message: "Invalid e-mail or password", status: 400 };
    }

    const payload = { id: user.id };

    const secretKey = process.env.JWT_SECRET_KEY as string;

    const options = { expiresIn: "60min" };

    const token = JWT.sign(payload, secretKey, options);

    const result = { token, user };

    return result;
  }
}
