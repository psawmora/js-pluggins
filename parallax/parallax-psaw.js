/*
 Description :

 A simple parallax implementation which moves a given element with a given boundary from it's initial position.
 The implementation can be used along with various arrangements such as background <div> elements etc.
 For this there are two possible ways of defining elements.

 1. User parallaxRegister method registered as a plugging for jQuery.
 2. Mark the element with parallax-element class.

 Please note that when used with the parallax-element class, the moving window size would be the default value.

 Author : Prabath Weerasinghe

 */

(function ($) {

    var parallaxElementPrototype = {
        initOffSet: 0,
        maxOffSet: 100,
        element: null,
        repaint: function () {
            var top = $("body").scrollTop();
            var offsetDiff = (top - this.initOffSet);
            var scrollAmount = Math.round((this.maxOffSet / this.initOffSet) * offsetDiff);
            this.element.style.webkitTransform = "translate3d(0px," + scrollAmount + "px,0px)";
        },
        reset: function () {
            this.element.style.webkitTransform = "translate3d(0px,0px,0px)";
        }
    };

    var ParallaxController = {
        parallaxElements: []
    };

    ParallaxController.register = function (element, options) {
        var parallaxElement = Object.create(parallaxElementPrototype);
        parallaxElement.initOffSet = $(element).offset().top;
        parallaxElement.maxOffSet = options ? options.maxOffSet || maxOffSet : maxOffSet;
        parallaxElement.element = element;
        ParallaxController.parallaxElements.push(parallaxElement);
    };

    ParallaxController.reset = function () {
        var tmpParallaxElements = ParallaxController.parallaxElements || [];
        tmpParallaxElements.forEach(function (parallaxElement, index, elements) {
            parallaxElement.reset();
        });
        ParallaxController.parallaxElements = [];
    };

    ParallaxController.repaint = function () {
        for (var i = 0; i < ParallaxController.parallaxElements.length; i++) {
            this.parallaxElements[i].repaint();
        }
    };

    function registerParallaxElements() {
        var elements = $(".parallax_element").get();
        $(elements).each((function (i, element) {
            ParallaxController.register(element, null);
        }));
    }

    $.fn.parallaxRegister = ParallaxController.register;
    $.fn.parallaxReset = ParallaxController.reset;

    $(document).ready(function () {

        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };

        registerParallaxElements();
        window.requestAnimationFrame(repaintParallaxElements);
    });

    function repaintParallaxElements() {
        window.requestAnimationFrame(repaintParallaxElements);
        ParallaxController.repaint()
    }

})(jQuery);