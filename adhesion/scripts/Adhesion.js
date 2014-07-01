/* Adhesion */

(function (Adform, undefined) {

var lib = Adform.RMB.lib;
var isIOS = lib.isIOS;
var isTouch = lib.isTouch;
var timer, gap, _sendEvent, isSetLayout;
var show = 2;
var touch = 0;
var first = 0;
var state = 'collapsed'; // collapsed, expanded, hidden
var emitter = new Adform.RMB.EventEmitter;

window.Adhesion = window.Adhesion || {
	init: init,
	close: close,
	collapse: collapse,
	expand: expand,
	hide: hide,
	screen: getScreen,
	getScale: getScale,
	on: function () { emitter.on.apply(emitter, Array.prototype.slice.call(arguments)); },
	off: function () { emitter.off.apply(emitter, Array.prototype.slice.call(arguments)); },
	isOperaMobile: lib.isOperaMobile
};

function init() {
	addInteraction();

	dhtml.sharedEvents.on('changed:state', function (s) {
		if (s == 'visible') {
			if (state == 'hidden') addInteraction();
			collapse(true);
		}
	});

	collapse(true);
}

function close() {
    dhtml.sendEvent(dhtml.CLOSE_BUTTON_PRESS);
    collapse();
}

function collapse(skip) {
	toggleOverlay();

	if ( ! skip) {
		dhtml.sharedEvents.emit('pauseVideo');
		dhtml.sendEvent(dhtml.COLLAPSE_EVENT);
	}

	emitter.emit('changed:state', state = 'collapsed');
}

function expand() {
	if (state == 'hidden') return;

	toggleOverlay(true);
	dhtml.external.resize && dhtml.external.resize('100%', '100%');
	dhtml.sendEvent(first++ > 0 ? dhtml.EXPAND_EVENT : dhtml.FIRST_EXPAND_EVENT);

	emitter.emit('changed:state', state = 'expanded');
}

function hide() {
    removeInteraction();
	emitter.emit('changed:state', state = 'hidden');
    dhtml.sendEvent(dhtml.SUPER_CLOSE_EVENT);
    dhtml.external.close && dhtml.external.close();
}

// iOS do not update screen width/height on orientation change
var sw = screen.width;
var sh = screen.height;
function getScreen() {
	var ww = parent.innerWidth;
    var wh = parent.innerHeight;

    var landscape = ww >= wh;
    var w = Math[landscape ? 'max' : 'min'](sw, sh);
    var h = Math[landscape ? 'min' : 'max'](sw, sh);

    return {width: w, height: h};
}

function getScale(bannerSize) {
	var windowWidth = parent.innerWidth;
	var windowHeight = parent.innerHeight;

	// Calculate banner width ratio from window size
	var scale = windowWidth / bannerSize.width;

	// Calculate banner height
    var fh = bannerSize.height * scale;

    // Calculate banner height in percent of window size
    var frameHeight = (fh * 100 / windowHeight) +'%';
    scale = fh / bannerSize.originalHeight;

    if ( ! isSetLayout) {
      // Set mobile position mode
      isSetLayout = true;

      if (dhtml.external.setLayout) dhtml.external.setLayout({
        width: '100%',
        height: frameHeight,
        position: 'BL',
        type: 'mobile'
      });
    } else {
      // Resize banner
      dhtml.external.resize && dhtml.external.resize('100%', frameHeight)
    }
	
	return scale;
}

function addInteraction() {
	if (isTouch) {
		lib.addEvent(parent, 'touchstart', handleTouchStart);
		lib.addEvent(parent, 'touchmove', handleTouchMove);
		lib.addEvent(parent, 'touchend', handleTouchEnd);
		if ( ! isIOS) lib.addEvent(parent, 'scroll', handleScroll); // Android only
		timer = setInterval(handleVisibility, 500);
	}
}

function removeInteraction() {
	if (isTouch) {
		lib.removeEvent(parent, 'touchstart', handleTouchStart);
		lib.removeEvent(parent, 'touchmove', handleTouchMove);
		lib.removeEvent(parent, 'touchend', handleTouchEnd);
		if ( ! isIOS)  lib.removeEvent(parent, 'scroll', handleScroll); // Android only
		clearInterval(timer);
		clearTimeout(gap);
		show = 2;
	}
}

function handleTouchStart() {
	touch++;
	show = 0;
	handleVisibility();

	// Android fire touch start event instead of guesture change event.
	if (touch > 2) handleScroll();
}

function handleTouchMove() {
	// Sometimes it is not enough of touchstart event to hide a banner
	if (touch < 2) handleTouchStart();
	if ( ! isIOS) handleScroll(); // Android only
}

function handleScroll() {
	clearTimeout(gap);
    gap = setTimeout(handleTouchEnd, 500);
}

function handleTouchEnd() {
	show = 1;
	touch = 0;
}

function handleVisibility() {
	if (show > 1 || state == 'expanded') return;
	
	var visible = (dhtml.getState() == 'visible');
	if (visible && ! show) ADFCall(dhtml.getVar('bn'), hideParent);
    if ( ! visible && show) ADFCall(dhtml.getVar('bn'), showParent);

    show = 2;
}

function hideParent() {
	_sendEvent = this.sendEvent;
    this.sendEvent = _voidSendEvent;
	this.hide();
}

function showParent() {
	this.show();
	this.sendEvent = _sendEvent;
}

function _voidSendEvent(id) {
    if (id != 24) return _sendEvent.apply(this, arguments);
    return true;
}

// Helpers
function toggleOverlay(show) {
	ADFCall(dhtml.getVar('bn'), (show ? 'showOverlay' : 'hideOverlay'));
}

function ADFCall() {
	return parent.ADFCall && parent.ADFCall.apply(parent.ADFCall, Array.prototype.slice.call(arguments));
}

})(Adform = window.Adform || {});