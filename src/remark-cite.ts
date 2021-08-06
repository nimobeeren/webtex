import { BibLatexParser, CSLEntry, CSLExporter } from 'biblatex-csl-converter'
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

/** Reference to a specific bibliographic resource */
type CitationItem = string
/** Cluster of citation items referenced in the same place */
type Citation = CitationItem[]
/** Data structure returned by citeproc when formatting a citation */
type CiteProcCitationTriple = [
  string, // ID used internally by citeproc
  number, // nodeIndex
  string // formatted citation
]

/**
 * Stateful structure that produces a bibliography and citations, formatted in a
 * context-aware manner, so as to adhere to a particular citation style.
 */
class CitationEngine {
  bibliography: Record<string, CSLEntry> = {}
  citations: Citation[] = []
  style = 'apa'
  locale = 'en-US'

  citeProc: any
  citeProcState: CiteProcCitationTriple[] = []

  constructor(style?: string, locale?: string) {
    if (style != null) this.style = style
    if (locale != null) this.locale = locale
  }

  /**
   * Must be called (and awaited!) before using other instance methods.
   */
  async init() {
    this.citeProc = await this.createCiteProc()
  }

  /**
   * Creates an instance of the CiteProc CSL engine.
   * @returns the instance
   */
  async createCiteProc() {
    const self = this

    const citationLocale = await fetch(
      `/citations/locales/locales-${this.locale}.xml`
    ).then((res) => res.text())

    const citationStyle = await fetch(
      `/citations/styles/${this.style}.csl`
    ).then((res) => res.text())

    return new CiteProc.Engine(
      {
        retrieveLocale(lang: string) {
          if (lang === self.locale) {
            return citationLocale
          } else {
            return null
          }
        },

        retrieveItem(id: string) {
          const entry = self.getBibEntry(id)
          if (!entry) {
            throw new Error(
              `Tried to retrieve non-existent bibliography entry with ID: ${id}`
            )
          }
          return entry
        }
      },
      citationStyle
    )
  }

  /**
   * Sets the bibliography, which contains the items that can be cited.
   * This method must be called before setting citations.
   * @param bibtex string containing the bibliography in BibTeX format
   */
  setBibliography(bibtex: string) {
    this.bibliography = CitationEngine.parseBibtex(bibtex)
  }

  /**
   * Sets all citations in the document, replacing the old citations if there
   * were any.
   */
  setCitations(citations: Citation[]) {
    this.citations = citations

    const citeProcCitations = citations.map((citation) => {
      if (citation.length === 0) {
        throw new Error("Can't register citation without item IDs")
      }
      return {
        citationItems: citation.map((item) => ({ id: item })),
        properties: {
          nodeIndex: 0 // for in-text citations rather than footnotes
        }
      }
    })
    this.citeProcState = this.citeProc.rebuildProcessorState(
      citeProcCitations,
      'html'
    )
  }

  /**
   * Gets an entry from the bibliography if it exists.
   * @returns the entry in CSL-JSON format, or `undefined` if it doesn't exist
   */
  getBibEntry(id: string) {
    if (!this.bibliography) {
      return undefined
    }
    return Object.values(this.bibliography).find((entry) => entry.id === id)
  }

  /**
   * Generates a formatted bibliography.
   * @returns a HTML string of the bibliography
   */
  getFormattedBibliography(): string {
    const bib = this.citeProc.makeBibliography()
    return [bib[0].bibstart, ...bib[1], bib[0].bibend].join('')
  }

  /**
   * Generates formatted citations.
   * @returns an array of HTML strings, one for each citation
   */
  getFormattedCitations(): string[] {
    // Only return the formatted citation, the rest is not useful for us
    return this.citeProcState.map((triple) => triple[2])
  }

  /**
   * Parses a bibliography in BibTeX format and returns it in CSL-JSON format.
   * @returns CSL-JSON representation of the bibliography
   */
  static parseBibtex(bibtex: string) {
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
}

/**
 * Gets citation item IDs from a given node, assuming that it is a citation
 * node.
 * @returns the citation, which could contain multiple citation items
 */
function getCitationFromNode(citation: Node): Citation {
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
 * Remark plugin to generate formatted citations.
 */
const attacher: Plugin<[]> = () => {
  return async (tree) => {
    const engine = new CitationEngine()
    await engine.init()
    engine.setBibliography(MOCK_BIBLIOGRAPHY)

    // Find all citation nodes
    const citations: Citation[] = []
    const citationNodeMap = new Map<Citation, Node>()
    visit(tree, 'textDirective', (node) => {
      if (node.name === 'cite') {
        const citation = getCitationFromNode(node)
        citations.push(citation)
        citationNodeMap.set(citation, node)
      }
    })

    // Check if citations refer to existing bibliography entries
    let knownCitations: Citation[] = []
    let unknownCitations: Citation[] = []
    for (let citation of citations) {
      if (
        citation.length > 0 &&
        citation.every((item) => engine.getBibEntry(item))
      ) {
        knownCitations.push(citation)
      } else {
        // Citation refers to at least one non-existant item
        unknownCitations.push(citation)
      }
    }

    engine.setCitations(knownCitations)
    const formattedCitations = engine.getFormattedCitations()

    // Replace each known citation node with a formatted citation string
    for (let i = 0; i < knownCitations.length; i++) {
      const node = citationNodeMap.get(knownCitations[i])
      node!.type = 'html'
      node!.value = formattedCitations[i]
    }

    // Replace unknown citation nodes with a warning string
    for (let citation of unknownCitations) {
      const node = citationNodeMap.get(citation)
      node!.type = 'strong'
      node!.children = [
        u(
          'text',
          citation.length > 0 ? `:cite[${citation.join(',')}]` : ':cite'
        )
      ]
    }

    if (knownCitations.length > 0) {
      // Create a bibliography section at the end of the document
      ;(tree.children as any).push(
        u('heading', { depth: 2 }, [u('text', 'References')])
      )
      // Add the formatted bibliography as HTML
      ;(tree.children as any).push(u('html', engine.getFormattedBibliography()))
    }
  }
}

export default attacher
