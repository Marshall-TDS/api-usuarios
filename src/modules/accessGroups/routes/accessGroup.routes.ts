import { Router } from 'express'
import { accessGroupController } from '../controllers/AccessGroupController'

export const accessGroupRoutes = Router()

accessGroupRoutes
  .route('/')
  .get(accessGroupController.index)
  .post(accessGroupController.store)

accessGroupRoutes
  .route('/:id')
  .get(accessGroupController.show)
  .put(accessGroupController.update)
  .delete(accessGroupController.destroy)


