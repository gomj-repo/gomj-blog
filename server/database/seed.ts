import 'dotenv/config'

/** 기본 제공 템플릿 목록. */
const defaultTemplates = [
  {
    id: 'tpl_blank',
    name: '빈 페이지',
    description: '기본 빈 페이지',
    isDefault: true,
    content: { type: 'doc', content: [{ type: 'paragraph' }] },
  },
  {
    id: 'tpl_meeting',
    name: '회의록',
    description: '회의 날짜, 참석자, 안건, 결정사항, 액션아이템',
    isDefault: false,
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '회의 정보' }] },
        { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: '날짜: ' }] },
        { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: '참석자: ' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '안건' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '결정 사항' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '액션 아이템' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
      ],
    },
  },
  {
    id: 'tpl_tech_doc',
    name: '기술 문서',
    description: '개요, 아키텍처, API 명세, 설치 방법',
    isDefault: false,
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '개요' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '아키텍처' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'API 명세' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '설치 및 실행' }] },
        { type: 'orderedList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
      ],
    },
  },
  {
    id: 'tpl_guide',
    name: '가이드',
    description: '단계별 안내 문서',
    isDefault: false,
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '소개' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '사전 준비' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '단계 1' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '단계 2' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '단계 3' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '마무리' }] },
        { type: 'paragraph' },
      ],
    },
  },
  {
    id: 'tpl_troubleshooting',
    name: '트러블슈팅',
    description: '증상, 원인 분석, 해결 방법, 참고 자료',
    isDefault: false,
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '증상' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '원인 분석' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '해결 방법' }] },
        { type: 'orderedList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '참고 자료' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
      ],
    },
  },
]

/** 초기 관리자 계정을 생성하는 시드 스크립트. 이미 존재하면 정보를 갱신한다. */
async function seed() {
  const { db } = await import('../utils/db')
  const { users, userAccounts } = await import('./schema/users')
  const { pageTemplates } = await import('./schema/page_templates')
  const { hashPassword } = await import('better-auth/crypto')

  console.log('Seed 작업 시작...')

  const ADMIN_ID = 'admin_master_01'
  const adminData = {
    email: process.env.ADMIN_EMAIL ?? 'admin@gomj.dev',
    password: process.env.ADMIN_PASSWORD ?? '!gomj1234',
    name: '관리자'
  }

  try {
    const hashedPassword = await hashPassword(adminData.password)

    await db.transaction(async (tx) => {
      await tx
        .insert(users)
        .values({
          id: ADMIN_ID,
          name: adminData.name,
          email: adminData.email,
          role: 0,
          emailVerified: true
        })
        .onConflictDoUpdate({
          target: users.id,
          set: { email: adminData.email, name: adminData.name, role: 0 }
        })

      await tx
        .insert(userAccounts)
        .values({
          id: `acc_${ADMIN_ID}`,
          userId: ADMIN_ID,
          accountId: adminData.email,
          providerId: 'credential',
          password: hashedPassword
        })
        .onConflictDoUpdate({
          target: userAccounts.id,
          set: { password: hashedPassword }
        })
    })
    console.log('관리자 계정 설정 완료 (ID: ' + ADMIN_ID + ')')

    // 기본 템플릿 시드
    for (const tpl of defaultTemplates) {
      await db
        .insert(pageTemplates)
        .values(tpl)
        .onConflictDoUpdate({
          target: pageTemplates.id,
          set: { name: tpl.name, description: tpl.description, content: tpl.content, isDefault: tpl.isDefault },
        })
    }
    console.log(`기본 템플릿 ${defaultTemplates.length}종 설정 완료`)
  } catch (error) {
    console.error('Seed 작업 중 예외 발생:', error)
    process.exit(1)
  } finally {
    console.log('모든 작업 완료')
    process.exit(0)
  }
}

seed()
