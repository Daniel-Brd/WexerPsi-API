import { UserModule } from "../user/userModule";
import { AuthController } from "./controllers/authController";
import { AuthService } from "./services/authService";

export class AuthModule {
  static build() {
    const repository = UserModule.build().repository;
    const service = new AuthService(repository);
    const controller = new AuthController(service);

    return { repository, service, controller };
  }
}
