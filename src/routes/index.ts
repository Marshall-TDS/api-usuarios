import { Router } from 'express'
import { featureRoutes } from '../modules/features/routes/feature.routes'
import { userGroupRoutes } from '../modules/userGroups/routes/userGroup.routes'
import { userRoutes } from '../modules/users/routes/user.routes'

export const routes = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

routes.use('/users', userRoutes)
routes.use('/groups', userGroupRoutes)
routes.use('/features', featureRoutes)

