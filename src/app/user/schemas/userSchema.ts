import * as yup from "yup";

export const makeCreateUserSchema = () => {
  return yup
    .object()
    .shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
    })
    .noUnknown()
    .strict();
};

export const makeFindByEmailUserSchema = () => {
  return yup
    .object()
    .shape({
      email: yup.string().email().required(),
    })
    .noUnknown()
    .strict();
};

export const makeUpdateUserSchema = () => {
  return yup
    .object()
    .shape({
      name: yup.string(),
      email: yup.string().email(),
      password: yup.string(),
      patients: yup.string(),
    })
    .noUnknown()
    .strict();
};
