import Joi from 'joi';

export const PostUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  gdprConfirmed: Joi.boolean().valid(true).required(),
});

export const PostForgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
});

export const PostResetPasswordSchema = Joi.object({
  passwordResetToken: Joi.string().required(),
  newPassword: Joi.string().min(3).required(),
});
