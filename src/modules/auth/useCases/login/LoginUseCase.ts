import { AppError } from '../../../../core/errors/AppError'
import { comparePassword } from '../../../../core/utils/passwordCipher'
import { generateAccessToken, generateRefreshToken } from '../../../../core/utils/jwt'
import type { IUserRepository } from '../../../users/repositories/IUserRepository'
import { PermissionService } from '../../services/PermissionService'

export interface LoginDTO {
  loginOrEmail: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    fullName: string
    login: string
    email: string
  }
}

export class LoginUseCase {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async execute(data: LoginDTO): Promise<LoginResponse> {
    try {
      console.log('[LoginUseCase] Iniciando login', { loginOrEmail: data.loginOrEmail })
      
      // 1. Buscar usuário por login ou email (com senha)
      console.log('[LoginUseCase] Buscando usuário no repositório...')
      const userWithPassword = await this.usersRepository.findByLoginOrEmailWithPassword(
        data.loginOrEmail,
      )
      console.log('[LoginUseCase] Resultado da busca:', { 
        found: !!userWithPassword,
        userId: userWithPassword?.id,
        hasPassword: !!userWithPassword?.passwordHash 
      })

      if (!userWithPassword) {
        console.log('[LoginUseCase] Usuário não encontrado')
        throw new AppError('Credenciais inválidas', 401)
      }

      // 2. Verificar se o usuário tem senha definida
      if (!userWithPassword.passwordHash) {
        console.log('[LoginUseCase] Usuário sem senha definida')
        throw new AppError('Senha não definida. Verifique seu e-mail para definir sua senha.', 401)
      }

      // 3. Validar senha (a função comparePassword agora suporta múltiplos formatos)
      console.log('[LoginUseCase] Validando senha...')
      const isPasswordValid = await comparePassword(data.password, userWithPassword.passwordHash)
      console.log('[LoginUseCase] Resultado da validação de senha:', { isValid: isPasswordValid })

      if (!isPasswordValid) {
        console.log('[LoginUseCase] Senha inválida')
        throw new AppError('Credenciais inválidas', 401)
      }

      // 4. Calcular permissões do usuário
      console.log('[LoginUseCase] Calculando permissões do usuário...')
      const permissions = await this.permissionService.calculateUserPermissions(userWithPassword)
      console.log('[LoginUseCase] Permissões calculadas:', { 
        count: permissions.length,
        permissions: permissions.slice(0, 5) // Log apenas as primeiras 5 para não poluir
      })

      // 6. Gerar tokens
      console.log('[LoginUseCase] Gerando tokens...')
      const accessToken = generateAccessToken({
        userId: userWithPassword.id,
        login: userWithPassword.login,
        email: userWithPassword.email,
        permissions,
      })
      console.log('[LoginUseCase] Access token gerado')

      const refreshToken = generateRefreshToken(userWithPassword.id)
      console.log('[LoginUseCase] Refresh token gerado')

      console.log('[LoginUseCase] Login concluído com sucesso', { userId: userWithPassword.id })
      return {
        accessToken,
        refreshToken,
        user: {
          id: userWithPassword.id,
          fullName: userWithPassword.fullName,
          login: userWithPassword.login,
          email: userWithPassword.email,
        },
      }
    } catch (error) {
      console.error('[LoginUseCase] Erro durante execução:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : typeof error,
        isAppError: error instanceof AppError,
        statusCode: error instanceof AppError ? error.statusCode : undefined,
      })
      throw error
    }
  }
}

