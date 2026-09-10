/**
 * Custom JavaScript for FixIt blog site.
 * @author @Lruihao https://lruihao.cn
 */
class FixItBlog {
  /**
   * say hello
   * you can define your own functions below
   * @returns {FixItBlog}
   */
  hello() {
    console.log('custom.js: Hello FixIt!');
    return this;
  }

  /**
   * FixIt updates circle.progress in Firefox even when scrollpercent is disabled.
   * Add a hidden fallback node so the theme scroll handler does not abort.
   * @returns {FixItBlog}
   */
  patchBackToTopFirefoxProgress() {
    const $backToTop = document.querySelector('.back-to-top');
    if (!$backToTop || $backToTop.querySelector('circle.progress')) return this;

    const svgNS = 'http://www.w3.org/2000/svg';
    const $svg = document.createElementNS(svgNS, 'svg');
    const $circle = document.createElementNS(svgNS, 'circle');
    $svg.setAttribute('viewBox', '0 0 100 100');
    $svg.setAttribute('aria-hidden', 'true');
    $svg.style.display = 'none';
    $circle.setAttribute('class', 'progress');
    $circle.setAttribute('cx', '50');
    $circle.setAttribute('cy', '50');
    $circle.setAttribute('r', '50');
    $svg.appendChild($circle);
    $backToTop.appendChild($svg);
    return this;
  }

  /**
   * Patch FixIt's TOC scrollspy to track headings by href targets.
   * This avoids index mismatches when rendered headings and TOC entries differ.
   * @returns {FixItBlog}
   */
  patchTocScrollSpy() {
    const patch = () => {
      if (!window.fixit || window.fixit.__customTocScrollSpyPatched) {
        return !!window.fixit?.__customTocScrollSpyPatched;
      }

      const getHeadingTarget = ($link) => {
        const hashes = [$link.getAttribute('href'), $link.hash]
          .filter(Boolean)
          .map((href) => {
            try {
              return new URL(href, window.location.href).hash;
            } catch {
              return href.startsWith('#') ? href : '';
            }
          })
          .filter((hash) => hash.length > 1);

        for (const hash of hashes) {
          const rawId = hash.slice(1);
          const candidates = [rawId];
          try {
            candidates.push(decodeURIComponent(rawId));
          } catch { }

          for (const id of candidates) {
            const $heading = document.getElementById(id);
            if ($heading) return $heading;
          }
        }
        return null;
      };

      const keepActiveLinkVisible = ($tocContainer, $activeLink) => {
        const $scroller = $tocContainer.closest('.toc-content');
        if (!$scroller || $scroller.scrollHeight <= $scroller.clientHeight) return;

        const linkRect = $activeLink.getBoundingClientRect();
        const scrollerRect = $scroller.getBoundingClientRect();
        const padding = 24;

        if (linkRect.top < scrollerRect.top + padding) {
          $scroller.scrollTop -= scrollerRect.top + padding - linkRect.top;
        } else if (linkRect.bottom > scrollerRect.bottom - padding) {
          $scroller.scrollTop += linkRect.bottom - (scrollerRect.bottom - padding);
        }
      };

      window.fixit._updateTocActiveState = ($tocContainer, _headingElements, indexOffset) => {
        if (!$tocContainer) return;

        const $tocLinkElements = Array.from($tocContainer.querySelectorAll('a[href*="#"]'));
        const tocTargets = $tocLinkElements
          .map(($link) => ({ $link, $heading: getHeadingTarget($link) }))
          .filter(({ $heading }) => $heading);

        $tocLinkElements.forEach(($link) => $link.classList.remove('active'));
        $tocContainer.querySelectorAll('li.has-active').forEach(($li) => {
          $li.classList.remove('has-active');
        });

        if (!tocTargets.length) return;

        let activeTarget = tocTargets[0];
        for (const target of tocTargets) {
          if (target.$heading.getBoundingClientRect().top <= indexOffset) {
            activeTarget = target;
          } else {
            break;
          }
        }

        activeTarget.$link.classList.add('active');
        let $parent = activeTarget.$link.parentElement;
        while ($parent && $parent !== $tocContainer) {
          if ($parent.tagName === 'LI') $parent.classList.add('has-active');
          $parent = $parent.parentElement;
        }
        keepActiveLinkVisible($tocContainer, activeTarget.$link);
      };

      window.fixit.__customTocScrollSpyPatched = true;
      if (!window.fixit.__customTocScrollSpyListener) {
        window.fixit.__customTocScrollSpyListener = () => {
          window.fixit?._tocOnScroll?.();
          window.fixit?._tocDialogOnScroll?.();
        };
        window.addEventListener('scroll', window.fixit.__customTocScrollSpyListener, { passive: true });
      }
      window.setTimeout(() => window.fixit.initToc?.(), 0);
      return true;
    };

    if (!patch()) {
      let attempts = 0;
      const timer = window.setInterval(() => {
        attempts += 1;
        if (patch() || attempts >= 40) window.clearInterval(timer);
      }, 50);
    }
    return this;
  }

