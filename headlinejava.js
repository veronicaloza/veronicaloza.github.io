$(document).ready(function () {
    var containers = $('.container');

    if (containers.length) {
        containers.each(function () {
            var container = $(this);

            // Support small text - copy to fill screen width
            if (container.find('.scrolling-text').outerWidth() < $(window).width()) {
                var windowToScrolltextRatio = Math.round($(window).width() / container.find('.scrolling-text').outerWidth()),
                    scrollTextContent = container.find('.scrolling-text .scrolling-text-content').text(),
                    newScrollText = '';
                for (var i = 0; i < windowToScrolltextRatio; i++) {
                    newScrollText += ' ' + scrollTextContent;
                }
                container.find('.scrolling-text .scrolling-text-content').text(newScrollText);
            }

            // Init variables and config
            var scrollingText = container.find('.scrolling-text'),
                scrollingTextWidth = scrollingText.outerWidth(),
                scrollingTextHeight = scrollingText.outerHeight(true),
                startLetterIndent = parseInt(scrollingText.find('.scrolling-text-content').css('font-size'), 10) / 4.8,
                startLetterIndent = Math.round(startLetterIndent),
                scrollAmountBoundary = Math.abs($(window).width() - scrollingTextWidth),
                transformAmount = 0,
                leftBound = 0,
                rightBound = scrollAmountBoundary,
                transformSpeed = 200;

            // Read transform speed
            if (container.attr('speed')) {
                transformSpeed = container.attr('speed');
            }

            // Make scrolling text copy for scrolling infinity
            container.append(scrollingText.clone().addClass('scrolling-text-copy'));
            container.find('.scrolling-text').css({ 'position': 'absolute', 'left': 0 });
            container.css('height', scrollingTextHeight);

            var getActiveScrollingText = function (direction) {
                var firstScrollingText = container.find('.scrolling-text:nth-child(1)');
                var secondScrollingText = container.find('.scrolling-text:nth-child(2)');

                var firstScrollingTextLeft = parseInt(container.find('.scrolling-text:nth-child(1)').css("left"), 10);
                var secondScrollingTextLeft = parseInt(container.find('.scrolling-text:nth-child(2)').css("left"), 10);

                if (direction === 'left') {
                    return firstScrollingTextLeft < secondScrollingTextLeft ? secondScrollingText : firstScrollingText;
                } else if (direction === 'right') {
                    return firstScrollingTextLeft > secondScrollingTextLeft ? secondScrollingText : firstScrollingText;
                }
            };

            // Helper to enforce infinite-loop bounds
            function checkBounds() {
                if (transformAmount < leftBound) {
                    var active = getActiveScrollingText('left');
                    active.css({
                        left: Math.round(leftBound - scrollingTextWidth - startLetterIndent) + 'px'
                    });
                    leftBound = parseInt(active.css('left'), 10);
                    rightBound = leftBound + scrollingTextWidth + scrollAmountBoundary + startLetterIndent;
                }
                else if (transformAmount > rightBound) {
                    var active = getActiveScrollingText('right');
                    active.css({
                        left: Math.round(
                            rightBound + scrollingTextWidth - scrollAmountBoundary + startLetterIndent
                        ) + 'px'
                    });
                    rightBound += scrollingTextWidth + startLetterIndent;
                    leftBound = rightBound - scrollingTextWidth - scrollAmountBoundary - startLetterIndent;
                }
            }

            var scrollingEls = container.find('.scrolling-text');
            var scrollingContent = container.find('.scrolling-text .scrolling-text-content');

            // Move the headline with the page, including when the pointer is over the works.
            var lastScrollY = 0;
            var skewTimer = null;
            var scrollFactor = (parseFloat(transformSpeed) || 70) / 45;

            function readScrollY() {
                if (window.lenis && typeof window.lenis.scroll === 'number') {
                    return window.lenis.scroll;
                }
                return window.scrollY || document.documentElement.scrollTop || 0;
            }

            function syncHeadlineToPageScroll() {
                var y = readScrollY();
                var delta = y - lastScrollY;
                lastScrollY = y;
                if (delta === 0) return;
                // Keep traveling forward. Scrolling back to the top does not rewind the line.
                transformAmount += Math.abs(delta) * scrollFactor;
                scrollingContent.css('transform', 'skewX(10deg)');
                scrollingEls.css('transform', 'translate3d(' + (transformAmount * -1) + 'px, 0, 0)');
                window.clearTimeout(skewTimer);
                skewTimer = window.setTimeout(function () {
                    scrollingContent.css('transform', 'skewX(0)');
                }, 180);
                checkBounds();
            }

            window.addEventListener('scroll', syncHeadlineToPageScroll, { passive: true });
            if (window.lenis && typeof window.lenis.on === 'function') {
                window.lenis.on('scroll', syncHeadlineToPageScroll);
            }
            syncHeadlineToPageScroll();
        });
    }
});
