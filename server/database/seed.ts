import 'dotenv/config'

/** 초기 관리자 계정을 생성하는 시드 스크립트. 이미 존재하면 정보를 갱신한다. */
async function seed() {
  const { db } = await import('../utils/db')
  const { users, userAccounts } = await import('./schema/users')
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
  } catch (error) {
    console.error('Seed 작업 중 예외 발생:', error)
    process.exit(1)
  } finally {
    console.log('모든 작업 완료')
    process.exit(0)
  }
}

seed()
