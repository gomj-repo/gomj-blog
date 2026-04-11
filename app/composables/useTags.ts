import type { BoardInfo } from './useNavigation'
import { useNavigation } from './useNavigation'

interface TagInfo {
  name: string
  count: number
}

export function useTags() {
  const { boards } = useNavigation()

  const fetchAllArticles = async () => {
    const results = await Promise.all(
      boards.map(board =>
        queryCollection(board.name as any).where('draft', '<>', true).order('date', 'DESC').all()
      )
    )
    return results.flat()
  }

  const getAllTags = (articles: any[]): TagInfo[] => {
    const tagMap = new Map<string, number>()
    for (const article of articles) {
      if (article.tags) {
        for (const tag of article.tags) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
        }
      }
    }
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  const getArticlesByTag = (articles: any[], tag: string) => {
    return articles.filter(a => a.tags?.includes(tag))
  }

  return { fetchAllArticles, getAllTags, getArticlesByTag }
}
