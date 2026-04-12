/** 사용자 엔티티. better-auth가 관리하는 계정 정보. */
export interface User {
  id: string
  /** 표시 이름 */
  name: string
  /** 로그인 이메일 */
  email: string
  /** 이메일 인증 완료 여부 */
  emailVerified: boolean
  /** 프로필 이미지 URL */
  image: string | null
  /** 권한 등급. `0` = 관리자, `1` = 일반. */
  role: number
  /** 차단 여부 */
  banned: boolean | null
  /** 차단 사유 */
  banReason: string | null
  /** 차단 만료 시각 (ISO 문자열) */
  banExpires: string | null
  createdAt: string
  updatedAt: string
}
