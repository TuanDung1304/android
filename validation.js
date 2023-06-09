import Joi from 'joi';

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
    phone: Joi.string().length(10),
    gender: Joi.boolean(),
    address: Joi.string().max(50),
    birthdate: Joi.date(),
    // permission: Joi.number().required().min(0).max(3),
    // active: Joi.boolean().required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data);
};

const changePassValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
    // confirmPassword: Joi.ref('password'),
  });
  return schema.validate(data);
};

const editProfileValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    phone: Joi.string().min(8),
    gender: Joi.boolean(),
    address: Joi.string(),
    birthdate: Joi.date(),
    avatar: Joi.string(),
  });
  return schema.validate(data);
};

export {
  changePassValidation,
  loginValidation,
  registerValidation,
  editProfileValidation,
};
