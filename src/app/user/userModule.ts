import { FileModule } from "../file/fileModule";
import { UserController } from "./controllers/userController";
import { User } from "./models/user";
import { UserRepository } from "./repositories/userRepository";
import { UserService } from "./services/userService";

export class UserModule {
  static build() {
    const repository = new UserRepository(User);
    const service = new UserService(repository, FileModule.build().service);
    const controller = new UserController(service);
    return { repository, service, controller };
  }
}
