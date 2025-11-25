import type { QueryResult } from 'pg'
import { pool } from '../../../infra/database/pool'
import type { UserGroup, UserGroupProps } from '../entities/UserGroup'
import { UserGroup as UserGroupEntity } from '../entities/UserGroup'
import type { IUserGroupRepository } from './IUserGroupRepository'

type UserGroupRow = {
  id: string
  name: string
  code: string
  features: string[] | null
  created_by: string
  updated_by: string
  created_at: Date
  updated_at: Date
}

const mapRowToEntity = (row: UserGroupRow): UserGroupProps => {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    features: row.features ?? [],
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class PostgresUserGroupRepository implements IUserGroupRepository {
  async findAll(): Promise<UserGroupProps[]> {
    const result = await pool.query<UserGroupRow>(
      `
        SELECT id, name, code, features, created_by, updated_by, created_at, updated_at
        FROM user_groups
        ORDER BY created_at ASC
      `,
    )

    return result.rows.map((row) => mapRowToEntity(row))
  }

  async findById(id: string): Promise<UserGroupProps | null> {
    const result = await pool.query<UserGroupRow>(
      `
        SELECT id, name, code, features, created_by, updated_by, created_at, updated_at
        FROM user_groups
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    )

    const row = result.rows[0]
    return row ? mapRowToEntity(row) : null
  }

  async findByCode(code: string): Promise<UserGroupProps | null> {
    const result = await pool.query<UserGroupRow>(
      `
        SELECT id, name, code, features, created_by, updated_by, created_at, updated_at
        FROM user_groups
        WHERE code = $1
        LIMIT 1
      `,
      [code],
    )

    const row = result.rows[0]
    return row ? mapRowToEntity(row) : null
  }

  async findManyByIds(ids: string[]): Promise<UserGroupProps[]> {
    if (ids.length === 0) {
      return []
    }

    const result = await pool.query<UserGroupRow>(
      `
        SELECT id, name, code, features, created_by, updated_by, created_at, updated_at
        FROM user_groups
        WHERE id = ANY($1::uuid[])
      `,
      [ids],
    )

    return result.rows.map((row) => mapRowToEntity(row))
  }

  async create(group: UserGroup): Promise<UserGroupProps> {
    const data = group.toJSON()

    const result = await pool.query<UserGroupRow>(
      `
        INSERT INTO user_groups (id, name, code, features, created_by, updated_by, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, code, features, created_by, updated_by, created_at, updated_at
      `,
      [
        data.id,
        data.name,
        data.code,
        data.features,
        data.createdBy,
        data.updatedBy,
        data.createdAt,
        data.updatedAt,
      ],
    )

    const row = result.rows[0]
    if (!row) {
      throw new Error('Falha ao inserir grupo de usuários')
    }
    return mapRowToEntity(row)
  }

  async update(group: UserGroup): Promise<UserGroupProps> {
    const data = group.toJSON()

    const result = await pool.query<UserGroupRow>(
      `
        UPDATE user_groups
        SET
          name = $2,
          code = $3,
          features = $4,
          updated_by = $5,
          updated_at = $6
        WHERE id = $1
        RETURNING id, name, code, features, created_by, updated_by, created_at, updated_at
      `,
      [data.id, data.name, data.code, data.features, data.updatedBy, data.updatedAt],
    )

    const row = result.rows[0]
    if (!row) {
      throw new Error('Falha ao atualizar grupo de usuários')
    }
    return mapRowToEntity(row)
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM user_groups WHERE id = $1', [id])
  }
}

