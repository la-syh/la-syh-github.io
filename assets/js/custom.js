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
   * initialize
   * @returns {FixItBlog}
   */
  init() {
    this.hello();
    this.patchBackToTopFirefoxProgress();
    this.patchTocScrollSpy();
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
