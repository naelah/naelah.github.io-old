(function() {

    // helper function so we can map over dom selection
    function selectionToArray(selection) {
        var len = selection.length
        var result = []
        for (var i = 0; i < len; i++) {
            result.push(selection[i])
        }
        return result
    }

    // throttle function
    // https://remysharp.com/2010/07/21/throttling-function-calls
    function throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
        deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date,
            args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }
    
    function rollyourown() {
        // select elements
        var graphicEl = document.querySelector('.graphic')
        var graphicVisEl = graphicEl.querySelector('.graphic__vis')
        var triggerEls = selectionToArray(graphicEl.querySelectorAll('.trigger'))

        // viewport height
        var viewportHeight = window.innerHeight
        var halfViewportHeight = Math.floor(viewportHeight / 2)

        // a global function creates and handles all the vis + updates
        var graphic = createGraphic('.graphic')

        // handle the fixed/static position of grahpic
        var toggle = function(fixed, bottom) {
            if (fixed) graphicVisEl.classList.add('is-fixed')
            else graphicVisEl.classList.remove('is-fixed')

            if (bottom) graphicVisEl.classList.add('is-bottom')
            else graphicVisEl.classList.remove('is-bottom')
        }

        // keep track of a bunch of things related to the bounding box, scroll direction, triggers
        var bbTop = 0	
        var bbBottom = 0
        var height = graphicEl.getBoundingClientRect().height
        var prevStep = 0
        var currentStep = 0
        var numSteps = triggerEls.length

        // check if we need to trigger graphic to update
        var checkTrigger = function() {
            if (bbTop < viewportHeight && bbBottom > 0) {
                var progress = Math.abs(bbTop - halfViewportHeight) / height * numSteps
                var step = Math.floor(progress)
                currentStep = Math.min(Math.max(step, 0), numSteps - 1)
            }
        }

        // toggled fixed position
        var checkEnterExit = function() {
            var bottomFromTop = bbBottom - viewportHeight
            var bottom
            var fixed

            if (bbTop < 0 && bottomFromTop > 0) {
                bottom = false
                fixed = true
            } else if (bbTop < 0 && bottomFromTop < 0) {
                bottom = true
                fixed = false
            } else {
                bottom = false
                fixed = false
            }
            
            toggle(fixed, bottom)
        }

        var handleScroll = function() {
            // update bounding box vars
            var bb = graphicEl.getBoundingClientRect()
            bbTop = bb.top
            bbBottom = bb.bottom

            checkTrigger()
            checkEnterExit()
        }

        // throttled scroll event
        window.addEventListener('scroll', throttle(handleScroll, 50))

        // use raf to check if we should update the graphic or not
        var render = function() {
            if (currentStep !== prevStep) {
                prevStep = currentStep
                graphic.update(currentStep)
            }
            
            window.requestAnimationFrame(render)
        }
        render()
    }

    rollyourown()

})()