import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import puppeteer from 'puppeteer'

/** 에디터에서 사용하는 TipTap 확장 목록 (서버 측 HTML 변환용). */
const extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Image,
  Link,
]

/**
 * TipTap JSON 콘텐츠를 PDF 버퍼로 변환한다.
 * @param content TipTap JSON 문서 객체
 * @param title 페이지 제목 (PDF 상단에 표시)
 */
export async function tiptapJsonToPdf(
  content: Record<string, unknown> | null,
  title: string,
): Promise<Buffer> {
  const bodyHtml = content ? generateHTML(content, extensions) : ''

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      padding: 40px 32px;
      color: #1a1a1a;
      line-height: 1.75;
      font-size: 14px;
    }
    h1.page-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e5e5;
    }
    h1 { font-size: 22px; font-weight: 700; margin: 1em 0 0.5em; }
    h2 { font-size: 18px; font-weight: 600; margin: 0.75em 0 0.5em; }
    h3 { font-size: 16px; font-weight: 600; margin: 0.75em 0 0.5em; }
    p { margin: 0.5em 0; }
    ul, ol { padding-left: 1.5rem; margin: 0.5em 0; }
    li { margin: 0.25em 0; }
    blockquote {
      border-left: 3px solid #d4d4d4;
      padding-left: 1rem;
      margin: 0.5em 0;
      color: #525252;
    }
    pre {
      background-color: #f5f5f5;
      border-radius: 6px;
      padding: 1rem;
      margin: 0.5em 0;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.4;
    }
    code {
      background-color: #f0f0f0;
      border-radius: 3px;
      padding: 1px 4px;
      font-size: 13px;
    }
    pre code { background: none; padding: 0; }
    hr { border: none; border-top: 1px solid #e5e5e5; margin: 1.5em 0; }
    a { color: #2563eb; text-decoration: underline; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1 class="page-title">${escapeHtml(title)}</h1>
  ${bodyHtml}
</body>
</html>`

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      printBackground: true,
    })
    return Buffer.from(pdfBuffer)
  }
  finally {
    await browser.close()
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
