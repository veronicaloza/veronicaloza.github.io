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
                transformDirection = container.hasClass('left-to-right') ? -1 : 1,
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

            // Batched: one translate per frame, fewer style writes while trackpads send many wheel events
            function applyTransform(delta, n) {
                n = Math.max(1, n | 0);
                if (delta > 0) {
                    transformAmount += transformSpeed * transformDirection * n;
                    scrollingContent.css('transform', 'skewX(10deg)');
                } else {
                    transformAmount -= transformSpeed * transformDirection * n;
                    scrollingContent.css('transform', 'skewX(-10deg)');
                }
                requestAnimationFrame(function () {
                    scrollingEls.css('transform', 'translate3d(' + transformAmount * -1 + 'px, 0, 0)');
                });
                window.setTimeout(function () {
                    scrollingContent.css('transform', 'skewX(0)');
                }, 500);

                checkBounds();
            }

            var wheelAcc = 0;
            var wheelRaf = null;
            function flushWheel() {
                wheelRaf = null;
                if (Math.abs(wheelAcc) < 0.5) {
                    wheelAcc = 0;
                    return;
                }
                var acc = wheelAcc;
                wheelAcc = 0;
                var n = Math.min(8, Math.max(1, Math.round(Math.abs(acc) / 45)));
                applyTransform(acc, n);
            }

            var lastTouchY = 0;
            var isTouching = false;
            var touchAcc = 0;
            var touchRaf = null;
            function flushTouch() {
                touchRaf = null;
                if (Math.abs(touchAcc) < 5) {
                    touchAcc = 0;
                    return;
                }
                var t = touchAcc;
                touchAcc = 0;
                var n = Math.min(6, Math.max(1, Math.round(Math.abs(t) / 40)));
                applyTransform(t, n);
            }

            // Hero only: do not fight Lenis / page scroll when the pointer is over the grid below
            var heroEl = container.closest('.containerdiag').get(0);
            if (heroEl) {
                // 1) WHEEL (desktop)
                heroEl.addEventListener(
                    'wheel',
                    function (e) {
                        wheelAcc += e.deltaY;
                        if (!wheelRaf) {
                            wheelRaf = requestAnimationFrame(flushWheel);
                        }
                    },
                    { passive: true }
                );

                // 2) TOUCH (mobile) — only while gesture starts on the hero
                heroEl.addEventListener(
                    'touchstart',
                    function (e) {
                        if (!e.touches[0]) return;
                        lastTouchY = e.touches[0].clientY;
                        isTouching = true;
                    },
                    { passive: true }
                );
                heroEl.addEventListener(
                    'touchmove',
                    function (e) {
                        if (!isTouching || !e.touches[0]) return;
                        var currentY = e.touches[0].clientY;
                        var deltaY = lastTouchY - currentY;
                        if (Math.abs(deltaY) < 1) return;
                        touchAcc += deltaY;
                        lastTouchY = currentY;
                        if (!touchRaf) {
                            touchRaf = requestAnimationFrame(flushTouch);
                        }
                    },
                    { passive: true }
                );
                function touchEnd() {
                    isTouching = false;
                }
                heroEl.addEventListener('touchend', touchEnd, { passive: true });
                heroEl.addEventListener('touchcancel', touchEnd, { passive: true });
            }
        });
    }
});
