import * as yup from "yup";

export const makeCreateOccurrenceSchema = () => {
  return yup
    .object()
    .shape({
      title: yup.string().required(),
      content: yup.string().required(),
      kind: yup.string().oneOf(["Sessão", "Fato Relevante"]).required(),
      files: yup.array().of(yup.string()),
    })
    .noUnknown()
    .strict();
};
