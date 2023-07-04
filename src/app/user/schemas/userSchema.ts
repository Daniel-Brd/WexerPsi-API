import * as yup from "yup";

export const makeCreateUserSchema = () => {
  return yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
  });
};
