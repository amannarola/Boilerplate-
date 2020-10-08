import { body, check } from 'express-validator';
import { constants as VALIDATOR } from '../constant/validator/user';

export const validate = method => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_USER: {
      error = [
        body('username', 'Username is Required')
          .not()
          .isEmpty(),
        body('email', 'Invalid email').isEmail(),
        body(
          'password',
          'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
        body('confirmPassword', 'Confirm password is Required')
          .not()
          .isEmpty(),
        body('age', 'Age is required')
          .not()
          .isEmpty()
      ];
      break;
    }
    case VALIDATOR.LOGIN: {
      error = [
        body('email', 'Invalid email').isEmail(),
        body(
          'password',
          'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 })
      ];
      break;
    }
    case VALIDATOR.FORGOT_PASSWORD: {
      error = [check('email', 'Invalid email').isEmail()];
      break;
    }
    case VALIDATOR.CHANGE_PASSWORD: {
      error = [
        body(
          'newPassword',
          'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
        body('confirmPassword', 'Confirm password is Required')
          .not()
          .isEmpty()
      ];
      break;
    }
  }
  return error;
};
