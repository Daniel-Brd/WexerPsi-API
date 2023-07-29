import { CreateFileDto } from "../dtos/createFileDto";
import { FileRepository } from "../repositories/fileRepository";

export class FileService {
  constructor(private repository: FileRepository) {}

  async create(body: CreateFileDto[]) {
    try {
      return await this.repository.create(body);
    } catch (err) {
      return { error: true, message: "internal server error", status: 500 };
    }
  }
}
