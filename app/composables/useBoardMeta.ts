import type { BoardInfo } from './useNavigation'
import { useNavigation } from './useNavigation'

export function useBoardMeta(boardName?: string) {
  const { boards, currentBoard } = useNavigation()

  const resolvedName = computed(() => boardName || currentBoard.value)

  const boardMeta = computed<BoardInfo | undefined>(() => {
    return boards.find(b => b.name === resolvedName.value)
  })

  const boardLabel = computed(() => boardMeta.value?.label ?? resolvedName.value)
  const boardDescription = computed(() => boardMeta.value?.description ?? '')
  const boardIcon = computed(() => boardMeta.value?.icon ?? '📄')

  return {
    boardMeta,
    boardLabel,
    boardDescription,
    boardIcon,
  }
}
