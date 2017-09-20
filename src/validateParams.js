import Joi from 'joi'
import config from '../config'

const schema = Joi.object().keys({
  format: Joi.string().valid('jpg', 'jpeg', 'png').required(),
  guid: Joi.string().required(),
  quality: Joi.number().integer().min(0).max(100),
  width: Joi.number().integer().min(0).max(config.maximumSupportedWidth).optional(),
  height: Joi.number().integer().min(0).max(config.maximumSupportedHeight).optional(),
  crop: Joi.string().valid('gravity').optional(),
  ratio: Joi.string().valid('min', 'max', 'stretch').optional(),
  embed: Joi.boolean().optional(),
  background: Joi.string().regex(/^(?:[0-9a-fA-F]{3}){1,2}$/).optional(),
})

export default (params) => {
  const { error, value } = Joi.validate(params, schema)

  if (error) {
    return Promise.reject(error)
  }

  return Promise.resolve(value)
}
