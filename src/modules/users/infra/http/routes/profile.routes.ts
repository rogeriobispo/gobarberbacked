import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate'
import profileController from '../controllers/ProfileController'


const ProfileRouter = Router();

ProfileRouter.put('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string(),
    password_confirmation: Joi.string().valid(Joi.ref('password'))

  }
}), profileController.update);
ProfileRouter.get('/', profileController.show);


export default ProfileRouter;
