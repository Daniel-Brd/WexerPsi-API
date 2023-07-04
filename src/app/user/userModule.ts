import { UserController } from "./controllers/userController";
import { User } from "./models/user";
import { UserRepository } from "./repositories/userRepository";
import { UserService } from "./services/userService";

export class userModule {
  static build() {
    const repository = new UserRepository(User);
    const service = new UserService(repository);
    const controller = new UserController(service);
    return { repository, service, controller };
  }
}
