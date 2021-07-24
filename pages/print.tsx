import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function Print() {
  const [html, setHtml] = useState('')
  const router = useRouter()

  let encodedHtml = router.query.c
  if (Array.isArray(encodedHtml)) {
    encodedHtml = encodedHtml[0]
  } else if (!encodedHtml) {
    encodedHtml = ''
  }

  useEffect(() => {
    setHtml(atob(encodedHtml as string))
  }, [encodedHtml])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export default Print
