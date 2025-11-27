import { Router } from 'express'
import { userController } from '../controllers/UserController'
import { userPermissionsController } from '../controllers/UserPermissionsController'
import { userPasswordController } from '../controllers/UserPasswordController'

export const userRoutes = Router()

userRoutes.get('/', userController.index)
userRoutes.post('/', userController.store)
userRoutes.post('/password/reset', userPasswordController.store)
userRoutes.get('/:id', userController.show)
userRoutes.get('/:id/permissions', userPermissionsController.show)
userRoutes.put('/:id', userController.update)
userRoutes.put('/:id/basic', userController.updateBasic)
userRoutes.put('/:id/groups', userController.updateGroups)
userRoutes.put('/:id/permissions', userController.updatePermissions)
userRoutes.delete('/:id', userController.destroy)

