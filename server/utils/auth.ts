import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import { users, userSessions, userAccounts, userVerifications } from '../database/schema/users'

const isMemoryMode = process.env.USE_DATABASE_MODE === 'MEMORY'

/**
 * better-auth 인스턴스. 메모리 모드에서는 인증 기능을 사용하지 않으므로 `null`을 반환한다.
 * Postgres 모드에서만 이메일/비밀번호 인증을 활성화한다.
 */
export const auth = isMemoryMode ? null : betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(',')
    : [],
  database: drizzleAdapter(db!, {
    provider: 'pg',
    schema: {
      user: users,
      session: userSessions,
      account: userAccounts,
      verification: userVerifications
    }
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: { type: 'number', required: false, defaultValue: 1, input: false },
      banned: { type: 'boolean', required: false, defaultValue: false, input: false },
      banReason: { type: 'string', required: false, input: false },
      banExpires: { type: 'date', required: false, input: false }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30 // 30일
  }
})
