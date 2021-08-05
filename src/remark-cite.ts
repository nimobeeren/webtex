import { BibLatexParser, CSLExporter, CSLOutput } from 'biblatex-csl-converter'
import CiteProc from 'citeproc'
import fetch from 'cross-fetch'
import { Text } from 'mdast'
import { Plugin } from 'unified'
import { u } from 'unist-builder'
import { Node, visit } from 'unist-util-visit'

const MOCK_BIBLIOGRAPHY = `@article{dijkstra1959,
  title={A note on two problems in connexion with graphs},
  author={Dijkstra, Edsger W and others},
  journal={Numerische mathematik},
  volume={1},
  number={1},
  pages={269--271},
  year={1959}
}

@book{walker2017,
  title={Why we sleep: Unlocking the power of sleep and dreams},
  author={Walker, Matthew},
  year={2017},
  publisher={Simon and Schuster}
}

@misc{kahneman2017,
  title={Thinking, fast and slow},
  author={Kahneman, Daniel},
  year={2017}
}

@article{walker2009,
  title={Measuring Global Money Laundering:" The Walker Gravity Model"},
  author={Walker, John and Unger, Brigitte},
  journal={Review of Law \& Economics},
  volume={5},
  number={2},
  pages={821--853},
  year={2009}
}
`

const CITATION_STYLE = 'apa'
// const CITATION_STYLE = 'acm-sig-proceedings'

function parseBibtex(bibtex: string) {
  // Parse BibLaTeX string to internal structure
  const parser = new BibLatexParser(bibtex)
  const { entries: internalStructure, errors, warnings } = parser.parse()
  for (let error of errors || []) {
    console.error(error)
  }
  for (let warning of warnings || []) {
    console.warn(warning)
  }

  // Convert internal structure to CSL
  const exporter = new CSLExporter(parser.bibDB)
  const csl = exporter.parse()
  // When converting to CSL, the original BibTeX key is replaced by an internal
  // key, which is not useful to us. To preserve the BibTeX key, we get it from
  // the internal structure and store it in the CSL. The internal key should be
  // the same in both structures.
  for (let [internalKey, cslEntry] of Object.entries(csl)) {
    cslEntry.id = internalStructure[internalKey].entry_key
  }

  return csl
}

function getCslItem(csl: CSLOutput, id: string) {
  return Object.values(csl).find((item) => item.id === id)
}

async function createCiteproc(csl: CSLOutput) {
  // Fetch the en-US locale, since it's the only one currently supported
  const locale = await fetch('/citations/locales/locales-en-US.xml').then(
    (res) => res.text()
  )

  const style = await fetch(`/citations/styles/${CITATION_STYLE}.csl`).then(
    (res) => res.text()
  )

  return new CiteProc.Engine(
    {
      retrieveLocale(lang: string) {
        if (lang === 'en-US') {
          return locale
        } else {
          return null
        }
      },

      retrieveItem(id: string) {
        const item = getCslItem(csl, id)
        if (!item) {
          throw new Error(
            `Tried to retrieve non-existent citation item with ID: ${id}`
          )
        }
        return item
      }
    },
    style
  )
}

function getCitationItemIds(citation: Node) {
  // Get the citation ID, given by the joined values of all descendant
  // text nodes
  let citationId = ''
  visit(citation, 'text', (textNode: Text) => {
    citationId += textNode.value
  })
  // TODO: support multiple citation items
  return citationId ? [citationId] : []
}

/**
 * Registers citations and returns a formatted HTML string for each one. Only
 * citations that contain one or more citation item IDs are supported.
 * @returns An array of the same length as `citations`, containing HTML strings
 * corresponding to the given citations.
 */
function registerCitations(citeproc, citations: Node[]): string[] {
  const citeprocCitations = citations.map((citation) => {
    const ids = getCitationItemIds(citation)
    if (ids.length === 0) {
      throw new Error("Can't register citation without item IDs")
    }
    return {
      citationItems: ids.map((id) => ({ id })),
      properties: {
        nodeIndex: 0 // for in-text citations rather than footnotes
      }
    }
  })

  type CitationTriple = [
    string, // ID used internally by citeproc
    number, // nodeIndex
    string // formatted citation
  ]
  const triples: CitationTriple[] = citeproc.rebuildProcessorState(
    citeprocCitations,
    'html'
  )

  // Only return the formatted citation, the rest is not useful for us
  return triples.map((result) => result[2])
}

/**
 * Generates a HTML string for a bibliography.
 */
function makeBibliography(citeproc): string {
  const bib = citeproc.makeBibliography()
  return [bib[0].bibstart, ...bib[1], bib[0].bibend].join('')
}

const attacher: Plugin<[]> = () => {
  return async (tree) => {
    const csl = parseBibtex(MOCK_BIBLIOGRAPHY)
    const citeproc = await createCiteproc(csl)

    // Find all citation nodes
    let citations: Node[] = []
    visit(tree, 'textDirective', (node) => {
      if (node.name === 'cite') {
        citations.push(node)
      }
    })

    let knownCitations: Node[] = [] // valid and exists in the bibliography
    let unknownCitations: Node[] = [] // valid, but does not exist
    for (let citation of citations) {
      const ids = getCitationItemIds(citation)
      // Check if citation items exist in the bibliography
      if (ids.length > 0 && ids.every((id) => getCslItem(csl, id))) {
        knownCitations.push(citation)
      } else {
        // Citation refers to at least one non-existant item
        unknownCitations.push(citation)
      }
    }

    const formattedCitations = registerCitations(citeproc, knownCitations)
    const formattedBibliography = makeBibliography(citeproc)

    // Replace each valid citation node with a formatted citation string
    for (let i = 0; i < knownCitations.length; i++) {
      knownCitations[i].type = 'html'
      knownCitations[i].value = formattedCitations[i]
    }

    for (let unknownCitation of unknownCitations) {
      const ids = getCitationItemIds(unknownCitation)
      unknownCitation.type = 'strong'
      unknownCitation.children = [
        u('text', ids.length > 0 ? `:cite[${ids.join(',')}]` : ':cite')
      ]
    }

    // Create a bibliography section at the end of the document
    ;(tree.children as any).push(
      u('heading', { depth: 2 }, [u('text', 'References')])
    )
    // Add the formatted bibliography as HTML
    ;(tree.children as any).push(u('html', formattedBibliography))
  }
}

export default attacher
