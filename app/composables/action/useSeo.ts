interface SeoOptions {
  title?: string
  description?: string
  path?: string
}

/** 페이지 제목과 OG 메타태그를 설정한다. */
export const useSeo = (options: SeoOptions = {}) => {
  const siteTitle = 'GOMJ Wiki'
  const title = options.title ? `${options.title} - ${siteTitle}` : siteTitle
  const description = options.description ?? '개인 위키 & 기술 블로그'

  useHead({ title })

  useSeoMeta({
    ogTitle: title,
    ogDescription: description,
    description
  })
}
