export interface createOccurenceDto {
  timelineId: string;
  title: string;
  content: string;
  kind: "Sessão" | "Fato Relevante";
  files?: string[];
}
