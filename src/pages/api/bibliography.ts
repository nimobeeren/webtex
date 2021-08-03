import Cite from 'citation-js'
import type { NextApiRequest, NextApiResponse } from 'next'

export type Bibliography = Array<{
  id: string
  author: Array<{
    given?: string
    family: string
  }>
  title: string
}>

function handler(req: NextApiRequest, res: NextApiResponse<Bibliography>) {
  const { body } = req
  const bibliography: Bibliography = Cite.input(body)
  res.status(200).json(bibliography)
}

export default handler
