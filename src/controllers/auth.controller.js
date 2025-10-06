import logger from '#config/logger.js';
import { formatValidationError } from '#utils/format.js';
import { signUpSchema } from '../validations/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);

    if (!validationResult.success) {
      const formattedError = formatValidationError(validationResult.error);
      return res.status(400).json({ error: formattedError });
    }

    const { name, email, role } = validationResult.data;

    logger.info(`User registered successfully: ${email}`);

    res
      .status(201)
      .json({
        message: 'User registered successfully',
        user: { id: 1, name, email, role },
      });
  } catch (error) {
    logger.error('Error in signup', error);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }

    next(error);
  }
};
