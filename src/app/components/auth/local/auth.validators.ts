import Joi from 'joi';

export const PostSignInSchema = Joi.object()
  .keys({
    email: Joi.string().lowercase().required(),
    password: Joi.string().required(),
  })
  .with('email', 'password'); // both email and password must be provided

export const HeaderPostLogoutSchema = Joi.object({
  authorization: Joi.string().required(),
});
