import { Router } from 'express'
import { userRoutes } from '../modules/users/routes/user.routes'

export const routes = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

routes.use('/users', userRoutes)

