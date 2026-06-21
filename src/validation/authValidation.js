const Joi=require("joi");

const registerSchema=Joi.object({
    name : Joi.string().required(),

    email: Joi.string().email().required(),
    password:Joi.string().min(6).required()
});

const loginSchema=Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().min(6).required()
});

const addMoneySchema=Joi.object({
    amount:Joi.number().positive().required()
});

const sendMoneySchema=Joi.object({
    receiver_id:Joi.number().integer().positive().required(),
    amount: Joi.number().positive().required()
});

module.exports= {
    registerSchema,
    loginSchema,
    addMoneySchema,
    sendMoneySchema
};