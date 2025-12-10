import type { UserProps } from '../../users/entities/User'
import type { AccessGroupProps } from '../../accessGroups/entities/AccessGroup'
import type { IAccessGroupRepository } from '../../accessGroups/repositories/IAccessGroupRepository'

export class PermissionService {
  constructor(private readonly accessGroupsRepository: IAccessGroupRepository) { }

  /**
   * Calcula as permissões finais do usuário baseado em:
   * 1. Funcionalidades dos grupos do usuário
   * 2. allow_features do usuário (adiciona permissões)
   * 3. denied_features do usuário (remove permissões)
   */
  async calculateUserPermissions(user: UserProps): Promise<string[]> {
    try {
      console.log('[PermissionService] Calculando permissões do usuário:', { 
        userId: user.id,
        groupIds: user.groupIds,
        allowFeatures: user.allowFeatures,
        deniedFeatures: user.deniedFeatures 
      })
      
      // 1. Coletar funcionalidades dos grupos
      const groupFeatures = new Set<string>()
      if (user.groupIds.length > 0) {
        console.log('[PermissionService] Buscando grupos do usuário...')
        const groups = await this.accessGroupsRepository.findManyByIds(user.groupIds)
        console.log('[PermissionService] Grupos encontrados:', { 
          count: groups.length,
          groupIds: groups.map(g => g.id) 
        })
        groups.forEach((group) => {
          group.features.forEach((feature) => groupFeatures.add(feature))
        })
        console.log('[PermissionService] Funcionalidades dos grupos coletadas:', { 
          count: groupFeatures.size 
        })
      } else {
        console.log('[PermissionService] Usuário não possui grupos')
      }

      // 2. Adicionar allow_features
      user.allowFeatures.forEach((feature) => groupFeatures.add(feature))
      console.log('[PermissionService] allow_features adicionadas:', { 
        count: user.allowFeatures.length 
      })

      // 3. Remover denied_features
      user.deniedFeatures.forEach((feature) => groupFeatures.delete(feature))
      console.log('[PermissionService] denied_features removidas:', { 
        count: user.deniedFeatures.length 
      })

      const permissions = Array.from(groupFeatures).sort()
      console.log('[PermissionService] Permissões finais calculadas:', { 
        count: permissions.length 
      })
      
      return permissions
    } catch (error) {
      console.error('[PermissionService] Erro ao calcular permissões:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : typeof error,
        userId: user.id,
      })
      throw error
    }
  }
}

