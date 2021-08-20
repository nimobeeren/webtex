# Web$\TeX$

## Introduction

Web$\TeX$ is tool that helps with scientific and technical writing. It is based on Markdown, which introduces simple syntax to make things like headings, [links](https://en.wikipedia.org/wiki/Hyperlink), and **bold** and _italic_ text. Web$\TeX$ extends Markdown by adding support for $\TeX$ math expressions, automatically numbered headings and figures, citations and cross-references.

> Try  making some changes on the left, and watch the preview on the right!

## Features

### Basic Markdown

All basic Markdown features are supported. You may have used Markdown before on sites like Reddit or GitHub. If you haven't, or if you'd like a quick refresher, check out this [cheat sheet](https://commonmark.org/help/).

### Math

Math expressions are supported using [$\KaTeX$](https://katex.org). You can write math in-line by wrapping it in single `$` symbols, for example $e^{i\pi}=-1$. You can also insert math blocks by wrapping with `$$`, for example:

$$
\binom{n}{k} = \frac{n!}{k!(n-k)!}
$$

Many $\TeX$ functions are supported, including macros using `\renewcommand` etc. For a full list of supported functions, refer to the [KaTeX docs](https://katex.org/docs/supported.html).

### Numbered headings and figures

Headings, nested headings, and figures are automatically numbered. A heading with one `#` is not numbered, so this can be used as the title of the document. 

Images are turned into figures with a caption. They use the same syntax as Markdown images, except the alt-text is used as a caption. If you'd like to insert an image without a caption, you can use an `<img>` tag directly, see :ref[html].

![Earthrise.](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/NASA-Apollo8-Dec24-Earthrise.jpg/300px-NASA-Apollo8-Dec24-Earthrise.jpg)

### Citations

You can cite your sources using the `:cite[source]` command, where `source` is the ID of one the items in your bibliography. The Bibliography tab is where you can enter your sources in Bib$\TeX$ format. You can get Bib$\TeX$ citations from many places, such as [Google Scholar](https://scholar.google.com/) and [arXiv](https://arxiv.org/).

Here is an example :cite[dijkstra1959]. A section that lists all of your references is generated and placed at the end of the document.

### Cross-references

Figures and sections can be referenced using the `:ref[id]` command, where `id` is the ID of the element you want to reference. Before something can be referenced, it must have an ID. This is done using the `:id[your-id]` command. 

For example, we can assign the ID `my-fig` to a figure like this:

    ![caption](url) :id[my-fig]

Similarly, assigning the ID `intro` to a section heading:

    ## Introduction :id[intro]

 We can then reference these using `:ref[my-figure]` and `:ref[intro]` respectively.

Sections are automatically given an ID based on the heading text. You can see this ID by hovering over the heading in the preview window. For example, we can reference :ref[features] without explicitly assigning it an ID. Just be aware that your reference might break if the heading is changed.

_Note that IDs are case sensitive._

### HTML

A powerful feature of Markdown is that you can write arbitrary HTML in the document. This lets you do things like custom styling with CSS:

<p style="color: blue; text-align: center;">I'm blue, da ba dee da ba daa</p>

You can also use other HTML tags:

This is <mark>marked</mark>.