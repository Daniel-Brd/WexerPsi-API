export class CreateOccurenceServiceDto {
  title: string;
  content: string;
  kind: "Sessão" | "Fato Relevante";
  files?: string[];
}
