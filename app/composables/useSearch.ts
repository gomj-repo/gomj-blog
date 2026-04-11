interface SearchResult {
  title: string
  description?: string
  path: string
  board: string
  tags?: string[]
}

export function useSearch() {
  const query = useState('search-query', () => '')
  const results = useState<SearchResult[]>('search-results', () => [])
  const isOpen = useState('search-open', () => false)
  let allArticles: SearchResult[] = []
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const boards = ['projects', 'til', 'notes', 'resume']

  async function loadArticles() {
    if (allArticles.length > 0) return
    const fetched = await Promise.all(
      boards.map(async (board) => {
        const items = await queryCollection(board as any).where('draft', '<>', true).all()
        return items.map((item: any) => ({
          title: item.title || '',
          description: item.description || '',
          path: item.path || '',
          board,
          tags: item.tags || [],
        }))
      })
    )
    allArticles = fetched.flat()
  }

  function search(q: string) {
    if (!q.trim()) {
      results.value = []
      return
    }
    const lower = q.toLowerCase()
    results.value = allArticles
      .map(article => {
        let score = 0
        if (article.title.toLowerCase().includes(lower)) score += 3
        if (article.description?.toLowerCase().includes(lower)) score += 2
        if (article.tags?.some(t => t.toLowerCase().includes(lower))) score += 1
        return { ...article, score }
      })
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  function debouncedSearch(q: string) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => search(q), 300)
  }

  watch(query, (val) => debouncedSearch(val))

  function open() {
    isOpen.value = true
    loadArticles()
  }

  function close() {
    isOpen.value = false
    query.value = ''
    results.value = []
  }

  return { query, results, isOpen, open, close }
}
