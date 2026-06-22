const Joi = require('joi');

const createUser = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string()
            .valid('admin', 'user', 'staff')
            .default('user'),
    }),
};

const updateUser = {
    body: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        role: Joi.string()
            .valid('admin', 'user', 'staff'),
        isActive: Joi.boolean(),
        profilePicture: Joi.string().allow(null, ''),
    }),
};

module.exports = {
    createUser,
    updateUser,
};