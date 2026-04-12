import { auth } from '../../utils/auth'

/** 모든 /api/auth/* 요청을 better-auth 핸들러에 위임한다. 메모리 모드에서는 503을 반환. */
export default defineEventHandler(async (event) => {
  if (!auth) {
    throw createError({ statusCode: 503, message: 'Auth is disabled.' })
  }
  return auth.handler(toWebRequest(event))
})
