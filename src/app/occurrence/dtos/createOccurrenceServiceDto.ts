import { CreateFileDto } from "../../file/dtos/createFileDto";

export class CreateOccurenceServiceDto {
  title: string;
  content: string;
  kind: "Sessão" | "Fato Relevante";
  files?: CreateFileDto[];
}
