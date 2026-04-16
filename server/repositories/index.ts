import type { IFolderRepository } from './folder.repository'
import type { IPageRepository } from './page.repository'
import type { ITagRepository } from './tag.repository'
import type { ISearchRepository } from './search.repository'
import type { IPageVersionRepository } from './page-version.repository'
import type { ICommentRepository } from './comment.repository'
import type { ITemplateRepository } from './template.repository'
import type { IBookmarkRepository } from './bookmark.repository'

import { folderRepository as memoryFolderRepo } from './folder.repository.memory'
import { folderRepository as drizzleFolderRepo } from './folder.repository.drizzle'

import { pageRepository as memoryPageRepo } from './page.repository.memory'
import { pageRepository as drizzlePageRepo } from './page.repository.drizzle'

import { tagRepository as memoryTagRepo } from './tag.repository.memory'
import { tagRepository as drizzleTagRepo } from './tag.repository.drizzle'

import { searchRepository as memorySearchRepo } from './search.repository.memory'
import { searchRepository as drizzleSearchRepo } from './search.repository.drizzle'

import { pageVersionRepository as memoryPageVersionRepo } from './page-version.repository.memory'
import { pageVersionRepository as drizzlePageVersionRepo } from './page-version.repository.drizzle'

import { commentRepository as memoryCommentRepo } from './comment.repository.memory'
import { commentRepository as drizzleCommentRepo } from './comment.repository.drizzle'

import { templateRepository as memoryTemplateRepo } from './template.repository.memory'
import { templateRepository as drizzleTemplateRepo } from './template.repository.drizzle'

import { bookmarkRepository as memoryBookmarkRepo } from './bookmark.repository.memory'
import { bookmarkRepository as drizzleBookmarkRepo } from './bookmark.repository.drizzle'

/**
 * `USE_DATABASE_MODE` 환경변수에 따라 인메모리 구현체 또는 Drizzle(Postgres) 구현체를 선택한다.
 * 개발 시에는 `MEMORY`, 운영 환경에서는 Postgres를 사용한다.
 */
const isMemoryMode = process.env.USE_DATABASE_MODE === 'MEMORY'

export const folderRepository: IFolderRepository = isMemoryMode ? memoryFolderRepo : drizzleFolderRepo
export const pageRepository: IPageRepository = isMemoryMode ? memoryPageRepo : drizzlePageRepo
export const tagRepository: ITagRepository = isMemoryMode ? memoryTagRepo : drizzleTagRepo
export const searchRepository: ISearchRepository = isMemoryMode ? memorySearchRepo : drizzleSearchRepo
export const pageVersionRepository: IPageVersionRepository = isMemoryMode ? memoryPageVersionRepo : drizzlePageVersionRepo
export const commentRepository: ICommentRepository = isMemoryMode ? memoryCommentRepo : drizzleCommentRepo
export const templateRepository: ITemplateRepository = isMemoryMode ? memoryTemplateRepo : drizzleTemplateRepo
export const bookmarkRepository: IBookmarkRepository = isMemoryMode ? memoryBookmarkRepo : drizzleBookmarkRepo

export type { IFolderRepository } from './folder.repository'
export type { IPageRepository } from './page.repository'
export type { ITagRepository } from './tag.repository'
export type { ISearchRepository } from './search.repository'
export type { IPageVersionRepository } from './page-version.repository'
export type { ICommentRepository } from './comment.repository'
export type { ITemplateRepository } from './template.repository'
export type { IBookmarkRepository } from './bookmark.repository'
