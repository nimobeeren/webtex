# WebTeX

> Check out [a running example](https://webtex.vercel.app/)

The goal of this web app is to make it easier to do scientific and technical writing. It does this by building on tools commonly used on the web such as Markdown, HTML and CSS. These are combined with powerful scientific tools such as TeX for math expressions and BibTeX for citations.

Currently, the de facto standard tool for producing scientific material is LaTeX. While very powerful, LaTeX can be counterintuitive to beginners. WebTeX is an attempt to flatten the learning curve, and improve extensibility by building on widespread technology.

## Development

1. `git clone`
2. Make a copy of `.env.example` and rename it to `.env`. Follow the instructions in that file to correclty set up your environment variables.
3. Run database migrations: `yarn prisma migrate dev`
4. Populate the database with some data: `yarn prisma db seed`
5. Run the development server: `yarn dev`
