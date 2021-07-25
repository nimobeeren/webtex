function mapNodeNameToPrefix(nodeName: string) {
  if (nodeName == 'H2') {
    return 'Section'
  }
  if (['H3', 'H4', 'H5', 'H6'].includes(nodeName)) {
    return 'Subsection'
  }
  return null
}

export function Ref({ to }) {
  // const toElement = document.getElementById(to)

  // if (!toElement) {
  //   return <a>??</a>
  // }

  // console.log(toElement)
  // const prefix = mapNodeNameToPrefix(toElement.nodeName)
  // const counter = "2.3" // TODO: may not be possible with CSS counters

  let text: string
  // if (prefix) {
  //   text = `${prefix} ${counter}`
  // } else {
  //   text = counter
  // }
  text = 'Reference'

  return <a href={`#${to}`}>{text}</a>
}