  /**
   * Number article figures and resolve LaTeX-style figure references.
   *
   * Supported prose syntax:
   *   \\ref{fig:label}     -> 1
   *   \\figref{fig:label}  -> Figure 1
   *
   * @returns {FixItBlog}
   */
  initFigureReferences() {
    const $roots = document.querySelectorAll('.page.single .content#content');

    const uniqueId = (wanted, $figure) => {
      const base = wanted || 'figure';
      let candidate = base;
      let suffix = 2;
      while (document.getElementById(candidate) && document.getElementById(candidate) !== $figure) {
        candidate = `${base}-${suffix}`;
        suffix += 1;
      }
      return candidate;
    };

    const createReference = (entry, style, label) => {
      const $reference = document.createElement(entry ? 'a' : 'span');
      $reference.className = entry ? 'figure-ref' : 'figure-ref figure-ref--missing';

      if (!entry) {
        $reference.textContent = '??';
        $reference.title = `Unknown figure label: ${label}`;
        $reference.setAttribute('aria-label', `Unknown figure reference ${label}`);
        return $reference;
      }

      const fullText = `${entry.prefix} ${entry.number}`;
      $reference.href = `#${entry.id}`;
      $reference.textContent = style === 'full' ? fullText : String(entry.number);
      $reference.title = `Jump to ${fullText}`;
      $reference.setAttribute('aria-label', `Jump to ${fullText}`);
      return $reference;
    };

    const isInsideMath = (text, offset) => {
      let dollarMode = 0;
      let parenMode = false;
      let bracketMode = false;

      for (let index = 0; index < offset; index += 1) {
        const char = text[index];
        const next = text[index + 1];
        const escaped = index > 0 && text[index - 1] === '\\';

        if (char === '$' && !escaped) {
          const delimiterLength = next === '$' ? 2 : 1;
          if (dollarMode === 0) {
            dollarMode = delimiterLength;
          } else if (dollarMode === delimiterLength) {
            dollarMode = 0;
          }
          if (delimiterLength === 2) index += 1;
        } else if (char === '\\' && next === '(' && !parenMode && !bracketMode) {
          parenMode = true;
          index += 1;
        } else if (char === '\\' && next === ')' && parenMode) {
          parenMode = false;
          index += 1;
        } else if (char === '\\' && next === '[' && !bracketMode && !parenMode) {
          bracketMode = true;
          index += 1;
        } else if (char === '\\' && next === ']' && bracketMode) {
          bracketMode = false;
          index += 1;
        }
      }
      return dollarMode !== 0 || parenMode || bracketMode;
    };

    $roots.forEach(($root) => {
      const labels = new Map();
      const $figures = Array.from($root.querySelectorAll('figure[data-auto-number="true"]'));

      $figures.forEach(($figure, index) => {
        const number = index + 1;
        const prefix = $figure.dataset.figurePrefix || 'Figure';
        const label = $figure.dataset.figureLabel || '';
        const fallbackId = label
          ? `fig-${label.replace(/^fig:/, '').replace(/[^a-zA-Z0-9_-]+/g, '-')}`
          : `figure-${number}`;
        const id = uniqueId($figure.id || fallbackId, $figure);

        $figure.id = id;
        $figure.dataset.figureNumber = String(number);

        const $number = $figure.querySelector('figcaption .figure-number');
        if ($number) {
          $number.textContent = `${prefix} ${number}: `;
          $number.dataset.resolved = 'true';
        }

        if (label) {
          if (labels.has(label)) {
            $figure.dataset.figureLabelDuplicate = 'true';
            console.warn(`Duplicate figure label "${label}"; references use the first occurrence.`);
          } else {
            labels.set(label, { id, number, prefix });
          }
        }
      });

      $root.querySelectorAll('.figure-ref[data-figure-ref]').forEach(($placeholder) => {
        const label = $placeholder.dataset.figureRef;
        const style = $placeholder.dataset.refStyle === 'number' ? 'number' : 'full';
        $placeholder.replaceWith(createReference(labels.get(label), style, label));
      });

      const excludedSelector = [
        'pre',
        'code',
        'script',
        'style',
        'textarea',
        'svg',
        'math',
        'mjx-container',
        '.katex',
        '.MathJax',
        '[data-no-figure-refs]'
      ].join(',');
      const walker = document.createTreeWalker($root, NodeFilter.SHOW_TEXT);
      const textNodes = [];

      while (walker.nextNode()) {
        const node = walker.currentNode;
        if ((node.nodeValue.includes('\\ref{') || node.nodeValue.includes('\\figref{')) && !node.parentElement?.closest(excludedSelector)) {
          textNodes.push(node);
        }
      }

      textNodes.forEach((node) => {
        const text = node.nodeValue;
        const pattern = /\\(figref|ref)\{([^{}\s]+)\}/g;
        const $fragment = document.createDocumentFragment();
        let cursor = 0;
        let changed = false;
        let match;

        while ((match = pattern.exec(text)) !== null) {
          const [, command, label] = match;
          const entry = labels.get(label);
          const isFigureLabel = label.startsWith('fig:');

          if (isInsideMath(text, match.index) || (!entry && !isFigureLabel)) continue;

          $fragment.append(document.createTextNode(text.slice(cursor, match.index)));
          $fragment.append(createReference(entry, command === 'figref' ? 'full' : 'number', label));
          cursor = match.index + match[0].length;
          changed = true;
        }

        if (changed) {
          $fragment.append(document.createTextNode(text.slice(cursor)));
          node.replaceWith($fragment);
        }
      });
    });

    return this;
  }

