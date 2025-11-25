import { Router } from 'express'
import { userController } from '../controllers/UserController'
import { userPasswordController } from '../controllers/UserPasswordController'

export const userRoutes = Router()

userRoutes.get('/', userController.index)
userRoutes.post('/', userController.store)
userRoutes.post('/password/reset', userPasswordController.store)
userRoutes.get('/:id', userController.show)
userRoutes.put('/:id', userController.update)
userRoutes.delete('/:id', userController.destroy)

