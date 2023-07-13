export class UpdateOccurenceDto {
  title?: string;
  content?: string;
  kind?: "Sessão" | "Fato Relevante";
  files?: string[];
}