  /**
   * Initialize numbered side notes.
   *
   * Notes remain in the article DOM, so MathJax can typeset their contents.
   * They open as a desktop popover or an inline mobile disclosure.
   *
   * @returns {FixItBlog}
   */
  initSidenotes() {
    document.querySelectorAll('.page.single .content#content').forEach(($root) => {
      const $notes = Array.from($root.querySelectorAll('.sidenote[data-sidenote]'));
      if (!$notes.length) return;

      $root.classList.add('sidenotes-ready');

      const setOpen = ($note, open, focusReference = false) => {
        const $reference = $note.querySelector('.sidenote-ref');
        const $body = $note.querySelector('.sidenote-body');
        if (!$reference || !$body) return;

        $note.classList.toggle('is-open', open);
        $reference.setAttribute('aria-expanded', String(open));
        $body.setAttribute('aria-hidden', String(!open));

        if (!open) {
          if (focusReference) $reference.focus();
        }
      };

      const closeOtherNotes = ($current) => {
        $notes.forEach(($note) => {
          if ($note !== $current) setOpen($note, false);
        });
      };

      $notes.forEach(($note, index) => {
        if ($note.dataset.sidenoteReady === 'true') return;
        $note.dataset.sidenoteReady = 'true';

        const number = index + 1;
        const $reference = $note.querySelector('.sidenote-ref');
        const $referenceNumber = $note.querySelector('.sidenote-number');
        const $body = $note.querySelector('.sidenote-body');
        const $bodyNumber = $note.querySelector('.sidenote-body-number');
        const $close = $note.querySelector('.sidenote-close');

        if ($referenceNumber) {
          $referenceNumber.textContent = String(number);
          $referenceNumber.dataset.resolved = 'true';
        }
        if ($bodyNumber) {
          $bodyNumber.textContent = `注 ${number}`;
          $bodyNumber.dataset.resolved = 'true';
        }
        if (!$reference || !$body) return;

        $reference.setAttribute('aria-label', `注释 ${number}`);

        $reference.addEventListener('click', () => {
          const willOpen = !$note.classList.contains('is-open');
          closeOtherNotes($note);
          setOpen($note, willOpen);
        });

        $close?.addEventListener('click', () => {
          setOpen($note, false, true);
        });

        setOpen($note, $note.dataset.open === 'true');
      });

      document.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.closest('.sidenote')) return;
        $notes.forEach(($note) => setOpen($note, false));
      });

      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        const $openNote = $root.querySelector('.sidenote.is-open');
        if ($openNote) setOpen($openNote, false, true);
      });

    });

    return this;
  }

  /**
   * initialize
   * @returns {FixItBlog}
   */
  init() {
    this.hello();
    this.patchBackToTopFirefoxProgress();
    this.patchTocScrollSpy();
    this.initFigureReferences();
    this.initSidenotes();
    return this;
  }
}

/**
 * immediate execution
 */
(() => {
  window.fixitBlog = new FixItBlog();
  // it will be executed when the DOM tree is built
  document.addEventListener('DOMContentLoaded', () => {
    window.fixitBlog.init();
  });
})();
