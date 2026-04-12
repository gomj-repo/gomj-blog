import { pgTable, text, varchar, timestamp, boolean, integer, index } from 'drizzle-orm/pg-core'

/** 사용자 테이블. 블로그 관리자 계정 정보를 저장한다. */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  /** 사용자 표시 이름 */
  name: varchar('name', { length: 255 }).notNull(),
  /** 로그인용 이메일 (유니크) */
  email: varchar('email', { length: 255 }).notNull().unique(),
  /** 이메일 인증 완료 여부 */
  emailVerified: boolean('email_verified').notNull().default(false),
  /** 프로필 이미지 URL */
  image: text('image'),
  /** 사용자 권한 등급. `0` = 관리자, `1` = 일반. */
  role: integer('role').notNull().default(1),
  /** 차단 여부 */
  banned: boolean('banned').default(false),
  /** 차단 사유 */
  banReason: text('ban_reason'),
  /** 차단 만료 시각 */
  banExpires: timestamp('ban_expires'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

/** 사용자 세션 테이블. better-auth가 관리하는 로그인 세션. */
export const userSessions = pgTable(
  'user_sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** 세션 토큰 (유니크) */
    token: text('token').notNull().unique(),
    /** 세션 만료 시각 */
    expiresAt: timestamp('expires_at').notNull(),
    /** 로그인 시 클라이언트 IP */
    ipAddress: text('ip_address'),
    /** 로그인 시 User-Agent */
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => [
    index('user_session_user_idx').on(table.userId),
    index('user_session_token_idx').on(table.token)
  ]
)

/** 사용자 계정 연동 테이블. OAuth 또는 이메일/비밀번호 인증 정보를 저장한다. */
export const userAccounts = pgTable(
  'user_accounts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** OAuth 제공자 측 계정 식별자 */
    accountId: text('account_id').notNull(),
    /** 인증 제공자 ID (예: `credential`, `github`) */
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    idToken: text('id_token'),
    /** 이메일/비밀번호 인증 시 해시된 비밀번호 */
    password: text('password'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => [index('user_account_user_idx').on(table.userId)]
)

/** 사용자 인증 코드 테이블. 이메일 인증·비밀번호 재설정 등에 사용된다. */
export const userVerifications = pgTable(
  'user_verifications',
  {
    id: text('id').primaryKey(),
    /** 인증 대상 식별자 (이메일 등) */
    identifier: text('identifier').notNull(),
    /** 인증 코드 값 */
    value: text('value').notNull(),
    /** 인증 코드 만료 시각 */
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => [index('user_verification_identifier_idx').on(table.identifier)]
)
