import type { H3Event } from 'h3'

/** 라우트 파라미터를 필수로 추출한다. 없으면 400 에러를 던진다. */
export function requireParam(event: H3Event, name: string): string {
  const value = getRouterParam(event, name)
  if (!value) {
    throw createError({ statusCode: 400, message: `${name} 파라미터가 필요합니다.` })
  }
  return value
}
