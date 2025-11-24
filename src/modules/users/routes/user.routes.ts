import { Router } from 'express'
import { userController } from '../controllers/UserController'

export const userRoutes = Router()

userRoutes.get('/', userController.index)
userRoutes.get('/:id', userController.show)
userRoutes.post('/', userController.store)
userRoutes.put('/:id', userController.update)
userRoutes.delete('/:id', userController.destroy)

