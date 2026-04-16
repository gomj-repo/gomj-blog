import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from '../database/schema'

/**
 * `USE_DATABASE_MODE=MEMORY`이면 Postgres 연결 없이 인메모리 저장소를 사용한다.
 * 그 외에는 `DATABASE_URL`로 Postgres에 연결한다.
 */
const isMemoryMode = process.env.USE_DATABASE_MODE === 'MEMORY'

const pool = isMemoryMode ? undefined : new pg.Pool({ connectionString: process.env.DATABASE_URL })

/** Drizzle ORM 인스턴스. 메모리 모드에서는 `null`. */
export const db = pool ? drizzle(pool, { schema }) : null

/** DB 연결을 반환한다. 연결이 없으면 에러를 던진다. */
export function getRequiredDb() {
  if (!db) throw new Error('데이터베이스 연결이 필요합니다.')
  return db
}
