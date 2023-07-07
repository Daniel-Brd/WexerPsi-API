import * as yup from "yup";

export const makeUpdatePatientSchema = () => {
  return yup
    .object()
    .shape({
      name: yup.string(),
      birthdate: yup.string(),
      contact: yup.string(),
      demands: yup.string(),
      personalAnnotations: yup.string(),
    })
    .noUnknown()
    .strict();
};
