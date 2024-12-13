/**
 * Created by 中焯（九指神丐) on 2015/7/19.
 * 2017-4-14 增加wkwebview 九指神丐
 * 2017-5-4增加请求超时的timeout参数，默认30000ms ，自定义请求里增加{timeout：ms} will
 */
;(function () {
	function EventTarget() {
		this.handlers = {};
	}
	EventTarget.prototype = {
		constructor: EventTarget,
		addHandler: function (type, handler) {
			if (typeof this.handlers[type] == 'undefined') {
				this.handlers[type] = new Array();
			}
			this.handlers[type].push(handler);
		},
		removeHandler: function (type) {
			if (this.handlers[type] instanceof Array) {
				delete this.handlers[type]
			}
		},
		trigger: function (event) {
			if (!event.target) {
				event.target = this;
			}
			if (this.handlers[event.type] instanceof Array) {
				var handlers = this.handlers[event.type];
				for (var i = 0, len = handlers.length; i < len; i++) {
					handlers[i](event.data);
				}
                this.removeHandler(event.type);
			}
		}
	}
	var aEvent = new EventTarget();
	//命名空间。
	window['native'] = {};
	/**
	 * @description 原生功能原请求拦截改为全局调用
	 * @param {string} req 请求类别
	 * @param {object} sendObj 请求参数
	 * @param {string} webkey 根据UUID调用对应回调函数
	 * @param {object} callback 请求应答回调
	 */
	function tztCallNative(req, sendObj, webkey, callback) {
        var _req = req.split('?')[1] ? req : req.split('?')[0];
        var _jsonobj = JSON.stringify(sendObj);
        webkey &&
            aEvent.addHandler(webkey, function (odata) {
                window.h5FastNativeSuccess(odata, callback)
            });
        window.MyWebView.tztCallNativeFuctionFromWeb(webkey, _req, _jsonobj);
	}
    window.tztCallWebFuctionFromNative = function (uuid, fuctionID, odata) {
		aEvent.trigger({ type: uuid, func: fuctionID, data: odata });
	}
	window['native']['tztCallNative'] = tztCallNative;
})();
;(function () {
    'use strict';
    // function inputToText(){
    //     if ('input[type="number"]') {
    //         alert(navigator.appVersion);
    //     }
    // }
    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */

    /*jslint browser:true, node:true*/
    /*global define, Event, Node*/


    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick(layer, options) {
        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;


        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;


        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;


        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;


        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;


        /**
         * ID of the last touch, retrieved from Touch.identifier.
         *
         * @type number
         */
        this.lastTouchIdentifier = 0;


        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;


        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function() { return method.apply(context, arguments); };
        }


        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function(type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function(type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                            if (!event.propagationStopped) {
                                callback(event);
                            }
                        }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {

            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function(event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    /**
     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
     *
     * @type boolean
     */
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

    /**
     * Android requires exceptions.
     *
     * @type boolean
     */
    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


    /**
     * iOS 4 requires an exception for select elements.
     *
     * @type boolean
     */
    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

    /**
     * BlackBerry requires exceptions.
     *
     * @type boolean
     */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function(target) {
        switch (target.nodeName.toLowerCase()) {

            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':

                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return (/\bneedsclick\b/).test(target.className);
    };


    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function(target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };


    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function(targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    FastClick.prototype.determineEventType = function(targetElement) {

        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
            return 'mousedown';
        }

        return 'click';
    };


    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function(targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };


    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function(targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };


    /**
     * @param {EventTarget} targetElement
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };


    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function(event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];
        var nodeName = targetElement.nodeName.toLowerCase();
        var typeAttribute = targetElement.getAttribute('type');
        if (nodeName === "select" || (typeAttribute === 'date' && nodeName === "input") || (typeAttribute === 'datetime' && nodeName === "input")){
            return false;
        }
        if (deviceIsIOS) {

            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }

            if (!deviceIsIOS4) {

                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };


    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function(event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;

        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }

        return false;
    };


    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function(event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };


    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function(labelElement) {

        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };


    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function(event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }

        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }

                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {

            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }

        if (deviceIsIOS && !deviceIsIOS4) {

            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };


    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function() {
        this.trackingClick = false;
        this.targetElement = null;
    };


    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function(event) {

        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {

                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();
            event.preventDefault();

            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };


    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function(event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };


    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function() {
        var layer = this.layer;

        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }

        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };


    /**
     * Check whether FastClick is needed.
     *
     * @param {Element} layer The layer to listen on
     */
    FastClick.notNeeded = function(layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;

        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }

        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

        if (chromeVersion) {

            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
            } else {
                return true;
            }
        }

        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }

        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }

        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        return false;
    };


    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function(layer, options) {
        return new FastClick(layer, options);
    };


    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

        // AMD. Register as an anonymous module.
        define(function() {
            return FastClick;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = FastClick.attach;
        module.exports.FastClick = FastClick;
    } else {
        window.FastClick = FastClick;
    }
}());
!(function(window,$){
    var
        rootTZT,
        core_strundefined = typeof undefined,
        NATIVEIOSVERSION = '4.03.037',
        IOSFASTREG = new RegExp(/tc:\/\/(\d+)\.tc\.com/gi),
        IOSFASTREGEN =  new RegExp(/tc%3A%2F%2F(\d+)\.tc\.com/gi),
        location = window.location,
        document = window.document,
        docElem = document.documentElement,
        //防止和外部TZT冲突
        _TZT = window.TZT,
        _change = window.onJsOverrideUrlLoading,
        //防止和外部T冲突
        _T = window.T,
        core_version = "1.0.0",
        app = navigator.appVersion,
        appversion = app.toLocaleLowerCase(),
        TZT = function( selector, context ) {
            return new TZT.fn.init( selector, context, rootTZT );
        };
        function IOSActionURlCheck(url) { // ios支持的版本且系统版本大于13-tc://n.tc.com打开（n为任意数字）
            T.readLocalMesg(['softversion'], function (oLocal) {
                if(T.isAdr() || oLocal.SOFTVERSION < NATIVEIOSVERSION || T.iosVersion('13.3') !== 1) {
                    url = url.replace(IOSFASTREG, '').replace(IOSFASTREGEN, '');
                }
                onJsOverrideUrlLoading(url, true);
            })
        }
    /*$(function(){
        FastClick.attach(document.body);
    });*/
    // $(function(){
    //     FastClick.attach(document.body);
    // });
    //url进行跳转
    window.onJsOverrideUrlLoading = function(str, checkFlag){
        if(!checkFlag && (IOSFASTREG.test(str) || IOSFASTREGEN.test(str))) {
            IOSActionURlCheck(str);
            return;
        }
        if(appversion.indexOf("windows phone")>0){
            window.external.notify(str);
        }else if(appversion.indexOf("iphone")>0){
            window.location.href=str;
        }else if(appversion.indexOf("android")>0){
            window.MyWebView.onJsOverrideUrlLoading(str);
        }else{
            window.location.href = str;
        }
    };
    window.onerror=function(message,url,line)
    {
        T.log("出错详情:\n错误提示："+message+"\nUrl："+url+"\n行号："+line,'error');
        var href = window.location.pathname.toLowerCase()
        var excludeUrl = [
            '/newzt/zt_index.html',//我的
            '/investment/finance/html/index.html',//理财
            '/vue/ui4.0/shouye/html/shouye.html',//首页
            '/vue/ui5/shou-ye/shou-ye/html/shou-ye.html',//首页5.0
            '/vue/ui5/shou-ye/zu-ji/html/zu-ji.html',//足迹
            '/vue/ui4.0/jiaoyishouye/html/jiaoyishouye.html',//普通
            '/newjy/rzrq/rzrq_newindex4.0.html',//信用
            '/newjy/ggqq2.0/ggqq_newindex4.0.html',//期权
            '/vue/ui4.0/qi-huo/html/qihuo.html',//期货
            '/vue/ui5/jiao-yi/jiao-yi-shou-ye/html/jiao-yi-shou-ye.html', //5.0普通
            '/investment/licai5.0/new_finance/html/new_finance.html' //5.0理财
        ]
        var alertType = true
        for(var i=0;i<excludeUrl.length;i++){
            if(excludeUrl[i] == href){
                alertType = false
            }
        }
        if(/.*T\..*is not a function.*$/.test(message)&&alertType){
            alert("本功能需要升级，请重启APP。")
        }
        return true;//屏蔽系统事件
    };
    TZT.fn=TZT.prototype={
        tzt: core_version,
        constructor: TZT,
        init:function(){},
        changeurl:onJsOverrideUrlLoading,
        changeURL:onJsOverrideUrlLoading,
        action10002:function(obj) {
            //返回前一页10002
            var tUrl = 'http://action:10002/?';
            if(obj && obj.isExport){
                return tUrl;
            }
            this.changeurl(tUrl);
        },
        action1964: function(obj){
            //关闭当前页面打开另一个页面1964
            if(typeof obj.url == core_strundefined){
                this.action10002();
                return;
            }
            var tUrl = 'http://action:1964/?url=' + encodeURIComponent(obj.url);
            if(obj && obj.isExport){
                return tUrl;
            }
            this.changeurl(tUrl);
        },
        action3413: function(obj){
            //关闭一组webview3413
            var tUrl = 'http://action:3413/?';
            if(obj && obj.isExport){
                return tUrl;
            }
            this.changeurl(tUrl);
        },
        action10402: function(str,text){
            //系统登出
            var sUrl = '',txt='',_this = this;
            if(typeof text == 'string'){
                txt = 'context='+text+'&&';
            }else{
                var iscont = false;
                for(var x in text){
                    if(x == 'context'){
                        iscont = true;
                    }
                    txt+=x+'='+text[x]+'&&';
                }
                if(!iscont){
                    txt+='context=&&';
                }
            }
            if(typeof str != core_strundefined){
                sUrl = txt+'url='+encodeURIComponent(str);
            }
            TZT.readLocalMesg(['jyloginflag','tztrzrqloginflag','tztggqqloginflag'],function(data){
                if(typeof text ==='string'){
                    if(data.JYLOGINFLAG>1 || data.TZTRZRQLOGINFLAG>0){
                        _this.changeurl('http://action:10402/?'+sUrl);
                    }
                }else if(text && text.logintype){
                    if(text.logintype == '1' && data.JYLOGINFLAG>1){
                        _this.changeurl('http://action:10402/?'+sUrl);
                    }
                    else if(text.logintype == '2' && data.TZTRZRQLOGINFLAG>0){
                        _this.changeurl('http://action:10407/?'+sUrl);
                    }
                    else if(text.logintype == '8' && data.TZTGGQQLOGINFLAG > 0) {
                        _this.changeurl('http://action:17998/?'+sUrl);
                    }
                }
            })
        },
        action10302: function(obj){
            //系统登出
            var tUrl = 'http://action:10302/?';
            if(obj && obj.isExport){
                return tUrl;
            }
            this.changeurl(tUrl);
        },
        action10407: function(obj){
            //融资融券登出
            var tUrl = 'http://action:10407/?';
            if(obj && obj.isExport){
                return tUrl;
            }
            this.changeurl(tUrl);
        },
        action10090: function(obj){
            /*
             *功能：常用判断登陆用action10090全屏打开页面地址
             *参数：url 要打开的url地址 Y
             *参数：fuc 要执行的js方法名
             *参数：logintype @0系统登录@1是普通交易登陆@2是融资融券登陆@8是个股期权登陆@9融资融券担保品划转登录
             */
            var config = {
                logintype:1,
                loginkind:2,
                isExport:false,
                url:'',
                isaction:false
            },sUrl = 'http://action:10090/?';
            TZT.extend(config,obj);
            /*if (typeof config.fuc != core_strundefined){
                sUrl = 'http://action:10090/?logintype='+config.logintype+'&&loginkind='+config.loginkind+'&&jsfuncname=' + config.fuc;
            }else if(config.isaction){
                sUrl = 'http://action:10090/?logintype='+config.logintype+'&&loginkind='+config.loginkind+'&&url='+config.url;
            }else{
                sUrl = 'http://action:10090/?logintype='+config.logintype+'&&loginkind='+config.loginkind+'&&url=' + (config.url ? /!*encodeURIComponent(this.action10061({isExport:true,url:*!/config.url/!*}))*!/ : '');
            }*/
            for(x in config){
                if (x && config[x] != ''){
                    if(x == 'isExport' || x == 'isaction'){
                        continue;
                    }else{
                        sUrl+=x+'='+config[x]+'&&';
                    }
                }
            }
            if(config.isExport){
                return sUrl.slice(0,-2);
            }else{
                this.changeurl(sUrl.slice(0,-2));
            }
        },
        action10061: function(obj){
            //打开一个新的webview10061
            /*
            * type/secondtype
            *  @0、个股查询
            *  @1、修改字体(客户端处理)
            *  @2、订阅(后面需要带上订阅点击打开的地址）
            *  @3、修改(需要带上修改所要打开的地址）
            *  @4、我要开户(需要带上开户地址）
            *  @5、在线客服(需要带上在线客服地址）
            *  @6、筛选 （文字）(需要带上筛选链接地址）
            *  @7、筛选1（图片）(需要带上筛选链接地址）
            *  @8、快捷方式
            *  @9、右侧没有按钮
            *  @98:自定义(显示对应图片)
            *  @99:自定义(设置为默认底图，显示对应文本)
            * fullScreen@是否全屏展示 0-否，1-是
            * url@当前需要打开的url地址
            * secondurl@右侧按钮根据type不同，返回的链接地址，用于type(或secondtype)对应按钮点击的界面跳转，未设置secondjsfuncname有效
            * secondjsfuncname@页面对应JS函数名(就是函数的调用'js()')
            * firstjsfuncname@页面对应JS函数名
            * firsturl@左侧按钮根据firsttype不同，返回的链接地址，用于firsttype对应按钮点击的界面跳转，未设置firstjsfuncname有效
            * firsttext@firsttype=99时有效，显示对应文本或firsttype=98时有效，显示对应图片
            * */
            var config = {
                secondtype:9,
                fullscreen:1
            },aParam = [];
            if(typeof obj == 'string'){
                config.url = obj;
            }
            if(typeof obj != core_strundefined && (typeof obj != 'string')){
                TZT.extend(config,obj);
                if('isExport' in config){
                    delete config['isExport'];
                }
            }
            var x;
            for(x in config){
                if (x && config[x] != ''){
                    if(x == 'url'){
                        aParam.push(x+"=" + encodeURIComponent(config.url));
                        continue;
                    }
                    aParam.push(x+"=" + config[x]);
                }
            }
            var exportUrl = '';
            if(aParam.length !=0){
                exportUrl = 'http://action:10061/?' + aParam.join('&&');
            }
            if(typeof obj.isExport == core_strundefined){
                this.changeurl(exportUrl);
            }else{
                return encodeURIComponent(exportUrl);
            }
        },
        action10054: function(obj){
            var aURL = [];
            if(typeof obj == core_strundefined){
                alert('请写入文件信息，tzttitle文件名称，tztfiletype文件类型，url文件地址');
                return;
            }
            var key;
            for(key in obj){
                if (obj[key] != ''){
                    if(key == 'tztfiletype'){
                        aURL.push(key+"=" + obj[key]);
                    }else{
                        aURL.push(key+"=" + encodeURIComponent(obj[key]));
                    }                    
                }
            }
            var tUrl = 'http://action:10054/?tztfiledata=sContent&&' + aURL.join('&&');
            this.changeurl(tUrl);
        },
        action10055: function(obj){
            var aURL = [];
            //分享渠道 0:微信  1:微信朋友圈  2:QQ好友 3:QQ空间 4:腾讯微博 5:新浪微博 99:客户端选择
            /*
            * @sharetype分享渠道
            * @img_url分享图片URL
            * @url分享的URL
            * @title分享标题
            * @message分享内容
            * */
            if(typeof obj == core_strundefined){
                alert('请写sharetype分享渠道，img_url分享图片URL，url分享的URL，title分享标题，message分享内容');
                return;
            }
            var key;
            for(key in obj){
                if (obj[key] != ''){
                    if(key == 'title' || key == 'message'){
                        aURL.push(key+"=" + obj[key]);
                        continue;
                    }
                    aURL.push(key+"=" + encodeURIComponent(obj[key]));
                }
            }
            var tUrl = 'http://action:10055/?' + aURL.join('&&');
            if(obj && obj.isExport){
                return tUrl;
            }
            this.changeurl(tUrl);
        },
        actiontel: function(obj){
            //拨打电话
            if(!obj || !obj.tel){
                alert('请输入拨打的号码！');
                return;
            }
            var tUrl = 'http://tel:' + obj.tel;
            if(obj && obj.isExport){
                return tUrl;
            }
            this.changeurl(tUrl);
        },
        action10073: function(obj){
            //打开第三方应用
            /*
            * content@下载前的提示内容
            * opentype@调用三方软件方式@0通过scheme打开@1包名打开@2Activity打开
            * appurl@第三方应用调用url
            * activityurl@要打开的第三方应用的activity值
            * downloadurl@下载地址
            * @当opentype等于0或1时activityurl为空，当为2时activityurl为要打开的activity值
            * */
            var config = {
                content:'是否下载',
                opentype:0
            },aParam=[];
            TZT.extend(config,obj);
            var name;
            for(name in config){
                aParam.push(name+"=" + encodeURIComponent(config[name]));
            }
            var tUrl = 'http://action:10073/?'+aParam.join('&&');
            if(obj && obj.isExport){
                return tUrl;
            }
            this.changeurl(tUrl);
        },
        tradeaction: function(obj){
            /*
            * 通用新版调用交易功能
            *1、若只要使用客户端界面，则无须传入url，客户端根据是否有url判断是使用页面的方式还是原生的
            *2、datetype用于日期选择，历史类的查询需要选择日期，页面只传入url，客户端第一次打开，自己补上begindate和enddate作为入参打开，以后每次修改日期，都执行界面的js，js函数固定refreshhistorydata(开始日期，结束日期)，url不再传入
            *http://tradeaction:原先交易功能号/?title=标题&&stockcode=股票代码&&url=要打开的url&&datetype=1
             * */
            var config = {
                title:'',
                stockcode:'',
                url:'',
                datetype:0,
                action:''
            },aParam = '/?';
            TZT.extend(config,obj);
            for(var x in config){
                if(config[x] == '' || x == 'isExport'){
                    delete config[x];
                }else{
                    if(x == 'action'){
                        continue;
                    }
                    aParam += x+'='+config[x]+'&&';
                }
            }
            if(!config.action || (typeof config.action == core_strundefined)){
                /*alert('请输入交易功能号');
                return;*/
                config.action = '';
            }
            if(aParam.length > 2){
                aParam = aParam.slice(0,-2)
            }
            var exportUrl = 'http://tradeaction:'+config.action+aParam;
            if(typeof obj.isExport == core_strundefined || !obj.isExport){
                this.changeurl(exportUrl);
            }else{
                return exportUrl;
            }
        }
    };
    TZT.fn.init.prototype = TZT.fn;
    TZT.extend = TZT.fn.extend = function(){
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if ( typeof target !== "object" && !$.isFunction(target) ) {
            target = {};
        }
        if ( length === i ) {
            target = this;
            --i;
        }
        for ( ; i < length; i++ ) {
            if ( (options = arguments[ i ]) != null ) {
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
                    if ( target === copy ) {
                        continue;
                    }
                    if ( deep && copy && ( $.isPlainObject(copy) || (copyIsArray = $.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];
                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }
                        target[ name ] = TZT.extend( deep, clone, copy );
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        return target;
    };
    TZT.extend({
        changePdfUrl: function (url, title) {
            try {
                var str = navigator.userAgent.toLowerCase();
                var app = navigator.appVersion,
                    appvstr = app.toLocaleLowerCase();
                if (appvstr.indexOf("iphone")>0){
                    var ver = str.match(/cpu iphone os (.*?) like mac os/);
                    var verNo = parseFloat(ver[1].replace(/_/g, "."));
                    if (ver && verNo>=13.0) {
                        var pdf = '/z_modules/pdf/index.html?';
                        T.fn.action10061({url: pdf + 'url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title)})
                    } else {
                        T.fn.action10061({url: url});
                    }
                } else if(appvstr.indexOf("android")>0) {
                    var pdf = '/z_modules/pdf/index.html?';
                    T.fn.action10061({url: pdf + 'url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title)})
                } else {
                    T.fn.action10061({url: url});
                }
            } catch (e) {
                T.fn.action10061({url: url});
            }
        },
        appversion:{
            v:appversion,
            iphone:function(){
                if(appversion.indexOf("iphone")>0){
                    return true;
                }else{
                    return false;
                }
            },
            andriod:function(){
                if(appversion.indexOf("android")>0){
                    return true;
                }else{
                    return false;
                }
            },
            win:function(){
                if(appversion.indexOf("windows phone")>0){
                    return true;
                }else{
                    return false;
                }
            }
        },
        objunit:{},
        urlEncode:function(str){
            if(this.appversion.andriod()){
                return encodeURIComponent(encodeURIComponent(str));
            }else{
                return encodeURIComponent(str);
            }
        },
        urlDecode:function(str){
            return decodeURIComponent(str);
        },
        Template:function(id,data){
            //Html模版
            /*
             * <script type="text/html" id="user_tmpl">
             * <ul>
             *        <% for ( var i = 0; i < users.length; i++ ) { %>
             *           <li>
             *               <a href="<%=users[i].url%>">
             *                  <%=users[i].name%>
             *               </a>
             *           </li>
             *       <% } %>
             *   </ul>
             *   </script>
             */

      var html = document.getElementById(id).innerHTML.replace(/\>\s*\</g, '><');
      var result = "var p=[]; with(oData){p.push('" +
        html.replace(/[\r\n\t]/g, "").replace(/    /g, "")
        .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
        .replace(/<%/g, "');")
        .replace(/%>/g, "p.push('") +
        " ');}return p.join('');";
      //console.log(result);
      var fn = new Function("oData", result);
      return fn(data);
    },
    pagecount: 21,
    REQ: { //兼容之前老版本
      XML: "/reqxml?",
      LOCAL: "/reqlocal?",
      BINARY: "/reqbinary?",
      SAVEMAP: "/reqsavemap?",
      READMAP: "/reqreadmap?",
      SAVEFILE: "/reqsavefile?",
      READFILE: "/reqreadfile?",
      SOFTTODO: "/reqsofttodo?",
      LOADFILE: "reqloadfile?",
      SIGNATURE: "reqsignature?",
      TZTVEDIO: "/tztvideo?"
    },
    getStringWidth: function(str) {
      var width = ln = str.length;
      for (var i = 0; i < ln; i++) {
        if (str.charCodeAt(i) >= 57) {
          width++;
        }
      }
      return width;
    },
    addcont: function(str, index, ZZPINDEX, DATEFORMINDEX) {
      var numlength = str.replace(/\D/g, '').length;
      if (str.indexOf('.') == 0 && numlength != 0) {
        return '0' + str;
      } else {
        if (!ZZPINDEX || !index) {
          return T.dateform(str, index, DATEFORMINDEX);
        }
        var arrIndex = ZZPINDEX.split(','),
          arrNum = [],
          arrSuo = [];
        for (var i = 0; i < arrIndex.length; i++) {
          arrNum[i] = arrIndex[i].split('|')[0];
          arrSuo[i] = arrIndex[i].split('|')[1];
        }
        if (index) {
          var suoindex = arrNum.indexOf(index);
          if (suoindex >= 0) {
            return T.unit(str, arrSuo[suoindex]);
          } else {
            return T.dateform(str, index, DATEFORMINDEX);
          }
        } else {
          return T.dateform(str, index, DATEFORMINDEX);
        }
      }
    },
    mathpow: function(num) {
      return Math.round(num * Math.pow(10, Number(2))) / Math.pow(10, Number(2));
    },
    formatPlus: function(num, n) {
      var n = n || 2;
      num = T.format(num, n);
      return num && num.toString()
        .replace(/\d+/, function(s) {
          return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
        })
    },
    format: function(num, dig) {
      //数字转换成小数两位
      //return Math.round(num*Math.pow(10,Number(dig)))/Math.pow(10,Number(dig));
      var f = parseFloat(num);
      var s = f.toString();
      var rs = s.indexOf('.');
      if (rs < 0 && dig > 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + Number(dig)) {
        s += '0';
      }
      if (rs >= 1 && (f.toString().length - rs > dig)) {

                if(Number(dig)>0){
                    var l = (num.toString().indexOf('.'))+1;
                    s = num.toString().slice(0,l+Number(dig));
                }else{
                    //s = Math.round(num*Math.pow(10,Number(dig)))/Math.pow(10,Number(dig));
                    var wz = num.toString().indexOf('.');
                    if(wz > 0){
                        s = num.toString().substr(0,wz);
                    }else{
                        s = num;
                    }
                }

            }
            return s;
        },
        unit:function(num,digit){
            var dig = digit || 0;
            if(num=='' || typeof num == core_strundefined){
                return '';
            }
            if(isNaN(num)){
                return num;
            }
            var arrNum = num.split('.');
            var arrln = arrNum[0].length;
            if(!digit){
                return num;
            }
            if(arrln>=6 && arrln<9){
                return (T.format(num/10000,dig)+'万');
            }else if(arrln>=9){
                return (T.format(num/100000000,dig)+'亿');
            }else{
                return (T.format(num,dig));
            }
        },
        zzpindex:function(str,index,ZZPINDEX){
            if(!ZZPINDEX){
                return str;
            }
            var arrIndex = ZZPINDEX.split(','),arrNum=[],arrSuo=[];
            for(var i=0;i<arrIndex.length;i++){
                arrNum[i]=arrIndex[i].split('|')[0];
                arrSuo[i]=arrIndex[i].split('|')[1];
            }
            if(index){
                var suoindex = arrNum.indexOf(index);
                if(suoindex>=0){
                    return T.unit(str,arrSuo[suoindex]);
                }else{
                    return str;
                }
            }
        },
        //时间日期转换
        dateform:function(str,index,DATEFORMINDEX){
            if(!DATEFORMINDEX || !index){
                return str;
            }
            var arrIndex = DATEFORMINDEX.split(','),arrNum=[],arrSuo=[];
            for(var i=0;i<arrIndex.length;i++){
                arrNum[i]=arrIndex[i].split('|')[0];
                arrSuo[i]=arrIndex[i].split('|')[1];
            }
            var suoindex = arrNum.indexOf(index);
            if(suoindex>=0){
                if(arrSuo[suoindex] && arrSuo[suoindex].indexOf('yyyy')=='0'){
                    var s = arrSuo[suoindex].replace(/yyyy/g,'$1').replace(/mm/g,'$2').replace(/dd/g,'$3');
                    return str.replace(/^(\d{4})(\d{2})(\d{2})$/i,s);
                }else if(arrSuo[suoindex] && arrSuo[suoindex].indexOf('hh')=='0'){
                    if(str.length==5 || str.length == 7){
                        str='0'+str;
                    }
                    var s = arrSuo[suoindex].replace(/hh/g,'$1').replace(/mm/g,'$2').replace(/ss/g,'$3');
                    return str.substr(0,6).replace(/^(\d{2})(\d{2})(\d{2})$/i,s);
                }else{
                    return str;
                }
            }else{
                return str;
            }
        },
        judge: function(name,data,reg){
            //1.个参数的时候就是返回正则，2个参数的时候返回真假
            var _reg = {
                "NAME": /^[\u4e00-\u9fa5]{2,8}$/i,
                "MONEY": /^([1-9][\d]{0,9}|0)(\.[\d]{1,2})?$/,
                "SPACE": /[\s\p{Zs}]{0,}/,
                "PHONE": /^1[0-9]{10}$/,
                "SIXNUM": /^\d{6}$/,
                "ISSUING": /^[\u4e00-\u9fa5]{4,}/,
                "PASSWORD": /^\w{6}$/,
                "QQ": /^[1-9][0-9]{4,12}$/,
                "EMAIL": /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                "BANKNUM": /^\d{16,19}$/,
                "TELNO": /^0\d{2,3}-?\d{7,8}-?(\d{1,6})?$/,
                "DATE": /^(?:(?:1[0-9]|[0-9]{2})[0-9]{2}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:(?:1[6-9]|[2-9][0-9])(?:0[48]|[2468][048]|[13579][26])|(?:16|[2468][048]|[3579][26])00)([-/.]?)0?2\2(?:29))$/,
                "HTMLTAG": /<[^>]*?>/g,
                "STOCKCODE":/(((002|000|300|900|200|399|400|420|430|899)[\d]{3})|60[\d]{4}|83[\d]{4})/g,
                "ISANDROID": (/android/i).test(app),
                "ISIOS": (/iphone|ipad/i).test(app),
                "ISPLAYBOOK": (/playbook/i).test(app),
                "ISTOUCHPAD": (/hp-tablet/i).test(app)
            };
            if(typeof reg != core_strundefined){
                TZT.extend(_reg,reg);
            }
            if(!(name in _reg)){
                alert('无相关正则');
                return;
            }
            if(typeof name != core_strundefined && typeof data != core_strundefined){
                return (_reg[name].test(data));
            }else{
                return _reg[name];
            }
        },
        islogin:function(){

        },
        //阻止事件冒泡函数
        stopBubble:function(e){
            if (e && e.stopPropagation)
                e.stopPropagation();
            else
                window.event.cancelBubble=true
        },
        readLocalMesg: function(sArray, fnSuccess){
            var sSendURL = "",
                oThis = this,
                isSlice=true;
            if(typeof sArray == 'string'){
                sSendURL = sArray;
            }else{
                for (var x = 0; x < sArray.length; x++) {
                    if(sArray[x].indexOf('=')>0){
                        sSendURL += sArray[x]+"&";
                        isSlice = false;
                    }else{
                        sSendURL += sArray[x] + "=" + "&";
                        isSlice = true;
                    }
                }
                sSendURL = sSendURL.slice(0, -1);
            }
            //console.log(sSendURL);
            $.ajax({
                url: "/reqlocal?" + sSendURL,
                success: function(oData) {
                    fnSuccess && fnSuccess(oData)
                }
            })
        },
        nReadLocalMesg: function (sArray, fnSuccess) {
            if(!this.hasNativeForAndroid()) {
                return this.readLocalMesg(sArray, fnSuccess)
            }
            var config = {
				newUrl: '/reqlocal?',
				fnSuccess: fnSuccess,
				tztWebdataEncrypt: 1
			};
            this.tztWebdataFormat(config, sArray);
        },
        readLocalMesgSync: function(sArray, fnSuccess){
            var sSendURL = "",
                oThis = this,
                isSlice=true;
            if(typeof sArray == 'string'){
                sSendURL = sArray;
            }else{
                for (var x = 0; x < sArray.length; x++) {
                    if(sArray[x].indexOf('=')>0){
                        sSendURL += sArray[x]+"&";
                        isSlice = false;
                    }else{
                        sSendURL += sArray[x] + "=" + "&";
                        isSlice = true;
                    }
                }
                sSendURL = sSendURL.slice(0, -1);
            }
            //console.log(sSendURL);
            $.ajax({
                url: "/reqlocal?" + sSendURL,
                async: false,
                success: function(oData) {
                    fnSuccess && fnSuccess(oData)
                }
            })
        },
        saveMapMesg: function(obj, fnSccess) {
            /*var sSendURL = "";
            for (var x in obj) {
                sSendURL += x + "=" + obj[x] + "&"
            }
            sSendURL = sSendURL.slice(0, -1);*/
            $.ajax({
                type: "POST",
                url: "/reqsavemap?",
                data: obj,
                contentType: "application/x-www-form-urlencoded;",
                success: function(oData) {
                    fnSccess && fnSccess(oData)
                }
            })
        },
        nSaveMapMesg: function (obj, fnSuccess) {
            if(!this.hasNativeForAndroid()) {
                return this.saveMapMesg(obj, fnSuccess)
            }
            var config = {
				newUrl: '/reqsavemap?',
				fnSuccess: fnSuccess,
				tztWebdataEncrypt: 1
			};
            this.tztWebdataFormat(config, obj);
        },
        saveMapMesgSync: function(obj, fnSccess) {
            /*var sSendURL = "";
            for (var x in obj) {
                sSendURL += x + "=" + obj[x] + "&"
            }
            sSendURL = sSendURL.slice(0, -1);*/
            $.ajax({
                type: "POST",
                url: "/reqsavemap?",
                async: false,
                data: obj,
                contentType: "application/x-www-form-urlencoded;",
                success: function(oData) {
                    fnSccess && fnSccess(oData)
                }
            })
        },
        readMapMesg: function(sArray, fnSuccess) {
            var sSendURL = "",
                oThis = this;
            if(typeof sArray != 'string'){
                for (var x = 0; x < sArray.length; x++) {
                    sSendURL += sArray[x] + "=" + "&"
                }
                sSendURL = sSendURL.slice(0, -1);
            }else{
                sSendURL = sArray;
            }
            $.ajax({
                url: "/reqreadmap?" + sSendURL,
                success: function(oData) {
                    fnSuccess && fnSuccess(oData)
                }
            })
        },
        nReadMapMesg: function (sArray, fnSuccess) {
            if(!this.hasNativeForAndroid()) {
                return this.readMapMesg(sArray, fnSuccess)
            }
            var config = {
				newUrl: '/reqreadmap?',
				fnSuccess: fnSuccess,
				tztWebdataEncrypt: 1
			};
            this.tztWebdataFormat(config, sArray);
        },
        readMapMesgSync: function(sArray, fnSuccess) {
            var sSendURL = "",
                oThis = this;
            if(typeof sArray != 'string'){
                for (var x = 0; x < sArray.length; x++) {
                    sSendURL += sArray[x] + "=" + "&"
                }
                sSendURL = sSendURL.slice(0, -1);
            }else{
                sSendURL = sArray;
            }
            $.ajax({
                async: false,
                url: "/reqreadmap?" + sSendURL,
                success: function(oData) {
                    fnSuccess && fnSuccess(oData)
                }
            })
        },
        saveFileMesg: function(saveMesg, fileName, fnSuccess) {
            var SAVEDATA = '';
            if(typeof saveMesg == 'string'){
                SAVEDATA = saveMesg;
            }else{
                SAVEDATA = JSON.stringify(saveMesg);
            }
            var sSendURL = "/reqsavefile?filename=" + fileName;
            $.ajax({
                url: sSendURL,
                type: "POST",
                data: encodeURI(SAVEDATA),
                success: function(oData) {
                    fnSuccess && fnSuccess(oData)
                }
            })
        },
        nSaveFileMesg: function (saveMesg, fileName, fnSuccess) {
            if(!this.hasNativeForAndroid()) {
                return this.saveFileMesg(saveMesg, fileName, fnSuccess)
            }
            var SAVEDATA = '';
            if(typeof saveMesg == 'string') {
                SAVEDATA = saveMesg;
            } else {
                SAVEDATA = JSON.stringify(saveMesg);
            }
            var config = {
				newUrl: "/reqsavefile?",
				fnSuccess: fnSuccess,
				tztWebdataEncrypt: 1
			};
            this.tztWebdataFormat(config, {filename: fileName, content: encodeURI(SAVEDATA)});
        },
        saveFileMesgSync: function(saveMesg, fileName, fnSuccess) {
            var SAVEDATA = '';
            if(typeof saveMesg == 'string'){
                SAVEDATA = saveMesg;
            }else{
                SAVEDATA = JSON.stringify(saveMesg);
            }
            var sSendURL = "/reqsavefile?filename=" + fileName;
            $.ajax({
                url: sSendURL,
                type: "POST",
                async: false,
                data: encodeURI(SAVEDATA),
                success: function(oData) {
                    fnSuccess && fnSuccess(oData)
                }
            })
        },
        readFileMesg: function(fileName, fnSuccess) {
            var sSendURL = "/reqreadfile?filename=" + fileName;
            $.ajax({
                url: sSendURL,
                success: function(oData) {
                    fnSuccess && fnSuccess(oData);
                }
            });
        },
        nReadFileMesg: function (fileName, fnSuccess) {
            if(!this.hasNativeForAndroid()) {
                return this.readFileMesg(fileName, fnSuccess)
            }
            var config = {
				newUrl: "/reqreadfile?",
				fnSuccess: fnSuccess,
				tztWebdataEncrypt: 1
			};
            this.tztWebdataFormat(config, {filename: fileName});
        },
        readFileMesgSync: function(fileName, fnSuccess) {
            var sSendURL = "/reqreadfile?filename=" + fileName;
            $.ajax({
                url: sSendURL,
                async: false,
                success: function(oData) {
                    fnSuccess && fnSuccess(oData);
                }
            });
        },
        getUserInfoSync:function(){
            var oData;
            T.readLocalMesgSync(['jyloginflag','logintype=1','usercode', 'softversion','tzttradeaccount','tzttradeaccounttype','tztjyloginaccountlist','username','ishkaccount','ishkszaccount','fundaccount', 'khbranch','USERCODE', 'idtype', 'idno', 'MobileCode','ORGANPROPFLAG','tzttraderights'/*, "message_flag" */], function(oMap) {
                oData = oMap;
                oData.PermissionL = (oMap.TZTTRADERIGHTS != '' && oMap.TZTTRADERIGHTS.indexOf('l') >= 0);
            });
            return oData;
        },
        loadFileMesg: function(str, fnSuccess) {
            var sSendURL = "/reqloadfile?";
            if(typeof str == 'string'){
                sSendURL = sSendURL + str;
            }else{
                for(var t in str){
                    sSendURL+=t+'='+str[t]+'&'
                }
                sSendURL = sSendURL.slice(0, -1);
            }
            $.ajax({
                url: sSendURL,
                success: function(oData) {
                    fnSuccess && fnSuccess(oData);
                }
            });
        },
        reqsofttodo: function(obj, fnSuccess) {
            var sSendURL = "/reqsofttodo?";
            if(obj == ''){
                return;
            }
            if(typeof obj == 'string'){
                sSendURL = sSendURL + obj;
            }else{
                for (var x in obj) {
                    sSendURL += x + "=" + obj[x] + "&"
                }
                sSendURL = sSendURL.slice(0, -1);
            }
            $.ajax({
                url: sSendURL,
                success: function(oData) {
                    fnSuccess && fnSuccess(oData);
                }
            });
        },
        nReqsofttodo: function (obj, fnSuccess) {
            if(!this.hasNativeForAndroid()) {
                return this.reqsofttodo(obj, fnSuccess)
            }
            var config = {
				newUrl: "/reqsofttodo?",
				fnSuccess: fnSuccess,
				tztWebdataEncrypt: 1
			};
            this.tztWebdataFormat(config, obj);
        },
        loadHtml:function(url, func){//加载网页
            var v = '';
            if(typeof config != 'undefined'){
                v = config.version;
            }else{
                v = '0.0.1';
            }
            $.ajax({
                url: url + "?v=" + v,
                type: "get",
                dataType: "html",
                beforeSend: function() {
                },
                success: function(data) {
                    data ? func && func(data) : alert("请求html页面异常或者页面不存在！：" + url)
                },
                complete: function() {

                },
                error: function() {
                    alert("请求html页面异常！：" +  url)
                }
            })
        },
        getAccountList:function(fn,obj){
            var newArray = ['AccountList'];
            if(obj){
                for(var x in obj){
                    if(obj[x] && obj[x] != ''){
                        newArray.push(x+'='+obj[x]);
                    }else{
                        newArray.push(x);
                    }
                }
            }
            T.readLocalMesg(newArray,function(oData){
                var acclist = oData.ACCOUNTLIST.replace(/\r\n/g,'&').split('&');
                var account={};
                if(acclist){
                    for(var i=0;i<acclist.length;i++){
                        var list = acclist[i].split('|');
                        if(list[0] && list[0]!= '' && list[2] && list[2] != ''){
                            if(!(list[0] in account)){
                                account[list[0]] = list[2];
                            }
                        }
                    }
                }
                fn && fn(account);
            });
        },
        isIos:function (){ //判断是否是iOS系统
            var u = navigator.userAgent;
             return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)?true:false
        },
        isIosIpad:function(){ //判断iOS系统是否是ipad
            var ua = navigator.userAgent
               return ua.match(/iPad/i)=="iPad"?true:false
        },
        compareVersions: function (version1, version2) {
            var arr1 = version1.split('.');
            var arr2 = version2.split('.');
            for (var i = 0; i < Math.max(arr1.length, arr2.length); i++) {
              var num1 = parseInt(arr1[i] || 0);
              var num2 = parseInt(arr2[i] || 0);
              if (num1 < num2) {
                return -1; // 版本1小于版本2
              } else if (num1 > num2) {
                return 1; // 版本1大于版本2
              }
            }
            return 0; // 版本1等于版本2
          },
        iosVersion: function(checkVersion) { // 获取/判断 IOS系统版本号
            var ua = navigator.userAgent.toLowerCase();
            var _version = null;
            if (ua.indexOf("like mac os x") > 0) {
                var reg = /os [\d._]+/gi;
                var v_info = ua.match(reg);
                _version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号9.3.2或者9.0
                _version1 = parseInt(_version.split('.')[0]); // 得到版本号第一位
            };
            return checkVersion ? this.compareVersions(_version, checkVersion) : _version;
        },
        isAndroid:function(){//判断是否是Andriod手机
            var u = navigator.userAgent;
             return u.indexOf('Android') > -1 ? true:false
        },
        isAndroidIpad:function(){//判断Andriod系统是否是ipad
            var u = navigator.userAgent;
             return u.indexOf('Android') > -1 ? true:false
        },
        getIpadVersions:function(){//获取ipad版本号
            var ver =  navigator.userAgent.toLowerCase().match( / cpu os (.*?) like mac os /);
            return ver
        },
        getGGQQAccountList:function(fn){//20160115
            var newArray = ['tztGGQQ_WTAccountList','tokentype=8'];
            T.readLocalMesg(newArray,function(oData){
                var acclist = oData.TZTGGQQ_WTACCOUNTLIST.replace(/\r\n/g,'&').split('&');
                var account={};
                if(acclist){
                    for(var i=0;i<acclist.length;i++){
                        var list = acclist[i].split('|');
                        if(list[0] && list[0]!= '' && list[1] && list[1] != ''){
                            if(!(list[0] in account)){
                                account[list[0]] = list[1];
                            }
                        }
                    }
                }
                fn && fn(account);
            });
        },
        filterCdata: function() {
            str.replace(new RegExp(/\>\<\!\[CDATA\[/g), "").replace(/\]\]/g, '"')
        },
        isundefind:function(a,b){
            return "undefined" == typeof a || "" === a ? b : a
        },
        trim:function(str) {
            var re = /(^\s*)|(^\r\n*)|(\r\n*$)|(\s*$)/g;
            return str.replace(re, '');
        },
        ajaxError: function(XMLHttpRequest, textStatus, errorThrown,fnErr) {
           // var errorno = XMLHttpRequest.readyState;
            var errorno ='';
            var oMessage = {
                "timeout": errorno+"请求超时",
                "error": errorno+"请求超时",
                "notmodified": errorno+"请求超时",
                "parsererror": errorno+"数据格式出错"
            };
            if(fnErr){
                fnErr();
                return;
            }
            if(!textStatus && errorThrown){
                alert(errorThrown);
            }
            var remove_alert = function(){
                if(document.querySelector('.mui-popup')) return
            var pathName = window.location.pathname;
	    	if(pathName == '/vue/ui4.0/shouye/html/shouYe.html'|| pathName=='/vue/ui5/shou-ye/shou-ye/html/shou-ye.html' || pathName =='/vue/ui5/shou-ye/zu-ji/html/zu-ji.html' || pathName == '/investment/finance/html/index.html' || pathName == '/vue/ui4.0/jiaoyishouye/html/jiaoYiShouYe.html' || pathName == '/vue/ui5/jiao-yi/jiao-yi-shou-ye/html/jiao-yi-shou-ye.html' || pathName == '/investment/liCai5.0/new_finance/html/new_finance.html'){
                    console.error(oMessage.timeout)
                    return;
                };
                alert(oMessage.timeout);
            }
            if(textStatus){
                switch (textStatus) {
                    case "timeout":
                        remove_alert()
                        break;
                    case "parsererror":
                        alert(oMessage.parsererror);
                        break;
                    default:
                        break
                }
            }
        },
        isAdr:function(){
            var u = navigator.userAgent;
            return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        },
        getUrlParameter:function(parameterName,str){
            //获取url参数值
            var reg = new RegExp("(^|&|\\?)" + parameterName + "=([^&]*)(&|$)", "i"),arr,arr1;
            if(str){
                arr = str.match(reg);
                arr1 = str.match(reg);
            }else{
                arr = location.search.substr(1).match(reg);
                arr1 = location.hash.substr(2).match(reg);
            }

            if (arr) {
                return arr[2];
            }else if(arr1){
                return arr1[2];
            } else return null;
        },
        slippage:function(element,options){
            return new MyDropLoad(element, options);
        },
        styleTime:function(){
            return new chooseTime();
        },
        loadJs:function(a, b){//id,路径
            var c = document.getElementById(a),
                d = document.getElementsByTagName("head").item(0),
                e = document.createElement("script");
            c && d.removeChild(c), e.id = a, e.type = "text/javascript", e.src = b, d.appendChild(e)
        },
        loadCss:function (a, b) {
            var G = null;
            var c = [];
            a instanceof Array ? c = c.concat(a) : a && c.push(a);
            var link = $('link'),dfg = document.getElementsByTagName("head").item(0);
            for(var i=0;i<link.length;i++){
                if(c.indexOf($(link[i]).attr('href'))>=0){
                    $(link[i]).remove();
                }
            }
            for (var d = 0, e = c.length; e > d; d++) {
                var f = document.createElement("link");
                f.charset = "utf-8", f.rel = "stylesheet", f.href = c[d], document.querySelector("head").appendChild(f)
                T.objunit[c[d]] = '';
            }
            //G && (clearTimeout(G), G = null), G = setTimeout(b, 100)
        },
        clearCss:function(){
            var link = $('link');
            for(var i=0;i<link.length;i++){
                var listLink = $(link[i]).attr('href');
                if(listLink in T.objunit){
                    link.eq(i).remove();
                }
            }
            T.objunit={};
        },
        addCSS:function(cssText){
            /*
            * 使用方法：addCSS('#demo{ height: 30px; background:#f00;}');
            * */
            var style = document.createElement('style'),  //创建一个style元素
                head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
            style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
            if(style.styleSheet){ //IE
                var func = function(){
                    try{ //防止IE中stylesheet数量超过限制而发生错误
                        style.styleSheet.cssText = cssText;
                    }catch(e){

                    }
                };
                //如果当前styleSheet还不能用，则放到异步中则行
                if(style.styleSheet.disabled){
                    setTimeout(func,10);
                }else{
                    func();
                }
            }else{ //w3c
                //w3c浏览器中只要创建文本节点插入到style元素中就行了
                var textNode = document.createTextNode(cssText);
                style.appendChild(textNode);
            }
            head.appendChild(style); //把创建的style元素插入到head中
        },
        tipln:0,
        loadTips:function(obj){
            /*
            * @url图片路径
            * @img生成base64之后的数据
            * @istip是否需要提示true打开false关闭
            * */
            var config = {
                url:'',
                istip:false,
                img:'data:image/gif;base64,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'
            };

            T.extend(config,obj);
            var _ques_ldtipId = "_loadingTip", _ques_ldLocktipId = "_loadingCLock";
            var _loadingTip = document.getElementById(_ques_ldtipId);
            var _loadingCLock = document.getElementById(_ques_ldLocktipId);

            if(config.istip){
                showLoadingTip();
            }else{
                closeLoadingTip();
            }

            function showLoadingTip() {
                // $('head').append('<link href="/c_modules/css/loading.css" rel="stylesheet" media="all" />');
                T.tipln++;
                if (!_loadingCLock) {
                    _loadingCLock = document.createElement("div");
                    _loadingCLock.id = _ques_ldLocktipId;
                    _loadingCLock.setAttribute("style", "z-index:10;width:100%;height:100%;position:absolute;top:0;left:0;display:none;background-color:#2a2a2a;opacity:0;background-size:100% 100%;color:#fff;font-size:15px;-webkit-transform: translateZ(0);");
                    document.body.appendChild(_loadingCLock);
                }
                if (!_loadingTip) {
                    _loadingTip = document.createElement("div");
                    _loadingTip.id = _ques_ldtipId;
                    _loadingTip.setAttribute("style", 'z-index:100;width:215px;height:54px;line-height:64px;position:absolute;top:40%;left:50%;margin-left:-107px;display:none;text-align:center;');
                   _loadingTip.innerHTML += "<img style='width:20px;height:20px;' src='"+config.img+"' /></div>";
                    document.body.appendChild(_loadingTip);
                    _loadingTip.addEventListener("click", function (e) {
                        closeLoadingTip();
                    });
                }
                document.getElementById(_ques_ldLocktipId).style.display = "block";
                document.getElementById(_ques_ldtipId).style.display = "block";
            }

            //关闭加载提示的方法
            function closeLoadingTip() {
                T.tipln--;
                if(T.tipln<=0 && _loadingTip){
                    document.getElementById(_ques_ldLocktipId).style.display = "none";
                    document.getElementById(_ques_ldtipId).style.display = "none";
                }

            }
        },
        convertImgToBase64:function(url, callback, outputFormat){
            //图片转成base格式
            /*目前只支持png和jpg
            * @url图片地址
            * @callback回调函数
            * @outputFormat输出格式
            * */
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img,0,0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                callback.call(this, dataURL);
                // Clean up
                canvas = null;
            };
            img.src = url;
        },
        attrUrl:function(oDom){
            var jDom = oDom;
            $.each(jDom,function(index,obj){
                $(obj).unbind().on('click',function(){
                    if($(obj).attr('data-url')!='' && typeof $(obj).attr('data-url')!='undefined'){
                        var url = $(obj).attr('data-url');
                        T.fn.changeurl(url);
                    }else if($(obj).attr('data-acId')!='' && typeof $(obj).attr('data-acId')!='undefined'){
                        var acId = $(obj).attr('data-acId').split('|');
                        //var type = $(obj).attr('data-type') || '1';
                        var traObj = {
                            action:acId[0]
                        };
                        var isaction = true;
                        if(acId.length>1){
                            traObj.url = encodeURIComponent(acId[1]);
                            if(acId[2]){
                                traObj.datetype = acId[2];
                            }
                            if(acId[3]){
                                traObj.title = encodeURIComponent(acId[3]);
                            }
                            if(acId[4]){
                                traObj.stockcode = acId[4];
                            }
                            isaction = false;
                        }
                        //CITICSPiwik Start页面统计添加
                        //var u="//piwik.citicsinfo.com/piwik/";
						//var piwikTracker = Piwik.getTracker(u+'piwik.php', 1);
						//piwikTracker.trackEvent('交易', '交易_买入', '', 1);
                        if(traObj.action == "12310") {
                        	trackEvent("jy_pt_mr");
//                  		_paq.push(['trackEvent', '交易', '交易_买入']);
                    	} else if(traObj.action == "12311") {
                    		trackEvent("jy_pt_mc");
//                  		_paq.push(['trackEvent', '交易', '交易_卖出']);
                    	} else if(traObj.action == "12340") {
                    		trackEvent("jy_pt_cd");
//                  		_paq.push(['trackEvent', '交易', '交易_撤单']);
                    	} else if(traObj.action == "12342") {
                    		trackEvent("jy_pt_cc");
                    	} else if(traObj.action == "12303") {
                    		trackEvent("jy_pt_gd");
                    	} 
                    	//CITICSPiwik End
                        T.fn.tradeaction(traObj);
                    }else if($(obj).attr('data-href9')!='' && typeof $(obj).attr('data-href9')!='undefined'){
                    	//CITICSPiwik Start页面统计添加
                        if($(obj).attr('data-href9') == "/newjy/ptjy/qcxzj.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_查询资金']);
                    	} else if($(obj).attr('data-href9') == "/newjy/cnjj/cnjj_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_网络投票']);
							trackEvent("jy_pt_szlof");
                    	}  else if($(obj).attr('data-href9') == "/newjy/qchicang.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_我的持仓']);
							trackEvent("jy_pt_cc");
                    	} else if($(obj).attr('data-href9') == "/newjy/ptjy/qdrwt.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_当日委托']);
                    	} else if($(obj).attr('data-href9') == "/newjy/ptjy/qdrcj.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_当日成交']);
							trackEvent("jy_pt_cj");
                    	} else if($(obj).attr('data-href9') == "/finance/views/loading.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_现金增值']);
							trackEvent("jy_pt_xjzz");
                    	} else if($(obj).attr('data-href9') == "/newjy/kfjj/funindex.htm") {
//                  		_paq.push(['trackEvent', '交易', '交易_开放式基金']);
							trackEvent("jy_pt_kfsjj");
                    	} else if($(obj).attr('data-href9') == "/newjy/xgsg/xgsg_indexnew.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_新股申购']);
                    	} else if($(obj).attr('data-href9') == "/newjy/dcgyh/dcg_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_银证转账']);
							trackEvent("jy_pt_yzzz");
                    	} else if($(obj).attr('data-href9') == "/newjy/ttlc/ttlc_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_天天利财']);
							trackEvent("jy_pt_ttlc");
                    	} else if($(obj).attr('data-href9') == "/newjy/sshbjj/index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_实时货币基金']);
							trackEvent("jy_pt_sshbjj");
                    	} else if($(obj).attr('data-href9') == "/newjy/cnjj/cnjj_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_场内基金']);
                    	} else if($(obj).attr('data-href9') == "/newjy/jjphyw/jjphyw_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_基金盘后业务']);
							trackEvent("jy_pt_jjphyw");
                    	} else if($(obj).attr('data-href9') == "/newjy/ggt/jysy.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_沪港通交易']);
							trackEvent("jy_pt_ggt");
                    	} else if($(obj).attr('data-href9') == "/newjy/gz/gz_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_股转业务']);
							trackEvent("jy_pt_gzyw");
                    	} else if($(obj).attr('data-href9') == "/newjy/xed/index_new.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_新易融']);
							trackEvent("jy_pt_xyr");
                    	} else if($(obj).attr('data-href9') == "/newjy/xed/index_new.html?funderno=2") {
//                  		_paq.push(['trackEvent', '交易', '交易_快e融']);
							trackEvent("jy_pt_ker");
                    	} else if($(obj).attr('data-href9') == "/newjy/wltp/wltp_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_网络投票']);
							trackEvent("jy_pt_wltp");
                    	} else if($(obj).attr('data-href9') == "/newjy/lof/lof_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_网络投票']);
							trackEvent("jy_pt_shlof");
                    	} else if($(obj).attr('data-href9') == "/newjy/otc_new/otc_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_网络投票']);
							trackEvent("jy_pt_qtcp");
                        } else if ($(obj).attr('data-href9') == "/vue/jiaoYi/xianShouGuChaXun/html/xianShouGuChaXun.html") {
//                          _paq.push(['trackEvent', '交易', '交易_限售股查询']);
                            trackEvent("jy_gd_xsgcx");
                        }


                    	//CITICSPiwik End
                        T.fn.action10090({url:T.fn.action10061({url:$(obj).attr('data-href9'),isExport:true})})
                    }else if($(obj).attr('data-href')!='' && typeof $(obj).attr('data-href')!='undefined'){
                    	//CITICSPiwik Start页面统计添加
						if($(obj).attr('data-href') == "/newjy/jy_qindex.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_更多']);
							trackEvent("jy_pt_gd");
                    	} else if($(obj).attr('data-href') == "/newjy/otc/otc_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_OTC交易']);
							trackEvent("jy_pt_qtcp");
                    	}
                    	//CITICSPiwik End
                        T.fn.action10061({url:$(obj).attr('data-href')})
                    }else if($(obj).attr('data-rzrqurl9')!='' && typeof $(obj).attr('data-rzrqurl9')!='undefined'){
                    	//CITICSPiwik Start页面统计添加
                    	if($(obj).attr('data-rzrqurl9') == "/newjy/rzrq/rzrq_index.html") {
//                  		_paq.push(['trackEvent', '交易', '交易_融资融券']);
                    	}
                    	//CITICSPiwik End
                        T.fn.action10090({url:T.fn.action10061({url:$(obj).attr('data-rzrqurl9'),isExport:true}),logintype:2})
                    }
                })
            })
        },
        log:function(message,type){//error(message)：将错误消息记录到控制台、info(message)：将信息消息记录到控制台、log(message)：将一般消息记录到控制台、warn(message)：将警告消息记录到控制台
            if(typeof console == "object"){
                if(type){
                    console[type](message);
                }else{
                    console.log(message);
                }

            }else if(typeof opera == "object"){
                opera.postError(message);
            }else if(typeof java == "object" && typeof java.lang == "object"){
                java.lang.System.out.println(message);
            }
        },
        refresh:function(obj){
            /*
            * @style 定制样式
            * @bg 只定制图片
            * @fn 回调函数
            * */
           // 如果是持仓页面，刷新dom元素为qchipage
            var config = {
                dom:obj.pageType?'qchipage':'j_chicanglist', 
                time:'300',
                bg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAnCAYAAABwtnr/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0ExNTRFRDQwMDVDMTFFNUFCQzdFOEM1RjMxMENGMzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0ExNTRFRDUwMDVDMTFFNUFCQzdFOEM1RjMxMENGMzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQTE1NEVEMjAwNUMxMUU1QUJDN0U4QzVGMzEwQ0YzNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQTE1NEVEMzAwNUMxMUU1QUJDN0U4QzVGMzEwQ0YzNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po2SrKAAAAZYSURBVHjavFltTFNn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'
            };
            T.extend(config,obj);
            var aResh = [];
            aResh[0] = 'height: 36px;width: 36px;';
            aResh[1] = 'background:#4f4f4f url('+config.bg+') center center no-repeat;';
            aResh[2] = 'background-size: 23px 20px;';
            aResh[3] = 'position: fixed;right: 16px;';
            aResh[4] = 'bottom: 21px;';
            aResh[5] = 'opacity: 0.3;border-radius: 5px';
            var res = aResh.join('');
            if(typeof config['style'] != core_strundefined){
                res = config['style'];
            }
            resh = '<div class="newlist j_refresh" style="' + res + '"></div>';
            if($('.j_refresh').length>0){
                $('.j_refresh').remove();
            }
            $("body").append(resh);
            $(".j_refresh").on('click', function () {
                $("."+config.dom).animate({ scrollTop: "0" }, config.time, function () {
                    /*listNamber = 0;
                    loadtype = pagecount;
                    loadData();*/
                    config.fn && config.fn();
                });
            });
        },
        timer: null,
        langTip: function(type){
            T.timer && clearTimeout(T.timer);
            if(typeof type == 'boolean'&&type == false){
                T.tipln = 0;
                T.loadTips({istip: false});
            }else{
                T.timer = setTimeout(function () {
                    T.tipln = 0;
                    T.loadTips({istip: false});
                }, 500);
            }
            
            // if (islang) {
            //     T.timer && clearTimeout(TZT.timer);
            //     T.timer = setTimeout(function () {
            //         T.loadTips({istip: false});
            //     }, 500);
            // }else {
            //     T.loadTips({istip: false});
            // }
        },
        getKongPathByNative:function(){
            var kongDataResult;
            var kongDataResultDefault='https://kong.citics.com';
            if(window.____kongUrl == 'undefined'|| window.____kongUrl == undefined || window.____kongUrl == ''||window.____kongUrl == null){
                var kongData = window.CiticsNative.NativeCall('getKongURLFromNative');
                if(kongData != 'undefined' && kongData != undefined && kongData != '' && kongData != null){
                    var result = JSON.parse(kongData).result;
                    if(T.isAndroid()){
                    kongDataResult = result?result:kongDataResultDefault;
                    }else if(T.isIos()){
                        if(JSON.parse(kongData).errorNo == '0'){
                            if(result.indexOf('http')>-1){
                                kongDataResult = result
                            }else{
                                kongDataResult=kongDataResultDefault
                            }
                        }else {
                            kongDataResult = kongDataResultDefault
                        }
                    }else{
                        // 其他系统均以安卓格式为准 (如：鸿蒙系统)
                        kongDataResult = result?result:kongDataResultDefault;
                    }
                    console.log('kongDataResult',kongDataResult)
                    if(kongDataResult != 'undefined' && kongDataResult != undefined && kongDataResult != '' && kongDataResult != null){
                        window.____kongUrl = kongDataResult;
                    }else{
                        window.____kongUrl = kongDataResultDefault;
                    }	
                }else{
                    window.____kongUrl = kongDataResultDefault;
                }
            }
            return window.____kongUrl;
        },
        cGetDataNew:function(arg){
            var kongUrl = T.getKongPathByNative();
            function isFn(obj) {
                return obj instanceof Function;
            };
            function gotoLoginPage(){
                T.readLocalMesg(['mobilecode'], function(data) {
                var telStr = ''
                if(data.MOBILECODE != '' || data.MOBILECODE != undefined){
                    telStr = '?mobile='+ data.MOBILECODE;
                }					
                var newLocation = kongUrl + '/citics/download/H5/user/html/login.html' + telStr;
                window.cNative.closeAndOpenPage(newLocation);
                return;
                })
            };
                if(arg.portName){
                  // console.log('请求' + path.master + arg.portName);
                }else{
                  console.log('请求地址错误')
                  return
                };
                var _portName = arg.portName,
                  _path = kongUrl + _portName,
                  _type = arg.type || 'GET', //必须缺省用GET协议，否则对于/api/v1/advert/financeIndex/middle等接口，会返回412错误
                  _data = arg.data || '',
                  _requireAuth = typeof arg.requireAuth == 'boolean' ? arg.requireAuth : false,
                  _requireLoading = typeof arg.requireLoading == 'boolean' ? arg.requireLoading : true,
                  _done = arg.done || '',
                  _fail = arg.fail || '',
                  _err = arg.err || '',
                  _dataType = arg.dataType || 'JSON',
                  _timeout = arg.timeout || 30000,
                  _isErrAlert = typeof arg.isErrAlert == 'boolean' ? arg.isErrAlert : true;
                  console.log('_path_path_path_path',_path)
                if(_requireAuth){
                    console.log('调取原生存储获取互联网账户token')
                    var curToken = window.cNative.getToken();
                    if (null == curToken || "" == curToken){
                      //需要跳转到互联网账户登录界面
                      //window.location.href = "http://action:10061/?type=1&&fullscreen=1&&firsttype=10&&firsttext=tzt_navbarbackbg&&url=/H5/user/html/login.html&&secondtype=9";
                      gotoLoginPage();
                      return;
                    }      
                    _data.token = curToken;
                };
                
                if (!(typeof arg.sysNo == 'string')){
                  _data.sysNo='CS118';
                }
                
              if(_requireLoading){
                  T.loadTips({istip:true});
              };
              //var _random = new Date().getTime();
              //_data.random = _random;
                $.ajax({
                    url: _path,
                    type: _type,
                    dataType: _dataType,
                    timeout: _timeout,
                    data: _data,
                    cache: false //必须这样，否则对于/api/v1/advert/financeIndex/middle等接口，会返回412错误
                  })
                  .done(function(data) {
                    console.log('请求成功');
                    var errorCode = 0;
                    var errorMsg = '';
            
                    if (typeof(data.errorCode) != "undefined") {
                      errorCode = data.errorCode;
                      errorMsg = data.errorMsg;
                    } else if (typeof(data.code) != "undefined") {
                      errorCode = data.code;
                      errorMsg = data.msg;
                    } else if (typeof(data.retCode) != "undefined") {
                      errorCode = data.retCode;
                      errorMsg = data.retMessage;
                    }
            
                    if (errorCode == 0) {
                      if (isFn(arg.done)) {
                        arg.done(data);
                      }
                      return;
                    }
                    if (isFn(arg.err)) {
                      arg.done(data);
                    } else {
                      alert(errorMsg);
                    }
                  })
            
                .fail(function(jqXHR, textStatus) {
                console.log('请求失败:' + _path);
                        if(isFn(arg.fail)){
                      arg.fail();
                  }else{
                    if(_isErrAlert){
                      alert('网络连接失败,请检查您的网络');
                    }
                  }
                })
                .always(function() {
                  T.loadTips({istip:false});
                });
        },
        // 根据KONG地址获取当前环境
        getEnvByNativePath:function(){
            var kongUrl = T.getKongPathByNative();
            if(kongUrl.match('kong.citics.com')){
                return 'pro';
            }else{
                return 'dev'
            };
        }
    });
    var MyDropLoad = function(element, options){
        var me = this;
        me.$element = $(element);
        me.insertDOM = false;
        me.loading = false;
        me.isLock = false;
        me.init(options);
        me.$element.parent().css({'position':'absolute','left':'0','top':'0','width':'100%','height':'100%','display':'-webkit-box','display':'-webkit-flex','display':'-ms-flexbox','display':'flex','-ms-flex-direction':'column','-webkit-box-orient':'vertical','box-orient':'vertical','-webkit-flex-direction':'column','flex-direction':'column'});
        TZT.addCSS('.dropload-down,.dropload-up{position:relative;height:0;overflow:hidden;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);color:#fff;}.dropload-load,.dropload-refresh,.dropload-update{position:absolute;left:50%;bottom:0;width:100%;height:50px;line-height:50px;text-align:center;-webkit-transform:translate(-50%,0);transform:translate(-50%,0)}.dropload-load .loading{display:inline-block;height:15px;width:15px;border-radius:100%;margin:6px;border:2px solid #666;border-bottom-color:transparent;vertical-align:middle;-webkit-animation:rotate .75s 0 linear infinite;animation:rotate .75s 0 linear infinite}@-webkit-keyframes rotate{0%{-webkit-transform:rotate(0)}50%{-webkit-transform:rotate(180deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes rotate{0%{transform:rotate(0)}50%{transform:rotate(180deg)}100%{transform:rotate(360deg)}}');
    };

    // 初始化
    MyDropLoad.prototype.init = function(options){
        var me = this;
        me.opts = $.extend({}, {
            domUp : {                                                            // 上方DOM
                domClass   : 'dropload-up',
                domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
                domUpdate  : '<div class="dropload-update">↑释放更新</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
            },
            domDown : {                                                          // 下方DOM
                domClass   : 'dropload-down',
                domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
                domUpdate  : '<div class="dropload-update">↓释放加载</div>',
                domLoad    : '<div class="dropload-load">○加载中...</div>'
            },
            distance : 50,                                                       // 拉动距离
            loadUpFn : '',                                                       // 上方function
            loadDownFn : ''                                                      // 下方function
        }, options);

        // 绑定触摸
        me.$element.on('touchstart',function(e){
            if(!me.loading && !me.isLock){
                me.fnTouches(e);
                me.fnTouchstart(e, me);
            }
        });
        me.$element.on('touchmove',function(e){
            if(!me.loading && !me.isLock){
                me.fnTouches(e, me);
                me.fnTouchmove(e, me);
            }
        });
        me.$element.on('touchend',function(){
            if(!me.loading && !me.isLock){
                me.fnTouchend(me);
            }
        });
    };

    // touches
    MyDropLoad.prototype.fnTouches = function(e){
        if(!e.touches){
            e.touches = e.originalEvent.touches;
        }
    };

    // touchstart
    MyDropLoad.prototype.fnTouchstart = function(e, me){
        me._startY = e.touches[0].pageY;
        me._loadHeight = me.$element.height();
        //console.log(me._loadHeight);
        me._childrenHeight = me.$element.children().height();
        me._scrollTop = me.$element.scrollTop();
        me._Top = me.$element.parent().parent().position().top;
    };

    // touchmove
    MyDropLoad.prototype.fnTouchmove = function(e, me){
        me._curY = e.touches[0].pageY;
        me._moveY = me._curY - me._startY;

        if(me._moveY > 0){
            me.direction = 'down';
        }else if(me._moveY < 0){
            me.direction = 'up';
        }

        var _absMoveY = Math.abs(me._moveY);

        // 加载上方
        if(me.opts.loadUpFn != '' && me._scrollTop <= 0 && me.direction == 'down'){
            e.preventDefault();
            if(!me.insertDOM){
                me.$element.prepend('<div class="'+me.opts.domUp.domClass+'"></div>');
                me.insertDOM = true;
            }

            me.$domUp = $('.'+me.opts.domUp.domClass);
            me.fnTransition(me.$domUp,0);

            // 下拉
            if(_absMoveY <= me.opts.distance){
                me._offsetY = _absMoveY;
                me.$domUp.html('').append(me.opts.domUp.domRefresh);
                // 指定距离 < 下拉距离 < 指定距离*2
            }else if(_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2){
                me._offsetY = me.opts.distance+(_absMoveY-me.opts.distance)*0.5;
                me.$domUp.html('').append(me.opts.domUp.domUpdate);
                // 下拉距离 > 指定距离*2
            }else{
                me._offsetY = me.opts.distance+me.opts.distance*0.5+(_absMoveY-me.opts.distance*2)*0.2;
            }
            //console.log(me._curY);
            me.$domUp.css({'height': me._offsetY});
            if(me._curY>=me._loadHeight){
                if(!me.loading && !me.isLock){
                    me.fnTouchend(me);
                }
            }
        }

        // 加载下方
        if(me.opts.loadDownFn != '' && me._childrenHeight <= (me._loadHeight+me._scrollTop) && me.direction == 'up'){
            e.preventDefault();
            if(!me.insertDOM){
                me.$element.append('<div class="'+me.opts.domDown.domClass+'"></div>');
                me.insertDOM = true;
            }

            me.$domDown = $('.'+me.opts.domDown.domClass);
            me.fnTransition(me.$domDown,0);

            // 上拉
            if(_absMoveY <= me.opts.distance){
                me._offsetY = _absMoveY;
                me.$domDown.html('').append(me.opts.domDown.domRefresh);
                // 指定距离 < 上拉距离 < 指定距离*2
            }else if(_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2){
                me._offsetY = me.opts.distance+(_absMoveY-me.opts.distance)*0.5;
                me.$domDown.html('').append(me.opts.domDown.domUpdate);
                // 上拉距离 > 指定距离*2
            }else{
                me._offsetY = me.opts.distance+me.opts.distance*0.5+(_absMoveY-me.opts.distance*2)*0.2;
            }

            me.$domDown.css({'height': me._offsetY});
            me.$element.scrollTop(me._offsetY+me._scrollTop);
            //console.log(me._curY);
            if(me._curY<=me._Top){
                if(!me.loading && !me.isLock){
                    me.fnTouchend(me);
                }
            }
        }
    };

    // touchend
    MyDropLoad.prototype.fnTouchend = function(me){
        var _absMoveY = Math.abs(me._moveY);
        if(me.insertDOM){
            if(me.direction == 'down'){
                me.$domResult = me.$domUp;
                me.domLoad = me.opts.domUp.domLoad;
            }else if(me.direction == 'up'){
                me.$domResult = me.$domDown;
                me.domLoad = me.opts.domDown.domLoad;
            }

            me.fnTransition(me.$domResult,300);

            if(_absMoveY > me.opts.distance){
                me.$domResult.css({'height':me.$domResult.children().height()});
                me.$domResult.html('').append(me.domLoad);
                me.fnCallback(me);
            }else{
                me.$domResult.css({'height':'0'}).on('webkitTransitionEnd',function(){
                    me.insertDOM = false;
                    $(this).remove();
                });
            }
            me._moveY = 0;
        }
    };

    // 回调
    MyDropLoad.prototype.fnCallback = function(me){
        me.loading = true;
        if(me.opts.loadUpFn != '' && me.direction == 'down'){
            me.opts.loadUpFn(me);
        }else if(me.opts.loadDownFn != '' && me.direction == 'up'){
            me.opts.loadDownFn(me);
        }
    };

    // 锁定
    MyDropLoad.prototype.lock = function(){
        var me = this;
        me.isLock = true;
    };

    // 解锁
    MyDropLoad.prototype.unlock = function(){
        var me = this;
        me.isLock = false;
    };

    // 重置
    MyDropLoad.prototype.resetload = function(){
        var me = this;
        if(!!me.$domResult){
            me.$domResult.css({'height':'0'}).on('webkitTransitionEnd',function(){
                me.loading = false;
                me.insertDOM = false;
                $(this).remove();
            });
        }
    };

    // css过渡
    MyDropLoad.prototype.fnTransition=function(dom,num){
        dom.css({
            '-webkit-transition':'all '+num+'ms',
            'transition':'all '+num+'ms'
        });
    };
    var chooseTime = function(){

    };
    chooseTime.prototype = {
        manyDays: function(n) {//当天往后加减n天，比如当天是20140915 n=3 20140918
            var d = new Date(),
                days = "",
                dd = d.setDate(d.getDate() + n);
            return this.strTodate(dd)
        },
        manyDaysNew: function(n,sDate) {//当天往后加减n天，比如当天是20140915 n=3 20140918
            var d = new Date,days,dd;
            if(typeof sDate == 'string'){
                sDate = sDate.replace(/-/g,'');
                d = new Date(sDate.substr(0,4),sDate.substr(4,2)-1,sDate.substr(6,2),'00','00','00');
            }else if(typeof sDate == 'object'){
                d = sDate;
            }
            dd = d.setDate(d.getDate() + n);
            return this.strTodate(dd)
        },
        manyDaysForTJD: function(n,sDate) {
            var d = new Date,days,dd;
            if(typeof sDate == 'string'){
                sDate = sDate.replace(/-/g,'');
                d = new Date(sDate.substr(0,4),sDate.substr(4,2)-1,sDate.substr(6,2),'06','00','00');
            }else if(typeof sDate == 'object'){
                d = sDate;
            }
            dd = d.setDate(d.getDate() + n);
            return this.strTodate(dd)
        },
        manyDaysForTJDCount: function(n,sDate) {
            var d = new Date,days,dd;
            if(typeof sDate == 'string'){
                sDate = sDate.replace(/-/g,'');
                d = new Date(sDate.substr(0,4),sDate.substr(4,2)-1,sDate.substr(6,2),'06','00','00');
            }else if(typeof sDate == 'object'){
                d = sDate;
            }
            dd = d.setDate(d.getDate() + n);
            var year = d.getFullYear();
            var month = ((d.getMonth()+1) < 10) ? ("0" + (d.getMonth()+1)) : (d.getMonth()+1);
            var days = (d.getDate() < 10) ? ("0" + d.getDate()) : d.getDate();
            var result = year+String(month)+days;
            return result;
            // return this.strTodate(dd)
            // return d.getFullYear()+''+(d.getMonth()+1)+''+d.getDate();
        },
        manyMonths: function(n,sDate) {//当天往后加减n月，比如当天是20140915 n=3
            var d = new Date,days,dd;
            if(typeof sDate == 'string'){
                sDate = sDate.replace(/-/g,'');
                d = new Date(sDate.substr(0,4),sDate.substr(4,2)-1,sDate.substr(6,2),'00','00','00');
            }else if(typeof sDate == 'object'){
                d = sDate;
            }
            dd = d.setMonth(d.getMonth() + n);
            return this.strTodate(dd)
        },
        manyYears: function(n,sDate) {//当天往后加减n年，比如当天是20140915 n=3
            var d = new Date,days,dd;
            if(typeof sDate == 'string'){
                sDate = sDate.replace(/-/g,'');
                d = new Date(sDate.substr(0,4),sDate.substr(4,2)-1,sDate.substr(6,2),'00','00','00');
            }else if(typeof sDate == 'object'){
                d = sDate;
            }
            dd = d.setYear(d.getFullYear() + n);
            return this.strTodate(dd)
        },
        strTodate: function(str) {//
            var startyear = 1970;
            var startmonth = 1;
            var startday = 1;
            var d, s, st;
            var sep = ":";
            d = new Date();
            d.setFullYear(startyear, startmonth, startday);
            d.setTime(0);
            d.setMilliseconds(str);
            s = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            st = s.replace(/-$/, "").replace(/\b(\w)\b/g, "0$1").replace(/-/g, "");
            return st
        },
        getMonthBefor: function(n,newdate) {//获取前后几个月的日期，n=3,返回20141215
                var resultDate, yy, mm, dd;
                var currDate = new Date();
                yy = currDate.getFullYear();
                mm = currDate.getMonth() + 1;
                dd = currDate.getDate();
                if(newdate && newdate.length == 8) {
                    yy = parseInt(newdate.slice(0,4));
                    mm = parseInt(newdate.slice(4,6));
                    dd = parseInt(newdate.slice(6,8));
                }
               var dt=new Date(yy,mm,dd);
               dt.setMonth(dt.getMonth()+n);
               if( (dt.getFullYear()*12+dt.getMonth()) > (yy*12+mm + n) )
                {
                dt=new Date(dt.getYear(),dt.getMonth(),0);
                }
               var year = dt.getFullYear();
               var month = (dt.getMonth() < 10) ? ("0" + dt.getMonth()) : dt.getMonth();
               var days = (dt.getDate() < 10) ? ("0" + dt.getDate()) : dt.getDate();
               var resultDate = year+String(month)+days;
            return resultDate
        },
        aDays: function(n) {//n=3返回前后三天数组[20140915,20140916,20140917]
            var arrays = [],
                i = 1,
                num = Math.abs(n);
            if (n > 0) {
                for (i; i <= num; i++) {
                    arrays.push(this.manyDays(i))
                }
            } else {
                for (i; i <= num; i++) {
                    arrays.push(this.manyDays(-i))
                }
            }
            return arrays
        },
        getYTD: function(n) {//20140915转换2014年09月15日
            var year = n.substr(0, 4),
                months = n.substr(4, 2),
                days = n.substr(6);
            return year + "年" + months + "月" + days + "日"
        },
        getYTDS: function(n) {//20140915转换2014-09月-日
            var year = n.substr(0, 4),
                months = n.substr(4, 2),
                days = n.substr(6);
            return year + "-" + months + "-" + days
        },
        getYTDSNew: function(n) {//20140915转换2014/09/15
            var year = n.substr(0, 4),
                months = n.substr(4, 2),
                days = n.substr(6);
            return year + "/" + months + "/" + days
        },
        DateDiff:function(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式 时间相差多少天
            var  aDate,  oDate1,  oDate2,  iDays;
            var now = new Date();
            if(!sDate1){
                sDate1 = this.dayChange(now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate());
            }
            if(sDate1.indexOf('-')<0){
                sDate1 = this.getYTDS(sDate1);
            }
            if(!sDate2){
                sDate2 = this.dayChange(now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate());
            }
            if(sDate2.indexOf('-')<0){
                sDate2 = this.getYTDS(sDate2);
            }
            aDate  =  sDate1.split("-");
            oDate1  =  (new  Date(aDate[0]  +  '/'  +  aDate[1]  +  '/'  +  aDate[2])).getTime() ;   //转换为12-18-2002格式
            aDate  =  sDate2.split("-");
            oDate2  =  (new  Date(aDate[0]  +  '/'  +  aDate[1]  +  '/'  +  aDate[2])).getTime();
            iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);    //把相差的毫秒数转换为天数
            return  iDays
        },
        DateDiffForTJD:function(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式 时间相差多少天
            var iDays;
            oDate1  =  (new Date(sDate1.substr(0,4),sDate1.substr(4,2)-1,sDate1.substr(6,2),'05','00','00')).getTime() ;   //转换为12-18-2002格式
            oDate2  =  (new Date(sDate2.substr(0,4),sDate2.substr(4,2)-1,sDate2.substr(6,2),'08','00','00')).getTime();
            iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);    //把相差的毫秒数转换为天数
            return  iDays
        },
        dateInterval:function(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式 时间相差多少天
            var  aDate,  oDate1,  oDate2,  iDays;
            var now = new Date();
            if(!sDate1){
                sDate1 = this.dayChange(now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate());
            }
            if(sDate1.indexOf('-')<0){
                sDate1 = this.getYTDS(sDate1);
            }
            if(!sDate2){
                sDate2 = this.dayChange(now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate());
            }
            if(sDate2.indexOf('-')<0){
                sDate2 = this.getYTDS(sDate2);
            }
            aDate  =  sDate1.split("-");
            oDate1  =  (new  Date(aDate[0]  +  '/'  +  aDate[1]  +  '/'  +  aDate[2])).getTime() ;   //转换为12-18-2002格式
            aDate  =  sDate2.split("-");
            oDate2  =  (new  Date(aDate[0]  +  '/'  +  aDate[1]  +  '/'  +  aDate[2])).getTime();
            iDays  =  parseInt((oDate1  -  oDate2)  /  1000  /  60  /  60  /24);    //把相差的毫秒数转换为天数
            return  iDays
        },
        dayChange:function(yymmdd){//yyyy-mm-dd 转换成 yyyymmdd
            var days = yymmdd.split('-');
            if(days.length>1){
                return days[0]+(days[1]<=9 ? '0'+parseFloat(days[1]) : days[1])+(days[2]<=9 ? '0'+parseFloat(days[2]) : days[2])
            }else{
                return yymmdd;
            }
        },
        getDay:function(date){//根据日期返回周几
            var now = new Date();
            if(date == 'now'){
                date = this.dayChange(now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate());
            }
            var dateg = this.getYTDS(date);
            var ndate = dateg.split('-');
            if(ndate.length>1){
                var weekday=new Array(7);
                weekday[0]="日";
                weekday[1]="一";
                weekday[2]="二";
                weekday[3]="三";
                weekday[4]="四";
                weekday[5]="五";
                weekday[6]="六";
                if(ndate.length == '2'){ndate = ndate.unshift('');}

                var nowYear = ndate[0]==''?now.getFullYear():ndate[0];
                var time= nowYear +'/'+ndate[1]+'/'+ndate[2];
                var ssdate = new Date(time);//2014,05,11
                var index = ssdate.getDay();
                if(weekday[index] != undefined){
                    return '周'+weekday[index] ;
                }else{
                    return '';
                }
            }else{
                return '';
            }
        }
    };
    var loadXML = function(xmlString) {
        //加载xml
        var xmlDoc;
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            if (!xmlDoc) {
                xmldoc = new ActiveXObject("MSXML2.DOMDocument.3.0")
            }
            xmlDoc.async = false;
            xmlDoc.loadXML(xmlString)
        } else {
            if (document.implementation && document.implementation.createDocument) {
                var domParser = new DOMParser();
                xmlDoc = domParser.parseFromString(xmlString, "text/xml")
            } else {
                return null
            }
        }
        return xmlDoc
    };
    TZT.extend({
        xmlattr: function(sXml, node, attr){
            //单个节点属性的值
            // <step inteval="182" interest_rate="0.11%"/>
            // 取inteval的值
            var aGetnode = [],
                data = loadXML(sXml),
                nodes = data.getElementsByTagName(node),
                ln = nodes.length;
            for (var i = 0; i < ln; i++) {
                aGetnode.push(nodes[i].getAttribute(attr))
            }
            return aGetnode
        },
        allAttributes: function(sXml, node, names) {
            //把所有的属性都返回
            /*
             *<response>
             <flag code="0" msg="success"/>
             <procuctList>
             <product procuctCode="000001" procuctTACode="" recommendReason1="推荐理由1" recommendReason2="推荐理由2" recommendReason3="推荐理由3" recommendReason4="推荐理由4" yieldDesc="年化收益率" annualYield="5.7%" yieldValue="年化收益率5.7%" extend1="extend1" extend2="extend2" extend3="extend3" extend4="extend4"/>
             </procuctList>
             </response>
             *
             * @sXml是xml
             * @node节点 product
             * @names == procuctCode
             * 返回000001:{
             annualYield: "5.7%"
             extend1: "extend1"
             extend2: "extend2"
             extend3: "extend3"
             extend4: "extend4"
             procuctCode: "000001"
             procuctTACode: ""
             recommendReason1: "推荐理由1"
             recommendReason2: "推荐理由2"
             recommendReason3: "推荐理由3"
             recommendReason4: "推荐理由4"
             yieldDesc: "年化收益率"
             yieldValue: "年化收益率5.7%"
             }
             * */
            var aGetnode = [],
                xmlobj = {},
                data = loadXML(sXml),
                nodes = data.getElementsByTagName(node),
                ln = nodes.length;
            for (var i = 0; i < ln; i++) {
                var name = nodes[i].getAttribute(names) || i;
                if (name && name in xmlobj) {} else {
                    xmlobj["" + name + ""] = {}
                }
                var nln = nodes[i].attributes.length,
                    x = 0;
                for (x; x < nln; x++) {
                    var nodename = nodes[i].attributes[x].name;
                    xmlobj["" + name + ""][nodename] = nodes[i].getAttribute(nodename)
                }
                if (!names) {
                    aGetnode.push(xmlobj["" + name + ""])
                }
            }
            if (!names) {
                return aGetnode
            } else {
                return xmlobj
            }
        },
        xmltext:function(sXml,node,obj){
            //把所有的节点都放在一个数组里
            /*info中返回[{type:1,content:abc}]
             *<flag code="0" msg="success"/>
             *<info>
             *   <type>1</type>
             *   <content>abc</content>
             * </info>
             */
            var xmlobj=[],
                data=loadXML(sXml),
                nodes=data.getElementsByTagName(node),
                ln=nodes.length;
            for(var i=0;i<ln;i++){
                var name= i;
                if(name && name in xmlobj){
                }else{
                    xmlobj[''+name+'']={};
                }
                var nln = nodes[i].childNodes.length,x=0;
                for(x;x<nln;x++){
                    var nodename = nodes[i].childNodes[x].nodeName;
                    if(nodename == '#text'){continue;}
                    if(obj){
                        if(obj.indexOf(nodename)>=0){
                            xmlobj[''+name+''][nodename]=nodes[i].childNodes[x].innerHTML || nodes[i].childNodes[x].childNodes[0].nodeValue;
                        }
                    }else{
                        xmlobj[''+name+''][nodename]=nodes[i].childNodes[x].innerHTML || nodes[i].childNodes[x].childNodes[0].nodeValue;
                    }
                }
            }
            return xmlobj;
        },
        isEmptyObj: function (OBJ) {//判断对象是否为空
            /*var name;
             for (name in OBJ) {
             return false;
             }
             return true;*/
            var bIsEmpty = true, N = 0;
            for (var x in OBJ) {
                x ? N++ : '';
            }
            N > 0 ? bIsEmpty = false : '';
            return bIsEmpty;
        },
        webViewFn: function (fnName, obj) {
            if (!fnName){
                return false;
            }
            var a = obj || '';
            var jsonobj = a;
            if (typeof a === 'object') {
                jsonobj = JSON.stringify(a);
            }else {
                jsonobj = a;
            }
            console.log(fnName, jsonobj);
            if (appversion.indexOf("android") > 0) {
                if (jsonobj) {
                    window.MyWebView && window.MyWebView.setContentParams(fnName, jsonobj);
                } else {
                    window.MyWebView && window.MyWebView.setContentParams(fnName);
                }
            }else{
                if (window.MyWebView) {
                    if (jsonobj) {
                        window.MyWebView && window.MyWebView.setContentParams(fnName, jsonobj);
                    } else {
                        window.MyWebView && window.MyWebView.setContentParams(fnName);
                    }
                } else {
                    window.webkit.messageHandlers.setContentParams.postMessage({
                        func: fnName, //回调函数名
                        data: jsonobj //数据
                    });
                }
            }
        },
		uuid: function () { // 生成调用原生功能的唯一识别号
			function S4() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}
			return (S4() + S4() + "" + S4() + "" + S4() + "" + S4() + "" + S4() + S4() + S4());
		},
        nativeTimeRes:{},//记录接口时间
		tztWebdataFormat: function (config, oSendData) {
			var _obj = {};
			// 原Path传值改成JSON传值
            if (typeof oSendData === 'string' && oSendData.indexOf("=") > -1) {
                var _oData = oSendData.split("&");
                for (var i = 0; i < _oData.length; i++) {
                   var _arr = _oData[i].split("=");
                   _obj[_arr[0]] = _arr[1] || '';
                }
            }
			else if (oSendData instanceof Array) {
				for (var i = 0; i < oSendData.length; i++) {
                    if(oSendData[i]) {
                        var _arr = oSendData[i].split("=");
                        _obj[_arr[0]] = _arr[1] || '';
                    }
				}
			}
            else {
                _obj = oSendData;
            }
			var _sUrl = config.newUrl.replace(/[?|/]/g, '');
			var _id = this.uuid();
            var time = new Date();
            TZT.nativeTimeRes[_id] = time.getTime()
			native.tztCallNative(_sUrl, _obj, _id, config);
		},
        hasNativeForAndroid: function() {
            var _has = false
            if (this.isAdr() && window.MyWebView && window.MyWebView.tztCallNativeFuctionFromWeb) {
                _has = true
			}
            return _has;
        },
        calcObjectSize: function(obj, limitSize) {
            String.prototype.byteLength = function() {
                var count = 0;
                for(var i=0,l=this.length;i<l;i++) {
                    count += this.charCodeAt(i) <= 128 ? 1 : 2;
                }
                return count;
            }
            try {
                var _str = typeof obj === 'object' ? JSON.stringify(obj) : obj;
                var _str_len = _str.byteLength();
                var _obj_len = parseInt(_str_len - (_str_len / 8) * 2);
                var _size = +(_obj_len / 1024).toFixed(2);
                return limitSize ? _size > limitSize : _size;
            }catch(e) {
                return 0;
            }
        }
    });
            var MSJY_ACTION = [
                97,98,200,201,202,207,208,219,20200,20201,4999,100,101,103,104,5123,5173,5060,5061,5063,5064,5160,5177,5178,8061,5401,5414,5415,5416,5417,5419,5426,5427,5428,5429,5430,5431,5432,5433,5434,5435,5436,5437,5439,5440,5441,5443,5444,5445,5446,5447,5448,5449,5400,5402,5403,5404,5405,5406,5407,5408,5409,5410,5411,5412,5413,5418,5420,5421,5422,5423,5424,5425,5438,5450,5842,5590,5651,6982,5451,5452,5453,5454,5455,5456,5457,5458,5459,105,5484,5487,5490,5474,5488,5569,5485,5112,5113,5117,5104,5105,5106,5107,5108,5109,5100,5101,5102,5103,5111,5046,5110,5116,5641,5642,5643,5125,5200,5201,5202,5204,5205,648,6007,5159,7113,7109,7115,5124,5014,7731,5137,7780,5134,7782,5136,5133,5141,7794,5130,5131,5132,7799,7801,7802,5140,7787,7796,7795,5025,7724,7112,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,5644,5645,150,151,152,153,154,155,156,157,6033,6034,6029,6036,6040,6038,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,6380,6381,6382,6383,6384,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,340,341,342,343,344,345,346,349,350,351,637,360,361,365,366,367,368,369,370,371,372,373,374,375,376,377,378,5679,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,474,475,500,501,510,511,514,515,516,521,522,523,524,525,526,527,530,531,532,533,534,535,536,537,538,539,550,551,552,553,554,555,556,557,558,560,561,562,563,564,565,570,571,572,573,574,575,576,577,578,579,580,581,590,591,592,593,600,601,602,603,604,605,606,607,608,610,611,612,615,616,6035,630,631,632,633,635,634,636,638,640,641,642,643,644,645,646,647,648,649,650,651,652,589,660,661,662,663,664,665,666,680,681,682,683,685,690,691,692,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,5680,5681,5682,5683,5684,420,421,422,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,445,446,447,448,449,454,455,456,460,461,462,463,464,465,6001,266,267,268,269,270,271,272,273,274,275,276,277,278,279,5018,280,281,282,283,284,285,286,287,288,289,290,5200,5013,5014,5060,5061,7101,5177,5035,5175,5178,5161,5162,5163,5164,5165,5190,5135,5194,5195,6531,6532,6533,6534,6535,6536,6537,6538,6539,6540,6541,6542,6543,6544,6545,6546,6547,6548,6549,6550,7101,7104,7121,7122,7123,7103,7102,6571,6572,6573,6574,6575,6576,6569,6570,5800,5801,5802,5803,5804,5805,5806,5807,5808,5809,5810,5811,5812,5813,5814,5815,5816,5817,5818,5821,5822,5823,5999,6582,5153,5154,5155,5156,5157,5158,5168,5169,5170,5172,6751,6752,6753,6754,6755,6756,6757,6519,6758,6759,6760,6761,6762,6763,5187,6764,6581,6776,6777,6594,5015,6778,6779,5664,5665,5666,5667,5668,5669,6059,6060,6061,6062,6063,6064,6065,6066,6067,6068,6069,6342,6343,6344,6345,6346,5633,6341,6011,6173,6171,6172,6174,6175,6176,6177,6178,6211,6100,6101,6102,667,668,669,670,671,672,673,6104,6105,6106,5019,6108,6805,6009,6801,6800,6809,6797,6191,6124,6796,6802,6961,6962,7213,7108,6130,6131,6842,6843,6844,6845,6608,6609,7313,7314,7315,7316,7310,7311,620,621,622,623,625,626,627,628,629,6251,6252,6676,5000,5001,5002,5003,5004,5006,5007,6205,6395,6396,6397,6398,6399,6400,6401,7131,7133,7138,7169,6619,44901,6620,5841,5842,5210,5211,6630,6631,6632,6633,6634,7077,6260,6261,6262,6263,6264,6265,6197,6198,6199,6200,6201,6202,6203,6206,6207,6208,7033,7034,7036,7035,7810,7810,7810,7032,7217,7215,6420,7651,6270,6271,6272,6273,6274,6275,6276,6277,466,467,468,469,470,471,473,7008,7009,7010,7011,7156,7827,7828,7182,5600,5601,5602,5603,5604,5605,5606,5607,5608,5609,5610,5611,5612,5613,5614,5615,5616,5662,6183,40150,6290,6682,6309,6293,6294,5283,5284,5285,5286,5287,5288,5290,5291,5292,6659,6660,6661,6662,6663,6664,6665,6666,347,5280,5282,5296,5297,6325,5625,5626,5661,5627,5628,5617,5618,5619,5620,5621,5622,5623,5624,5629,5630,5632,7126,7128,6422,6423,6424,6425,6426,6955,6956,48200,5656,5658,5660,5659,6895,5228,6888,6740,6891,6896,5235,5215,5237,5236,6215,6625,6626,5214,6214,6870,5634,5635,6993,5650,6991,6992,48201,48235,48236,48237,48250,48251,48252,48253,48230,48254,48255,48256,48257,48258,48259,48260,48261,48262,48263,48264,48265,48266,48267,48238,48268,48269,48270,48271,48272,48273,48274,48275,48276,48277,48278,48279,7776,7777,7778,5653,5479,5480,5481,5482,5483,5575,5576,5577,5578,5579,5580,5556,5596,5597,5206,5207,5505,5636,5637,5638,5639,6437,6438,6447,6448,6451,6452,5663,6427,7770,7771,7772,7773,7774,7775,6428,6429,5678,6431,6433,6440,6444,7821,7822,7823,7824,7825,7815,7816,7817,7818,7819,7820,7826,7835,7836,7829,7830,7831,7832,7833,7834,5646,6267,6266,49055,49400,49425,49054,5648,5649,5652,5654,5655,5850,5066,5073,5067,5068,5069,5075,5076,5078,5079,5087,5088,5070,5071,5072,5074,5089,5090,5096,5098,5097,5365,5363,5364,6369,6370,6371,6372,6373,6374,6329,6330,6331,8055,8001,8002,8003,8004,8005,8006,8007,8008,8009,8010,8011,8012,8013,8014,8015,8016,8017,8018,8019,8020,8021,8022,8023,8024,8025,8026,8027,8028,8029,8030,8032,8033,8034,8035,8038,8039,8079,8092,6316,5670,5671,5672,5673,5674,5675,5676,49906,49907,49908,49909,49910,49900,49901,49902,49904,49912,49515,49516,49517,49518,49519,49520,49521,49522,49562,49563,49564,49565,49566,49567,49568,49569,49572,49613,49614,49615,49617,49618,49619,49620,49623,49624,49625,49637,49678,49679,49680,49681,49682,49683,49684,49697,49698,57049,6976,6977,6981,6979,6980,6984,
                57133,57135,57136,57137,57138,57139,57140,
                57232,57233,57234,57235,57236,57237,57238,57239,57283,57292,
                6765,
                5686,
                7386,7385,7384,7383,7382,7381,7380,7379,7378,7377,7376,7375,7374,7373,7371,
                7387,
                6766,
                5687,5688,
				5489,
                5689,5690,5691,
		 6298,6299,158,//现金选择权
         6651,6652,6653,6654,6655,6656,//沪深预受要约
                6675,7253,
		49925,
        5694,6317,
        5692,
5693,
        5698,5696,
        5008,5009,6037,5710,
        7340,7347,7341,7348,7343,7344,7342,7345,7346,7362,7363,7367,7363,7366,7368,7369,7501,7502,
        5711,5699,
        6790,6791,5723,5724,5725,5726,5727,
        8100, 8101,
            ];
            // 功能号配置更新日志
            //20221012 业务办理新增港澳台电子签名功能，新增以下走交易通道的功能号57133=上传文件57135=活体检测57136=保存个人信息57137=资料更新请求57138=查询电子协议请求信息57139=保存步骤码57140=查询步骤码   姜超
            //20221111 6765  332717  深港通公司行为申报当日撤单(文档描述 深港通非交易撤单) 深港通公司行为申报当日撤单 杨慧宇
            //20221202 5686 两融合约查询 武文斌
            //20221118 移除6328 北交所新股申购功能号，走资讯路由，付锦胜
            // 20230117 港股公司行为申报参考数量获取新增功能号6766 杨慧宇
            //20230607 普通委托选择批量撤单新增功能号6675 丛紫怡
	    //20230922 家庭信托购买新增49925 武文斌
        // 20230830 查询所有交易中心股东账号新增功能号 5692 胡春雨
        //20230830 查询养老投资者账户信息新增功能号 5693 胡春雨
        // 20231024 获取所有资金号及其资产5694 ，获取关联的信用，期权资金号相关数据 6317 崔禹  
        //20231107 盘后撤单可撤数据新增功能号5698 胡春雨
        //20240201 港股通限售股查询新增功能号5710 丛紫怡
        // 20240223 查询币种间汇率 5696 杨慧宇
            
    $.getData= function(obj,oSendData,fnSuccess,oConfig){
        var req = {
            XML: "/reqxml?",//请求服务器数据
            LOCAL: "/reqlocal?",//请求本地数据
            BINARY: "/reqbinary?",//请求服务器文件数据
            SAVEMAP: "/reqsavemap?",//请求本地保存数据
            READMAP: "/reqreadmap?",//读取本地保存数据
            SAVEFILE: "/reqsavefile?",//请求本地保存文件
            READFILE: "/reqreadfile?",//读取本地保存文件
            SOFTTODO: "/reqsofttodo?",//设置本地数据
            LOADFILE: "reqloadfile?",//加载本地文件
            SIGNATURE: "reqsignature?"//请求签名数据
        };
        var localtokentype = '0',tokenVal = '($Token)';
        if(obj.oSendData && (obj.oSendData.tokentype || obj.oSendData.TOKENTYPE)){
            localtokentype = obj.oSendData.tokentype || obj.oSendData.TOKENTYPE;
        }
        if(window.localStorage && window.localStorage.getItem('TOKENTYPE') == localtokentype){
            tokenVal = window.localStorage.getItem('TOKEN') || '($Token)';
        }
        window.localStorage && window.localStorage.setItem("TOKENTYPE",localtokentype);
        


        // 国密改造H5--默认值强制转换
        var __obj = oSendData || obj.oSendData;
        keysToLower(['action','ReqLinkType']);
        function keysToLower(keys){
            var arr = keys;
            // 处理action大小写
            for(var i=0;i<arr.length;i++){
                for(var o in __obj){
                    var _key = arr[i];
                    if(o.toLowerCase() === _key.toLowerCase()){
                        __obj[_key] = __obj[o];
                        if(_key !== o){
                            delete __obj[o];
                        };
                    };
                };
            };
        };
        var config = {
            logintype:1,//1普通交易2是融资融券交易8是个股期权交易9担保品划转
            sURL:req.XML,//默认请求服务器数据
            oSendData:{
                MobileCode: '($MobileCode)',
                //时间戳
                Token: tokenVal,
                //请求标识
                Reqno: +new Date().getTime(),
                //请求服务器标示
                ReqLinkType: 1,  
                newindex:1
            },//发送数据
            copyIsArray:true,//深拷贝还是潜拷贝
            fnSuccess:null,//errorno大于0的回调函数
            oConfig:null,//errorno小于o回调函数
            Error:null,//去除错误编号
            isload:true,//loading加载图
            isURL:false,//使用url传参
            isToken:true,//使用url传参
            needUrlEncrypt:true,//是否需要客户端加密请求
            timeout:30000,
            timeoutfn:null
        };
        if(typeof obj == 'string'){
            config.sURL = obj;
        }
        if(oSendData && (typeof oSendData == 'object')){
            for(var oSend in oSendData){
                config.oSendData[oSend] = oSendData[oSend];
            }
        }
        if(fnSuccess){
            config.fnSuccess = fnSuccess;
        }
        if(oConfig){
            config.oConfig = oConfig;
        }
        if(typeof obj == 'object'){
            var iscopy = config.copyIsArray;
            if(typeof obj.copyIsArray != core_strundefined){
                iscopy = obj.copyIsArray;
            }
            config = $.extend(iscopy,config,obj);
           /* 国密改造 非行情通道且非交易接入配置的功能号走资讯通道 hebin 20220830 start */
            // 需要考虑登录功能号新增的情况 
            // 无密在msjy.ini配置内情况。
            var __oSendData = config.oSendData;
            if(__oSendData.ReqLinkType == '0'){
                // 开发主动设置走行情通道，传0。
                __oSendData.ReqLinkType = '0';
            }else {
                var isInMSJY = MSJY_ACTION.indexOf(Number(__oSendData.action)) > -1;
                // 功能号是否在交易接入中配置
                if(isInMSJY){
                    __oSendData.ReqLinkType = '1';
                }else{
                    __oSendData.ReqLinkType = '2';
                }
            }
            // 国密改造接口 标识
            __oSendData.GMGZJK = '1';

           /* 国密改造 end */

            //一级页增加特殊入参fromPage用于分析接口压力    
            var pathName = window.location.pathname;
            if(pathName == '/vue/ui5/jiao-yi/jiao-yi-shou-ye/html/jiao-yi-shou-ye.html'){
                __oSendData.fromPage = 'jiao-yi-shou-ye';
            };
        }

        if(config.isload){
            T.loadTips({istip:true});
        }
        if(config.isURL){

            if('action' in config.oSendData){
                for(var x in config.oSendData){
                    if(!config.isToken && config.oSendData[x] == 'Token'){
                        continue;
                    }
                    config.sURL += config.oSendData[x]+'&';
                }
                config.sURL = config.sURL.slice(0,-1);
            }
            config.oSendData = '';
        }
        var newUrl = '',newData = '',newtimeout = '';
        newtimeout = config.timeout;
        if (config.sURL.indexOf('?') >= 0 && (config.sURL.indexOf('reqsavefile')<0) && (config.sURL.indexOf('reqreadfile')<0)) {
            var dataSurl = config.sURL.split('?');
            newUrl = dataSurl[0];
            newData = dataSurl[1];
        } else {
            newUrl = config.sURL;
        }

        if (config.oSendData != '') {
            if(typeof config.oSendData == "object"){
                // alert("原数据：" + JSON.stringify(oSendData));
                for (var x in config.oSendData) {
                    if(!config.isToken && x == 'Token'){
                        continue;
                    }
                    if (newData == "") {
                        newData += x + '=' + encodeURIComponent(config.oSendData[x])+'&';
                    } else {
                        newData += '&' + x + '=' + encodeURIComponent(config.oSendData[x]);
                    }
                }
            }else if(typeof config.oSendData == "string"){
                newData+='&'+config.oSendData;
            }
        }
        newData = newData.replace(/undefined/g,'');
        if (appversion.indexOf("android") > 0) {
            try {
                if(config.needUrlEncrypt !== false){
                    newData = window.MyWebView.onWebdataEncrypt(newData);
                    config.needUrlEncrypt = true;
                }
            } catch (e) {

            }
        }else{
            try {
                newData = onWebdataEncrypt(newData);
                config.needUrlEncrypt = true;
            } catch (e) {

            }
        }
        //sRequestURL, oSendData, fnSuccess, oConfig
        var aChangeError = ['-204007', '-204009', '-207001', '-204001', '-10001'],
            oDefConfig = {
                type: "POST",
                url: newUrl,
                data: newData,
                timeout:newtimeout,
                processData:false,
                contentType: "application/x-www-form-urlencoded;",//beforeSend发送之前complete应答之后
                beforeSend: function(request) {
                    request.setRequestHeader("tztWebdataEncrypt", (config.needUrlEncrypt ? '1' : '0'));
                },
                success: function(oData) {
                    //TZT.token = oData.TOKEN || '';
                    //window.localStorage && oData.TOKEN && window.localStorage.setItem("TOKEN", oData.TOKEN);
                    if(config.Error && (typeof config.Error != core_strundefined)){
                        for(var i=0;i<config.Error.length;i++){
                            var indexs = aChangeError.indexOf(config.Error[i]);
                            if(indexs>=0){
                                aChangeError = aChangeError.slice(indexs,2).concat(aChangeError.slice(indexs+1,aChangeError.length));
                            }
                        }
                    }
                    // console.log(T.tipln)
                    if (aChangeError.indexOf(oData.ERRORNO) >= 0) {
                        /*TZT.action10402();
                        setTimeout('funcname()', 1000);*/
                        window.localStorage && window.localStorage.clear();
                            T.tipln = 0;
                            T.langTip(config.loadingDelay);
                            // T.loadTips({istip:false});
                            // 首页行情获取时用到，兼容ios断网返回-10001时，行情不更新的问题；
                            if(config.oConfig60){
                                if(typeof config.oConfig60 === 'function'){config.oConfig60(oData);}
                            }
                            if(config.oSendData.action=='48251') {
                                TZT.readLocalMesg(['jyloginflag','tztrzrqloginflag','tztggqqloginflag'],function(data){
                                    if(config.logintype == '1'){
                                        if(data.JYLOGINFLAG>1) {
                                            TZT.fn.action10402(TZT.fn.action10090({isExport:true,logintype:config.logintype}),{logintype:config.logintype});
                                        }else{
                                            TZT.fn.action10090({logintype:config.logintype});
                                        }
                                    }
                                    if(config.logintype == '2'){
                                        if(data.TZTRZRQLOGINFLAG>0) {
                                            TZT.fn.action10402(TZT.fn.action10090({isExport:true,logintype:config.logintype}),{logintype:config.logintype});
                                        }else{
                                            TZT.fn.action10090({logintype:config.logintype});
                                        }
                                    }
                                    if(config.logintype == '8'){
                                        TZT.fn.action10402(TZT.fn.action10090({isExport:true,logintype:config.logintype}),{logintype:config.logintype});
                                    }
                                })
                            }else{
                                TZT.fn.action10402(TZT.fn.action10090({isExport:true,logintype:config.logintype}),{logintype:config.logintype});
                            }
                        //changeURL("http://action:10402/?context=&&url=" + encodeURIComponent("http://action:10090/?loginType=2&&loginKind=0&&url="));
                    } else if (oData.ERRORNO < 0) {
                        if(config.oConfig){
                            T.langTip(config.loadingDelay);
                            // T.loadTips({istip:false});
                            if(typeof config.oConfig === 'function'){config.oConfig(oData);}
                            config.oConfig && config.oConfig.fnZeroLeft && config.oConfig.fnZeroLeft();
                            return;
                        }
                        if(oData.ERRORMESSAGE != null && oData.ERRORMESSAGE != "" && (typeof oData.ERRORMESSAGE != core_strundefined)){
                            T.tipln = 0;
                            // T.loadTips({istip:false});
                            T.langTip(config.loadingDelay);
                            if(oData.ACTION != '' && oData.ACTION != '65535'){
                                if (oData.ERRORMESSAGE === '建立 HTTP 连接失败！') {
                                    // oData.ERRORMESSAGE = '系统维护中，建立 HTTP 连接失败'; 提示文职修改 hebin 20171212
                                    console.log(oData.ERRORMESSAGE)
                                    oData.ERRORMESSAGE = '连接失败，请稍后重试';
                                }
                                // 20210915 hebin 拦截首页、交易首页、理财首页 网络错误弹框
                                var pathName = window.location.pathname;
                                if((pathName == '/investment/finance/html/index.html' || pathName == '/investment/liCai5.0/new_finance/html/new_finance.html') && oData.ACTION == '49054'){
                                    alert(oData.ERRORMESSAGE);
                                    return;
                                }
								if(pathName == '/vue/ui4.0/shouye/html/shouYe.html'|| pathName == '/vue/ui5/shou-ye/shou-ye/html/shou-ye.html' || pathName =='/vue/ui5/shou-ye/zu-ji/html/zu-ji.html' || pathName == '/investment/finance/html/index.html' || pathName == '/vue/ui4.0/jiaoyishouye/html/jiaoYiShouYe.html' || pathName == '/vue/ui5/jiao-yi/jiao-yi-shou-ye/html/jiao-yi-shou-ye.html' || pathName == '/investment/liCai5.0/new_finance/html/new_finance.html'){
   									console.error(oData.ERRORMESSAGE)
                                    return;
                                };
                                alert(oData.ERRORMESSAGE);
                            }
                        }else{
                            T.langTip(config.loadingDelay);
                            // T.loadTips({istip:false});
                            config.fnSuccess && config.fnSuccess(oData);
                        }

                    } else {
                        T.langTip(config.loadingDelay);
                        // T.loadTips({istip:false});
                        config.fnSuccess && config.fnSuccess(oData);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    T.langTip(config.loadingDelay);
                    TZT.ajaxError(XMLHttpRequest, textStatus, errorThrown, config.timeoutfn);
                }
            },
            oAjaxParm = {},
            oParam = config.oSendData || {};
        if (oParam) {
            delete oParam.url;
            delete oParam.success
        }
        //oAjaxParm = $.extend(oAjaxParm, oParam);
        $.ajax(oDefConfig)
    };
    $.nGetData= function (obj, oSendData, fnSuccess, oConfig) {
        if(!TZT.hasNativeForAndroid() || TZT.calcObjectSize(obj.oSendData, 8)) { // 不支持native或请求大于2M走ajaxEngine
            return $.getData(obj, oSendData, fnSuccess, oConfig);
        }
        var req = {
            XML: "/reqxml?",//请求服务器数据
            LOCAL: "/reqlocal?",//请求本地数据
            BINARY: "/reqbinary?",//请求服务器文件数据
            SAVEMAP: "/reqsavemap?",//请求本地保存数据
            READMAP: "/reqreadmap?",//读取本地保存数据
            SAVEFILE: "/reqsavefile?",//请求本地保存文件
            READFILE: "/reqreadfile?",//读取本地保存文件
            SOFTTODO: "/reqsofttodo?",//设置本地数据
            LOADFILE: "reqloadfile?",//加载本地文件
            SIGNATURE: "reqsignature?"//请求签名数据
        };
        var localtokentype = '0',tokenVal = '($Token)';
        if(obj.oSendData && (obj.oSendData.tokentype || obj.oSendData.TOKENTYPE)){
            localtokentype = obj.oSendData.tokentype || obj.oSendData.TOKENTYPE;
        }
        if(window.localStorage && window.localStorage.getItem('TOKENTYPE') == localtokentype){
            tokenVal = window.localStorage.getItem('TOKEN') || '($Token)';
        }
        window.localStorage && window.localStorage.setItem("TOKENTYPE",localtokentype);
        // 国密改造H5--默认值强制转换
        var __obj = oSendData || obj.oSendData;
        keysToLower(['action','ReqLinkType']);
        function keysToLower(keys){
            var arr = keys;
            // 处理action大小写
            for(var i=0;i<arr.length;i++){
                for(var o in __obj){
                    var _key = arr[i];
                    if(o.toLowerCase() === _key.toLowerCase()){
                        __obj[_key] = __obj[o];
                        if(_key !== o){
                            delete __obj[o];
                        };
                    };
                };
            };
        };
        var config = {
            logintype:1,//1普通交易2是融资融券交易8是个股期权交易9担保品划转
            sURL:req.XML,//默认请求服务器数据
            oSendData:{
                MobileCode: '($MobileCode)',
                //时间戳
                Token: tokenVal,
                //请求标识
                Reqno: +new Date().getTime(),
                //请求服务器标示
                ReqLinkType: 1,
                newindex:1
            },//发送数据
            copyIsArray:true,//深拷贝还是潜拷贝
            fnSuccess:null,//errorno大于0的回调函数
            oConfig:null,//errorno小于o回调函数
            Error:null,//去除错误编号
            isload:true,//loading加载图
            isURL:false,//使用url传参
            isToken:true,//使用url传参
            needUrlEncrypt:true,//是否需要客户端加密请求
            timeout:30000,
            timeoutfn:null
        };
        if(typeof obj == 'string'){
            config.sURL = obj;
        }
        if(oSendData && (typeof oSendData == 'object')){
            for(var oSend in oSendData){
                config.oSendData[oSend] = oSendData[oSend];
            }
        }
        if(fnSuccess){
            config.fnSuccess = fnSuccess;
        }
        if(oConfig){
            config.oConfig = oConfig;
        }
        if(typeof obj == 'object'){
            var iscopy = config.copyIsArray;
            if(typeof obj.copyIsArray != core_strundefined){
                iscopy = obj.copyIsArray;
            }
            config = $.extend(iscopy,config,obj);
           /* 国密改造 非行情通道且非交易接入配置的功能号走资讯通道 hebin 20220830 start */
            // 需要考虑登录功能号新增的情况
            // 无密在msjy.ini配置内情况。
            var __oSendData = config.oSendData;
            // 更新日志
            if(__oSendData.ReqLinkType == '0'){
                // 开发主动设置走行情通道，传0。
                __oSendData.ReqLinkType = '0';
            }else {
                var isInMSJY = MSJY_ACTION.indexOf(Number(__oSendData.action)) > -1;
                // 功能号是否在交易接入中配置
                if(isInMSJY){
                    __oSendData.ReqLinkType = '1';
                }else{
                    __oSendData.ReqLinkType = '2';
                }
            }
            // 国密改造接口 标识
            __oSendData.GMGZJK = '1';
           /* 国密改造 end */
        }
        if(config.isload){
            T.loadTips({istip:true});
        }
        if(config.isURL){
            if('action' in config.oSendData){
                for(var x in config.oSendData){
                    if(!config.isToken && config.oSendData[x] == 'Token'){
                        continue;
                    }
                    config.sURL += config.oSendData[x]+'&';
                }
                config.sURL = config.sURL.slice(0,-1);
            }
            config.oSendData = '';
        }
        var newUrl = '',newData = '',newtimeout = '';
        newtimeout = config.timeout;
        if (config.sURL.indexOf('?') >= 0 && (config.sURL.indexOf('reqsavefile')<0) && (config.sURL.indexOf('reqreadfile')<0)) {
            var dataSurl = config.sURL.split('?');
            newUrl = dataSurl[0];
            newData = dataSurl[1];
        } else {
            newUrl = config.sURL;
        }
		config.newUrl = newUrl;
        oAjaxParm = {},
        oParam = config.oSendData || {};
        if (oParam) {
            delete oParam.url;
            delete oParam.success
        }
        TZT.tztWebdataFormat(config, config.oSendData);
    };
    window.h5FastNativeSuccess = function (oData, config) {
        var time = new Date
        config.time = (time.getTime() - TZT.nativeTimeRes[config._id]) + 'ms';
        var urlstr = config.newUrl.split('?')[0];
        if(urlstr == '/reqreadfile') {
            config.fnSuccess && config.fnSuccess(window.atob(oData));
            return;
        }
        if(urlstr == '/reqlocal' || urlstr == '/reqsavemap' ||
        urlstr == '/reqreadmap' || urlstr == '/reqsavefile'){
            oData = decodeURIComponent(escape(window.atob(oData)));
            try{
                var json = JSON.parse(oData)
                config.fnSuccess && config.fnSuccess(json);
                return
            }catch(err){
                config.fnSuccess && config.fnSuccess(oData);
                return
            }
        }
        oData = JSON.parse(decodeURIComponent(escape(window.atob(oData))));
		if (typeof oData === 'string' && oData != '') {
			try {
				oData = JSON.parse(oData);
			} catch (e) {
				try {
					oData = eval("(" + oData + ")");
				} catch (e) { }
			}
		}
		if (typeof config != 'object' && config) {
			config = tztwkwebviewObj[config] || {};
		}
        if(config.Error && (typeof config.Error != core_strundefined)){
            for(var i=0;i<config.Error.length;i++){
                var indexs = aChangeError.indexOf(config.Error[i]);
                if(indexs>=0){
                    aChangeError = aChangeError.slice(indexs,2).concat(aChangeError.slice(indexs+1,aChangeError.length));
                }
            }
        }
        var aChangeError = ['-204007', '-204009', '-207001', '-204001', '-10001'];
        if (aChangeError.indexOf(oData.ERRORNO) >= 0) {
            window.localStorage && window.localStorage.clear();
                T.tipln = 0;
                T.langTip(config.loadingDelay);
            TZT.fn.action10402(TZT.fn.action10090({isExport:true,logintype:config.logintype}),{logintype:config.logintype});
        } else if (oData.ERRORNO < 0) {
            if(config.oConfig){
                T.langTip(config.loadingDelay);
                // T.loadTips({istip:false});
                if(typeof config.oConfig === 'function'){config.oConfig(oData);}
                config.oConfig && config.oConfig.fnZeroLeft && config.oConfig.fnZeroLeft();
                return;
            }
            if(oData.ERRORMESSAGE != null && oData.ERRORMESSAGE != "" && (typeof oData.ERRORMESSAGE != core_strundefined)){
                T.tipln = 0;
                // T.loadTips({istip:false});
                T.langTip(config.loadingDelay);
                if(oData.ACTION != '' && oData.ACTION != '65535'){
                    if (oData.ERRORMESSAGE === '建立 HTTP 连接失败！') {
                        // oData.ERRORMESSAGE = '系统维护中，建立 HTTP 连接失败'; 提示文职修改 hebin 20171212
                        console.log(oData.ERRORMESSAGE)
                        oData.ERRORMESSAGE = '连接失败，请稍后重试';
                    }
                    // 20210915 hebin 拦截首页、交易首页、理财首页 网络错误弹框
                    var pathName = window.location.pathname;
                    if((pathName == '/investment/finance/html/index.html' || pathName == '/investment/liCai5.0/new_finance/html/new_finance.html') && oData.ACTION == '49054'){
                        alert(oData.ERRORMESSAGE);
                        return;
                    }
                    if(pathName == '/vue/ui4.0/shouye/html/shouYe.html'||pathName == '/vue/ui5/shou-ye/shou-ye/html/shou-ye.html' || pathName =='/vue/ui5/shou-ye/zu-ji/html/zu-ji.html' || pathName == '/investment/finance/html/index.html' || pathName == '/vue/ui4.0/jiaoyishouye/html/jiaoYiShouYe.html' || pathName == '/vue/ui5/jiao-yi/jiao-yi-shou-ye/html/jiao-yi-shou-ye.html' || pathName == '/investment/liCai5.0/new_finance/html/new_finance.html'){
                        console.error(oData.ERRORMESSAGE)
                        return;
                    };
                    alert(oData.ERRORMESSAGE);
                }
            }else{
                T.langTip(config.loadingDelay);
                // T.loadTips({istip:false});
                config.fnSuccess && config.fnSuccess(oData);
            }
        } else {
            T.langTip(config.loadingDelay);
            // T.loadTips({istip:false});
            config.fnSuccess && config.fnSuccess(oData);
        }
	}
    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        //支持amd写法
        module.exports = TZT;
    } else {
        //支持cmd写法
        if ( typeof define === "function" /*&& define.amd*/ ) {
            define(/* "TZT", [], */function () { return TZT; } );
        }
    }
    if ( typeof window === "object" && typeof window.document === "object" ) {
        window.TZT = window.T = TZT;
    }
	 // 
    //  足迹记录
    zujijilu()
    function zujijilu(){
        (function (win) {
            if(typeof CiticsNative != "undefined" &&typeof CiticsNative.NativeCall != "undefined"){
                return
            }
			win.NativeBridge = {};
			var IS_IN_APP = false;
			var IS_ANDROID = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1; //android终端
			if (IS_ANDROID) {
				if ("undefined" != typeof (window.citicsnativejs)) {
					if ("undefined" != typeof (window.citicsnativejs.getToken)) {
						IS_IN_APP = true;
					}
				}
			}
			else {
				if ("undefined" != typeof (citics_native_js_getToken)) {
					IS_IN_APP = true;
				}
			}
			NativeBridge = {
				callbacks: {},
				//原生的回调方法
				//原生需要回调时，调用此方法
				//iOS范例：
				//[UIWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"NativeBridge.resultForCallback(%d,%@);",callbackId,resultObject]];
				resultForCallback: function resultForCallback(callbackId, resultObject) {
					try {
						var callback = NativeBridge.callbacks[callbackId];
						if (!callback) return;
						callback.call(null, resultObject);
					} catch (e) {
						alert(e)
					}
				},
				// 调用原生方法
				// functionName : string 方法名
				// args : 方法的参数（使用key:value对象方式传送）
				// callback : 回调方法 （对于不需回调的原生调用，可以不传此参数）
				call: function call(functionName, args, callback) {
					// alert('执行native bridge call');
					if (!IS_IN_APP) {
						return;
					}
					var hasCallback = callback && typeof callback == "function";
					var callbackId = hasCallback ? NativeBridge.uniqueId() : "-1";
					if (hasCallback) {
						NativeBridge.callbacks[callbackId] = callback;
					}
					if (IS_ANDROID) {
						return window.citicsnativejs.nativeBridge(functionName, callbackId, args);
					} else {
						return citics_native_js_nativeBridge(functionName, callbackId, args);
					}
					// return NATIVE_CALL(functionName, callbackId, args);
				},
				uniqueId: function uniqueId() {
					var mydate = new Date();
					return '' + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds() + Math.round(Math.random() * 10000);
				}
			};
			//判断支持localstorage
			// function isSupportH5Localstorage() {
			//     return !!window.localStorage;
			// }
			win.resultForCallback = NativeBridge.resultForCallback;
			win.CiticsNative = {};
			CiticsNative = {
				NativeCall: function NativeCall(functionName, args, callback) {
					// alert('执行call');
					// 将args数组转化为string类型
					var strArgs = '';
					if (undefined != args && 'string' != typeof args && !(args instanceof Array)) {
						alert('NativeBridge传参args错误!');
						return;
					}
					if (undefined == args) {
						// 未传参数args
					} else if ('string' == typeof args) {
						strArgs = args;
					} else if (args instanceof Array) {
						strArgs = JSON.stringify(args);
					}
					var result = NativeBridge.call(functionName, strArgs, callback);
					if (typeof (result) == "undefined") {
						return;
					}
					if (result.errorNo == '-1') {
						alert('请先前往应用市场更新至最新版本，再回来开启该功能呦。');
						console.log(result.errorMsg);
						return;
					}
					if (result.errorNo == '0') {
						console.log(result.errorMsg);
						return result.result;
					}
					return result
				},
				isSupportNativeBridge: function isSupportNativeBridge() {
					var isSupportNB = false;
					if (IS_ANDROID) {
						if ("undefined" != typeof (window.citicsnativejs)) {
							if ("undefined" != typeof (window.citicsnativejs.nativeBridge)) {
								isSupportNB = true;
							}
						}
					} else {
						if ("undefined" != typeof (citics_native_js_nativeBridge)) {
							isSupportNB = true;
						}
					}
					return isSupportNB;
				}
			}
		})(window);
        function z_isAndroid() {
			return navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Adr") > -1;
		} 
        // 判断是否是App环境，App环境使用csValueforkey存储 开发环境以localStorage 存储
		function z_isInApp() {
			var IS_IN_APP = false;
			if (z_isAndroid()) {
				if ("undefined" != typeof window.citicsnativejs) {
					if ("undefined" != typeof window.citicsnativejs.getToken) {
						IS_IN_APP = true;
					}
				}
			} else {
				if ("undefined" != typeof citics_native_js_getToken) {
					IS_IN_APP = true;
				}
			}
			return IS_IN_APP;
		}
        function z_isExpiredCache(expiredTimeMs, cacheTimeMs) {
			var nowTime = new Date().getTime();            //当前时间
			var expireTime = cacheTimeMs + expiredTimeMs;     //过期时间
			if (nowTime > expireTime) {
				return true;
			}
			else {
				return false;
			}
		}
        window.tzt_csValueForKeyCache = {
            henjiname:'luolanhanji_erlou',
            zujiAllData:{},
            read: function read(cacheName, expiredTimeMs, resultFunction) {
                if (z_isInApp()) {
                    var param = [cacheName, ''];
                    var result = CiticsNative.NativeCall("getCSValueForKey", param);
                    if (result) {
                        try {
                            var res = JSON.parse(result);
                            if (res.errorNo == '0') {
                                returnmsg = JSON.parse(res.result)
                                var isExpired = z_isExpiredCache(expiredTimeMs, returnmsg.datatime);
                                var resultObject = returnmsg.dataline;
                                resultFunction(true, isExpired, resultObject);
                                return
                            } else {
                                resultFunction(false, true, null)
                            }
                        } catch (e) {
                            resultFunction(false, true, null)
                        }
                    } else {
                        resultFunction(false, true, null)
                    }
                } else {
                    var result = localStorage[cacheName];
                    if (result) {
                        try {
                            var returnmsg = JSON.parse(result);
                            var isExpired = z_isExpiredCache(expiredTimeMs, returnmsg.datatime);
                            var resultObject = returnmsg.dataline;
                            resultFunction(true, isExpired, resultObject);
                            return
                       } catch (error) {
                             resultFunction(false, true, null)
                        }
                    } else {
                        resultFunction(false, true, null)
                    }
                }
            },
            write: function write(cacheName, object) {
                var nowtime = new Date().getTime();
                var data = {
                    "datatime": nowtime,
                    "dataline": object
                }
                var str = JSON.stringify(data)
                if (z_isInApp()) {
                    var param = [cacheName, str];
                    var result = CiticsNative.NativeCall("setCSValueForKey", param);
                } else {
                    localStorage[cacheName] = str
                }
            },
            clear: function clear(cacheName) {
                if (z_isInApp()) {
                    var param = [cacheName, ''];
                    var result = CiticsNative.NativeCall("setCSValueForKey", param);
                } else {
                    localStorage[cacheName] = ''
                }
            },
            zujiAll:function zujiAll(fn){
                window.tzt_csValueForKeyCache.read(window.tzt_csValueForKeyCache.henjiname,0,function(dataType,timeType,data){
                    if(dataType){
                        fn(data)
                    }else{
                        fn(null)
                    }
                })
            },
            zujicunqu:function zujicunqu(fn){
                window.tzt_csValueForKeyCache.read(window.tzt_csValueForKeyCache.henjiname,0,function(dataType,timeType,data){
                    if(dataType){
                        window.tzt_csValueForKeyCache.zujiAllData = data
                        fn(data)
                    }else{
                        fn(null)
                    }
                })
            },
            setIconJiLuHenJi:function(iconID){
                // icon 存储
                window.tzt_csValueForKeyCache.zujicunqu(function(data){
                    var zujiAllData =  window.tzt_csValueForKeyCache.zujiAllData
                    if(data !== null&&zujiAllData.icon!=undefined){
                        if(zujiAllData.icon.indexOf(iconID) == -1){
                            zujiAllData.icon.unshift(iconID)
                        }else{
                            zujiAllData.icon.splice(zujiAllData.icon.indexOf(iconID),1)
                            zujiAllData.icon.unshift(iconID)
                        }
                        zujiAllData.icon = zujiAllData.icon.slice(0,20)
                        window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                        console.log(zujiAllData)
                    }else{
                        zujiAllData.icon = []
                        zujiAllData.icon.unshift(iconID)
                        window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                    }
                })
            },
            clearZuJi:function(type){
                // 清空足迹 all icon zx lc xsp
                window.tzt_csValueForKeyCache.zujicunqu(function(data){
                    var zujiAllData =  window.tzt_csValueForKeyCache.zujiAllData
                    if(type == 'all'){
                        zujiAllData = {}
                    }else{
                        zujiAllData[type] = []
                    }
                    window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                })
            },
            setZiXunJiLuHenJi:function(obj){
                 // 存入资讯浏览记录
                //  obj = {
                //     source:"上海证券报",
                //     global_id:"f86098ebfe92904379a0fc3a3f8e179f",
                //     title:"清单发布！",
                //     type:"",
                // }
                // 1:研究报告（信）、2:投顾报告（信）、3:财经要闻、4:7*24快讯、5:财富号、6:理财资讯、7:早午晚报 8：热点聚焦
                if(obj.global_id&&obj.title){
                    window.tzt_csValueForKeyCache.zujicunqu(function(data){
                        var zujiAllData =  window.tzt_csValueForKeyCache.zujiAllData
                        if(data !== null&&zujiAllData.zx!=undefined){
                            var zxArr = zujiAllData.zx
                            for(var i=0;i<zxArr.length;i++){
                                if(zxArr[i].global_id === obj.global_id){
                                    zujiAllData.zx.splice(i,1)
                                    break;
                                }
                            }
                            zujiAllData.zx.unshift(obj)
                            zujiAllData.zx = zujiAllData.zx.slice(0,50)
                            window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                            console.log(zujiAllData)
                        }else{
                            zujiAllData.zx = []
                            zujiAllData.zx.unshift(obj)
                            window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                        }
                    })
                }
            },
            setLiCaiJiLuHenJi:function(productCode){
                var json = {
                    productCode:productCode
                }
                window.tzt_csValueForKeyCache.zujicunqu(function(data){
                    var zujiAllData =  window.tzt_csValueForKeyCache.zujiAllData
                    if(data !== null&&zujiAllData.lc!=undefined){
                        var lcArr = zujiAllData.lc
                        for(var i=0;i<lcArr.length;i++){
                            if(lcArr[i].productCode === productCode){
                                zujiAllData.lc.splice(i,1)
                                break;
                            }
                        }
                        zujiAllData.lc.unshift(json)
                        zujiAllData.lc = zujiAllData.lc.slice(0,50)
                        window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                        console.log(zujiAllData)
                    }else{
                        zujiAllData.lc = []
                        zujiAllData.lc.unshift(json)
                        window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                    }
                })
            },
            setXiaoShiPinHenJi:function(options){
                // options = {
                //     coverUrl: "http://img.videocc.net/uimage/d/de48ce2bf7/6/de48ce2bf762a14ce790b82ca797df06_0_b.jpg",
                //     globalId:'8559',
                //     source:"浙江分公司",
                //     title:"彼得林奇给富达留下了什么？",
                //     sourceimg:""
                // }
                if(options.coverUrl&&options.globalId&&options.source&&options.title){
                    var json = options;
                    window.tzt_csValueForKeyCache.zujicunqu(function(data){
                        var zujiAllData =  window.tzt_csValueForKeyCache.zujiAllData
                        if(data !== null&&zujiAllData.xsp!=undefined){
                            var arr = zujiAllData.xsp
                            for(var i=0;i<arr.length;i++){
                                if(arr[i].globalId == json.globalId){
                                    zujiAllData.xsp.splice(i,1)
                                }
                            }
                            zujiAllData.xsp.unshift(json)
                            zujiAllData.xsp = zujiAllData.xsp.slice(0,50)
                            window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                            console.log(zujiAllData)
                        }else{
                            zujiAllData.xsp = []
                            zujiAllData.xsp.unshift(json)
                            window.tzt_csValueForKeyCache.write(window.tzt_csValueForKeyCache.henjiname,zujiAllData)
                        }
                    })
                }
            }
        }
        window.addEventListener('load',function(){
            var url = location.pathname;
            var search = location.search;
            var url_dizhizidian = {
                'lc':{
                    'PUBLIC':{dataID: 'PUBLIC', name: 'putong', url: '/vue/fundDetails/generalDetail/html/generalDetail.html'},//公募
                    'FIXED':{dataID: 'FIXED', name: 'dingqi', url: '/investment/otc_new/otc_info.html'}, //定期
                    'PRIVATE':{dataID: 'PRIVATE', name: 'PRIVATE', url: '/vue/siMu/siMuDetail/html/siMuDetail.html'},//私募
                    "TTLCBJ":{dataID: 'TTLCBJ', name: 'TTLCBJ', url: '/investment/product_details/html/day_details.html'},//天天利财
                    "XJB":{dataID: 'XJB', name: 'XJB', url: '/investment/product_details/html/xjb_details.html'},//信金保
                    'DHJ':{dataID:'DHJ', name: 'DHJ', url: '/investment/asset_manage_set/asset_manage_pro_details.html'},//资管大合集
                    "TTLCYT":{dataID: 'TTLCYT', name: 'TTLCYT', url: '/investment/product_details/html/sweepsingle_details.html'},//天天利财一期
                    "XJTLD":{dataID: 'XJTLD', name: 'XJTL', url: '/guang_zheng_xian_jin/views/loading.html'},//现金添利登录页
                    "XJTLX":{dataID: 'XJTLX', name: 'XJTL', url: '/guang_zheng_xian_jin/views/manager.html'},//现金添利详情页
                    "XJZZD":{dataID: 'XJZZD', name: 'XJZZ', url: '//finance/views/loading.html'},//现金增值登录页
                    "XJZZX":{dataID: 'XJZZX', name: 'XJZZ', url: '/finance/views/manager.html'},//现金增值登录页
                },
                'icon':{},
                'xsp':{},
                // 'zx':{'zixunxiangqing':{dataID: 'zx', name: '资讯', url: '/vue/shouYe/xiangQing/html/xiangQing.html'}}
            }
            console.log(url)
            // 获取cms缓存数据
            // window.tzt_csValueForKeyCache.read('icondata',0,function(datatype,timetype,data){
            //     if(datatype == true){
            //         var all_data = JSON.parse(JSON.parse(data).data[0].all)
            //         url_dizhizidian.icon = all_data;
            //     }else{
            //         console.log('无icon数据缓存')
            //     }
            // })
            for(var item_obj in url_dizhizidian){
                var obj = url_dizhizidian[item_obj];
                for(var item in obj){
                    var duibi_url = obj[item].url;
                    if(item_obj =='icon'){
                        if(duibi_url.toLowerCase() == url.toLowerCase()+search.toLowerCase()){
                            console.log('抓到了',item_obj)
                            if(item_obj =='icon'){
                                var dataID = obj[item].dataID
                                if(dataID == undefined ||dataID == ''||dataID==null){
                                    return
                                }
                                window.tzt_csValueForKeyCache.setIconJiLuHenJi(dataID)
                            }
                        }
                    }else{
                        if(duibi_url.toLowerCase() == url.toLowerCase()){
                            console.log('抓到了',item_obj)
                            if(item_obj =='zx'){
                                var globalId = T.getUrlParameter('globalId') || T.getUrlParameter('g');
                                window.tzt_csValueForKeyCache.setZiXunJiLuHenJi(globalId)
                            }
                            if(item_obj =='lc'){
                                if(item == 'DHJ'){
                                    var productCode =  T.getUrlParameter("fundcode")
                                }else if(obj[item].name == 'XJTL'){
                                    var productCode = '900055'
                                }else if(obj[item].name == 'XJZZ'){
                                    var productCode = '900016'
                                }else{
                                    var productCode =  T.getUrlParameter("productCode")
                                }
                               if(productCode == ''||productCode==undefined){
                                return
                               }
                               window.tzt_csValueForKeyCache.setLiCaiJiLuHenJi(productCode)
                            }
                        }
                    }
                }
            }
        })
    }
})(window,$);
