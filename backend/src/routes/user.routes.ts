import {
  Router,
} from 'express'

import {
  createUserController,
  getUserController,
  listUsersController,
  updateUserController,
  updateUserStatusController,
} from '../controllers/user.controller.js'

import {
  authenticateMiddleware,
} from '../middlewares/authenticate.middleware.js'

import {
  authorizeMiddleware,
} from '../middlewares/authorize.middleware.js'

const userRouter =
  Router()

userRouter.use(
  authenticateMiddleware,
)

userRouter.get(
  '/',
  authorizeMiddleware(
    'ADMIN',
  ),
  listUsersController,
)

userRouter.get(
  '/:id',
  authorizeMiddleware(
    'ADMIN',
  ),
  getUserController,
)

userRouter.post(
  '/',
  authorizeMiddleware(
    'ADMIN',
  ),
  createUserController,
)

userRouter.put(
  '/:id',
  authorizeMiddleware(
    'ADMIN',
  ),
  updateUserController,
)

userRouter.patch(
  '/:id/status',
  authorizeMiddleware(
    'ADMIN',
  ),
  updateUserStatusController,
)

export default userRouter