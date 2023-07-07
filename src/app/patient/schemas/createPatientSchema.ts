import * as yup from "yup";

export const makeCreatePatientSchema = () => {
  return yup
    .object()
    .shape({
      name: yup.string().required(),
      birthdate: yup.string().required(),
      contact: yup.string().required(),
      demands: yup.string(),
      personalAnnotations: yup.string(),
    })
    .noUnknown()
    .strict();
};
