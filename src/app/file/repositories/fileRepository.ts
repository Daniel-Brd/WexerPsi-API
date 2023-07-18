import { CreateFileDto } from "../dtos/createFileDto";
import { File } from "../models/file";

export class FileRepository {
  constructor(private model: typeof File) {}

  async create(files: CreateFileDto[]) {
    return this.model.insertMany(files);
  }
}
