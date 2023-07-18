import { FileController } from "./controllers/fileController";
import { File } from "./models/file";
import { FileRepository } from "./repositories/fileRepository";
import { FileService } from "./services/fileService";

export class FileModule {
  static build() {
    const repository = new FileRepository(File);
    const service = new FileService(repository);
    const controller = new FileController(service);
    return { repository, service, controller };
  }
}
