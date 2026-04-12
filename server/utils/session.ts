import type { H3Event } from 'h3'
import { auth } from './auth'

const isMemoryMode = process.env.USE_DATABASE_MODE === 'MEMORY'

/** 메모리 모드에서 인증 없이 사용할 개발용 관리자 정보. */
const DEV_USER = {
  userId: 'dev-admin',
  name: 'Dev Admin',
  email: 'admin@localhost'
}

/** 현재 요청의 인증 세션에서 사용자 정보를 추출한다. 미인증이면 `null`을 반환한다. */
export const getSessionUser = async (event: H3Event) => {
  if (isMemoryMode) return DEV_USER
  if (!auth) throw createError({ statusCode: 503, message: '인증 서비스를 사용할 수 없습니다.' })
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user?.id) return null
  return {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email
  }
}

/** 인증이 필요한 엔드포인트에서 사용한다. 미인증이면 401 에러를 던진다. */
export const requireSession = async (event: H3Event) => {
  if (isMemoryMode) return DEV_USER
  const user = await getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: '로그인이 필요합니다.' })
  }
  return user
}

/** 관리자 권한이 필요한 엔드포인트에서 사용한다. 싱글 어드민 블로그이므로 인증된 사용자 = 관리자. */
export const requireAdmin = async (event: H3Event) => {
  const user = await requireSession(event)
  return user
}
