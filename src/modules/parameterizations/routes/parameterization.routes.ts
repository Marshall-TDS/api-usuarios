import { Router } from 'express'
import { parameterizationController } from '../controllers/ParameterizationController'

export const parameterizationRoutes = Router()

parameterizationRoutes
  .route('/')
  .get(parameterizationController.index)
  .post(parameterizationController.store)

parameterizationRoutes
  .route('/:id')
  .get(parameterizationController.show)
  .put(parameterizationController.update)
  .delete(parameterizationController.destroy)

