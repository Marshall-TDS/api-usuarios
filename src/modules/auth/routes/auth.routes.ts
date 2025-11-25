import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { LoginUseCase } from '../useCases/login/LoginUseCase'
import { LogoutUseCase } from '../useCases/logout/LogoutUseCase'
import { PermissionService } from '../services/PermissionService'
import { userRepository } from '../../users/repositories'
import { userGroupRepository } from '../../userGroups/repositories'

const authRoutes = Router()

// Instanciar dependências
const permissionService = new PermissionService(userGroupRepository)
const loginUseCase = new LoginUseCase(userRepository, permissionService)
const logoutUseCase = new LogoutUseCase()
const authController = new AuthController(loginUseCase, logoutUseCase)

authRoutes.post('/login', authController.login)
authRoutes.post('/logout', authController.logout)

export { authRoutes }

