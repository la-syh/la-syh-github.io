const params = window.config.mathjax || {}

const output = {
  font: 'mathjax-newcm',
  ...params.output,
}

output.fontExtensions = Array.from(new Set([
  'mathjax-euler',
  ...(params.output?.fontExtensions || []),
]))

/**
 * Load MathJax script dynamically
 */
function loadMathJax() {
  const script = document.createElement('script')
  script.src = params.cdn || 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml-nofont.js'
  script.async = true
  document.head.appendChild(script)
}

/**
 * Configuring MathJax
 * https://docs.mathjax.org/en/latest/options/index.html
 */
window.MathJax = {
  output,
  chtml: {
    ...params.chtml,
  },
  svg: {
    ...params.svg,
  },
  tex: {
    displayMath: [['\\[', '\\]'], ['$$', '$$']],
    inlineMath: [['\\(', '\\)'], ['$', '$']],
    packages: {
      ...params.packages,
    },
    // custom macros
    macros: {
      // make \KaTeX command work in MathJax
      KaTeX: '{K\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX}',
      ...params.macros,
    },
    ...params.tex,
  },
  loader: {
    ...params.loader,
    failed: function (error) {
      console.error(`MathJax(${error.package || '?'}): ${error.message}`);
    },
  },
  options: {
    processHtmlClass: 'content',
    ...params.options,
  }
}

loadMathJax()
