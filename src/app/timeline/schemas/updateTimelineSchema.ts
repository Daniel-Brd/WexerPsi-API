import * as yup from "yup";

export const makeUpdateTimelineSchema = () => {
  return yup
    .object()
    .shape({
      name: yup.string(),
      occurrences: yup.string(),
    })
    .noUnknown()
    .strict();
};
