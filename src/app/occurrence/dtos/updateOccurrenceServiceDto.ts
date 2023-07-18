import { CreateFileDto } from "../../file/dtos/createFileDto";

export class UpdateOccurenceServiceDto {
  title?: string;
  content?: string;
  kind?: "Sessão" | "Fato Relevante";
  files?: CreateFileDto[];
}
