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
  year={2009},
  publisher={De Gruyter}
}
`

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

async function createCiteproc(csl: CSLOutput) {
  // Fetch the en-US locale, since it's the only one currently supported
  const locale = await fetch('/citations/locales/locales-en-US.xml').then(
    (res) => res.text()
  )

  const style = await fetch('/citations/styles/acm-sig-proceedings.csl').then(
    (res) => res.text()
  )

  return new CiteProc.Engine(
    {
      retrieveLocale(lang) {
        if (lang === 'en-US') {
          return locale
        } else {
          return null
        }
      },

      retrieveItem(id) {
        return Object.values(csl).find((item) => item.id === id)
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
  return [citationId || null]
}

/**
 * Registers citations and returns a formatted HTML string for each one.
 * @returns An array of the same length as `citations`, containing HTML strings
 * corresponding to the given citations.
 */
function registerCitations(citeproc, citations: Node[]): string[] {
  const citeprocCitations = citations.map((citation) => {
    return {
      citationItems: getCitationItemIds(citation).map((id) => ({ id })),
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
    // Find all citation nodes
    const citations: Node[] = []
    visit(tree, 'textDirective', (node) => {
      if (node.name === 'cite') {
        citations.push(node)
      }
    })

    const csl = parseBibtex(MOCK_BIBLIOGRAPHY)
    const citeproc = await createCiteproc(csl)
    const formattedCitations = registerCitations(citeproc, citations)
    const formattedBibliography = makeBibliography(citeproc)

    // Replace each citation node with a formatted citation string
    for (let i = 0; i < citations.length; i++) {
      citations[i].type = 'html'
      citations[i].value = formattedCitations[i]
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
