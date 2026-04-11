export interface BoardInfo {
  name: string
  label: string
  icon: string
  description: string
}

const boards: BoardInfo[] = [
  { name: 'projects', label: 'Projects', icon: '📁', description: '개발 프로젝트 포트폴리오' },
  { name: 'til', label: 'TIL', icon: '💡', description: 'Today I Learned - 오늘 배운 것' },
  { name: 'notes', label: 'Tech Notes', icon: '📝', description: '기술 노트 및 정리' },
  { name: 'resume', label: 'Resume', icon: '👤', description: '이력서 및 자기소개' },
]

export function useNavigation() {
  const route = useRoute()

  const currentBoard = computed(() => {
    const path = route.path.split('/').filter(Boolean)
    return path[0] || ''
  })

  const isActiveBoard = (boardName: string) => {
    return currentBoard.value === boardName
  }

  return {
    boards,
    currentBoard,
    isActiveBoard,
  }
}
