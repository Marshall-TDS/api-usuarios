import type { QueryResult } from 'pg'
import { pool } from '../../../infra/database/pool'
import type { Parameterization, ParameterizationProps } from '../entities/Parameterization'
import { Parameterization as ParameterizationEntity } from '../entities/Parameterization'
import type { IParameterizationRepository } from './IParameterizationRepository'

type ParameterizationRow = {
  id: string
  seq_id: string
  friendly_name: string
  technical_key: string
  data_type: string
  value: string
  scope_type: string
  scope_target_id: string[] | null
  created_by: string
  updated_by: string
  created_at: Date
  updated_at: Date
}

const mapRowToEntity = (row: ParameterizationRow): ParameterizationProps => {
  return {
    id: row.id,
    seqId: row.seq_id ? parseInt(row.seq_id, 10) : undefined,
    friendlyName: row.friendly_name,
    technicalKey: row.technical_key,
    dataType: row.data_type,
    value: row.value,
    scopeType: row.scope_type,
    scopeTargetId: row.scope_target_id ?? [],
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class PostgresParameterizationRepository implements IParameterizationRepository {
  async findAll(): Promise<ParameterizationProps[]> {
    const result = await pool.query<ParameterizationRow>(
      `
        SELECT id, seq_id, friendly_name, technical_key, data_type, value, scope_type, scope_target_id, created_by, updated_by, created_at, updated_at
        FROM parameterization
        ORDER BY created_at ASC
      `,
    )

    return result.rows.map((row) => mapRowToEntity(row))
  }

  async findById(id: string): Promise<ParameterizationProps | null> {
    const result = await pool.query<ParameterizationRow>(
      `
        SELECT id, seq_id, friendly_name, technical_key, data_type, value, scope_type, scope_target_id, created_by, updated_by, created_at, updated_at
        FROM parameterization
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    )

    const row = result.rows[0]
    return row ? mapRowToEntity(row) : null
  }

  async findByTechnicalKey(technicalKey: string): Promise<ParameterizationProps | null> {
    const normalizedKey = technicalKey.toUpperCase().replace(/\s/g, '_')
    const result = await pool.query<ParameterizationRow>(
      `
        SELECT id, seq_id, friendly_name, technical_key, data_type, value, scope_type, scope_target_id, created_by, updated_by, created_at, updated_at
        FROM parameterization
        WHERE technical_key = $1
        LIMIT 1
      `,
      [normalizedKey],
    )

    const row = result.rows[0]
    return row ? mapRowToEntity(row) : null
  }

  async create(parameterization: Parameterization): Promise<ParameterizationProps> {
    const data = parameterization.toJSON()

    const result = await pool.query<ParameterizationRow>(
      `
        INSERT INTO parameterization (id, friendly_name, technical_key, data_type, value, scope_type, scope_target_id, created_by, updated_by, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, seq_id, friendly_name, technical_key, data_type, value, scope_type, scope_target_id, created_by, updated_by, created_at, updated_at
      `,
      [
        data.id,
        data.friendlyName,
        data.technicalKey,
        data.dataType,
        data.value,
        data.scopeType,
        data.scopeTargetId,
        data.createdBy,
        data.updatedBy,
        data.createdAt,
        data.updatedAt,
      ],
    )

    const row = result.rows[0]
    if (!row) {
      throw new Error('Falha ao inserir parametrização')
    }
    return mapRowToEntity(row)
  }

  async update(parameterization: Parameterization): Promise<ParameterizationProps> {
    const data = parameterization.toJSON()

    const result = await pool.query<ParameterizationRow>(
      `
        UPDATE parameterization
        SET
          friendly_name = $2,
          technical_key = $3,
          data_type = $4,
          value = $5,
          scope_type = $6,
          scope_target_id = $7,
          updated_by = $8,
          updated_at = $9
        WHERE id = $1
        RETURNING id, seq_id, friendly_name, technical_key, data_type, value, scope_type, scope_target_id, created_by, updated_by, created_at, updated_at
      `,
      [
        data.id,
        data.friendlyName,
        data.technicalKey,
        data.dataType,
        data.value,
        data.scopeType,
        data.scopeTargetId,
        data.updatedBy,
        data.updatedAt,
      ],
    )

    const row = result.rows[0]
    if (!row) {
      throw new Error('Falha ao atualizar parametrização')
    }
    return mapRowToEntity(row)
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM parameterization WHERE id = $1', [id])
  }
}

