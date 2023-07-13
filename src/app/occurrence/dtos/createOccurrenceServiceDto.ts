export class createOccurenceServiceDto {
  title: string;
  content: string;
  kind: "Sessão" | "Fato Relevante";
  files?: string[];
}
