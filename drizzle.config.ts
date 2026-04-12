import { defineConfig } from 'drizzle-kit'

/** Drizzle Kit 설정. 마이그레이션 파일 생성 시 이 설정을 참조한다. */
export default defineConfig({
  schema: './server/database/schema',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
