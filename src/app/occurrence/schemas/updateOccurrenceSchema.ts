import * as yup from "yup";

export const makeUpdateOccurrenceSchema = () => {
  return yup
    .object()
    .shape({
      title: yup.string(),
      content: yup.string(),
      kind: yup.string().oneOf(["Sessão", "Fato Relevante"]),
      files: yup.array().of(yup.string()),
    })
    .noUnknown()
    .strict();
};
