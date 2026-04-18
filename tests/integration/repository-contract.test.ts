/**
 * Repository 계약 테스트.
 * InMemory 구현체를 사용하여 IFolderRepository 인터페이스의 계약을 검증한다.
 * 새 모듈(구현체)을 추가해도 동일한 계약을 만족하는지 확인하는 데 사용한다.
 */
import { describe, it, expect, beforeEach } from 'vitest'

// InMemory 구현체를 직접 import (싱글턴이 아닌 새 인스턴스 사용)
// folderRepository는 모듈 레벨 싱글턴이므로, 동적 import로 매 테스트마다 격리
async function createFolderRepository() {
  // 매번 새 모듈 인스턴스를 얻기 위해 타임스탬프 쿼리 사용은 불가하므로
  // import 후 내부 상태를 리셋하는 방식 대신, 테스트에서 생성된 데이터를 삭제한다
  const mod = await import('../../server/repositories/folder.repository.memory')
  return mod.folderRepository
}

describe('IFolderRepository 계약 (InMemory)', () => {
  let repo: Awaited<ReturnType<typeof createFolderRepository>>
  const createdIds: string[] = []

  beforeEach(async () => {
    repo = await createFolderRepository()
    // 이전 테스트에서 생성된 폴더 정리
    for (const id of createdIds) {
      await repo.deleteFolder(id)
    }
    createdIds.length = 0
  })

  const track = (id: string) => { createdIds.push(id); return id }

  describe('createFolder → getFolder 왕복 검증', () => {
    it('생성한 폴더를 ID로 조회할 수 있다', async () => {
      const created = await repo.createFolder({ name: '테스트', slug: 'test' })
      track(created.id)

      const found = await repo.getFolder(created.id)
      expect(found).not.toBeNull()
      expect(found!.name).toBe('테스트')
      expect(found!.slug).toBe('test')
    })

    it('생성된 폴더에 id, createdAt, updatedAt이 채워진다', async () => {
      const created = await repo.createFolder({ name: '자동생성', slug: 'auto' })
      track(created.id)

      expect(created.id).toBeTruthy()
      expect(created.createdAt).toBeTruthy()
      expect(created.updatedAt).toBeTruthy()
    })
  })

  describe('getFolderBySlug 계약', () => {
    it('부모 ID + 슬러그 조합으로 폴더를 찾는다', async () => {
      const created = await repo.createFolder({ name: '슬러그', slug: 'by-slug', parentId: null })
      track(created.id)

      const found = await repo.getFolderBySlug(null, 'by-slug')
      expect(found).not.toBeNull()
      expect(found!.id).toBe(created.id)
    })

    it('존재하지 않는 슬러그는 null을 반환한다', async () => {
      const found = await repo.getFolderBySlug(null, 'nonexistent-slug')
      expect(found).toBeNull()
    })
  })

  describe('updateFolder 계약', () => {
    it('이름을 수정하면 반영된다', async () => {
      const created = await repo.createFolder({ name: '원래이름', slug: 'update-test' })
      track(created.id)

      const updated = await repo.updateFolder(created.id, { name: '변경됨' })
      expect(updated).not.toBeNull()
      expect(updated!.name).toBe('변경됨')
      expect(updated!.slug).toBe('update-test') // slug는 변경하지 않음
    })

    it('수정 시 updatedAt이 갱신된다', async () => {
      const created = await repo.createFolder({ name: '시간', slug: 'time-test' })
      track(created.id)

      // 약간의 지연 후 수정
      await new Promise(r => setTimeout(r, 10))
      const updated = await repo.updateFolder(created.id, { name: '변경' })
      expect(updated!.updatedAt).not.toBe(created.updatedAt)
    })

    it('존재하지 않는 ID는 null을 반환한다', async () => {
      const result = await repo.updateFolder('nonexistent', { name: '없음' })
      expect(result).toBeNull()
    })
  })

  describe('deleteFolder 계약', () => {
    it('삭제하면 조회되지 않는다', async () => {
      const created = await repo.createFolder({ name: '삭제대상', slug: 'delete-me' })

      const deleted = await repo.deleteFolder(created.id)
      expect(deleted).toBe(true)

      const found = await repo.getFolder(created.id)
      expect(found).toBeNull()
    })

    it('존재하지 않는 ID를 삭제하면 false를 반환한다', async () => {
      const result = await repo.deleteFolder('nonexistent')
      expect(result).toBe(false)
    })

    it('하위 폴더도 재귀적으로 삭제된다', async () => {
      const parent = await repo.createFolder({ name: '부모', slug: 'parent' })
      const child = await repo.createFolder({ name: '자식', slug: 'child', parentId: parent.id })

      await repo.deleteFolder(parent.id)

      expect(await repo.getFolder(parent.id)).toBeNull()
      expect(await repo.getFolder(child.id)).toBeNull()
    })
  })

  describe('listFolders / listChildFolders 계약', () => {
    it('listFolders는 전체 폴더를 반환한다', async () => {
      const f1 = await repo.createFolder({ name: 'L1', slug: 'l1' })
      const f2 = await repo.createFolder({ name: 'L2', slug: 'l2', parentId: f1.id })
      track(f1.id)
      track(f2.id)

      const all = await repo.listFolders()
      const ids = all.map(f => f.id)
      expect(ids).toContain(f1.id)
      expect(ids).toContain(f2.id)
    })

    it('listChildFolders는 해당 부모의 자식만 반환한다', async () => {
      const parent = await repo.createFolder({ name: '부모', slug: 'p' })
      const child = await repo.createFolder({ name: '자식', slug: 'c', parentId: parent.id })
      const other = await repo.createFolder({ name: '기타', slug: 'o' })
      track(parent.id)
      track(child.id)
      track(other.id)

      const children = await repo.listChildFolders(parent.id)
      expect(children).toHaveLength(1)
      expect(children[0].id).toBe(child.id)
    })

    it('listFolders는 sortOrder 순으로 정렬된다', async () => {
      const f2 = await repo.createFolder({ name: 'B', slug: 'b', sortOrder: 2 })
      const f1 = await repo.createFolder({ name: 'A', slug: 'a', sortOrder: 1 })
      track(f2.id)
      track(f1.id)

      const all = await repo.listFolders()
      const bIdx = all.findIndex(f => f.id === f2.id)
      const aIdx = all.findIndex(f => f.id === f1.id)
      expect(aIdx).toBeLessThan(bIdx)
    })
  })

  describe('reorderFolders 계약', () => {
    it('정렬 순서를 재지정한다', async () => {
      const f1 = await repo.createFolder({ name: 'A', slug: 'ra', sortOrder: 0 })
      const f2 = await repo.createFolder({ name: 'B', slug: 'rb', sortOrder: 1 })
      track(f1.id)
      track(f2.id)

      // 순서 뒤집기
      await repo.reorderFolders(null, [f2.id, f1.id])

      const reordered = await repo.listChildFolders(null)
      const f1After = reordered.find(f => f.id === f1.id)!
      const f2After = reordered.find(f => f.id === f2.id)!
      expect(f2After.sortOrder).toBeLessThan(f1After.sortOrder)
    })
  })
})
