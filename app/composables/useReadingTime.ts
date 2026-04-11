export function useReadingTime(text: string | undefined | null): string {
  if (!text) return '약 1분'

  // Strip HTML tags and markdown syntax
  const cleaned = text
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`\[\]()_~>-]/g, '')
    .replace(/\s+/g, '')

  // Korean text: ~500 characters per minute
  const charCount = cleaned.length
  const minutes = Math.max(1, Math.ceil(charCount / 500))

  return `약 ${minutes}분`
}
