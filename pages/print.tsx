import { useRouter } from 'next/router'

/**
 * Gets raw HTML from query param and echoes it back.
 */
function Print() {
  const router = useRouter()

  let html = router.query.c
  if (Array.isArray(html)) {
    html = html[0]
  } else if (!html) {
    html = ''
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export default Print
