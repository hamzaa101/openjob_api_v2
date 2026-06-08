const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin', 'recruiter').default('user'),
});

const LoginPayloadSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const RefreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const CompanyPayloadSchema = Joi.object({
  name: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  description: Joi.string().allow('', null).optional(),
});

const CategoryPayloadSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const JobPayloadSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  company_id: Joi.string().trim().required(),
  category_id: Joi.string().trim().required(),
  job_type: Joi.string().trim().required(),
  experience_level: Joi.string().trim().required(),
  location_type: Joi.string().trim().required(),
  location_city: Joi.string().allow('', null).optional(),
  salary_min: Joi.number().integer().min(0).allow(null).optional(),
  salary_max: Joi.number().integer().min(0).allow(null).optional(),
  is_salary_visible: Joi.boolean().default(false),
  status: Joi.string().valid('open', 'close', 'closed').default('open'),
});

const ApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().trim().optional(),
  job_id: Joi.string().trim().required(),
  status: Joi.string()
    .valid('pending', 'reviewed', 'accepted', 'rejected')
    .default('pending'),
});

const UpdateApplicationStatusPayloadSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'reviewed', 'accepted', 'rejected')
    .required(),
});

module.exports = {
  UserPayloadSchema,
  LoginPayloadSchema,
  RefreshTokenPayloadSchema,
  CompanyPayloadSchema,
  CategoryPayloadSchema,
  JobPayloadSchema,
  ApplicationPayloadSchema,
  UpdateApplicationStatusPayloadSchema,
};