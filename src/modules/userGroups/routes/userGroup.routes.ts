import { Router } from 'express'
import { userGroupController } from '../controllers/UserGroupController'

export const userGroupRoutes = Router()

userGroupRoutes
  .route('/')
  .get(userGroupController.index)
  .post(userGroupController.store)

userGroupRoutes
  .route('/:id')
  .get(userGroupController.show)
  .put(userGroupController.update)
  .delete(userGroupController.destroy)


