import { CreateFileDto } from "../../file/dtos/createFileDto";

export class UpdateOccurenceDto {
  title?: string;
  content?: string;
  kind?: "Sessão" | "Fato Relevante";
  files?: CreateFileDto[];
}
