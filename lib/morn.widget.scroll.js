'use strict';

define('widget.scroll', ['core', 'event', 'dom'], function($) {
	$.widget.prototype.scroll = function(opt) {
		var option = opt || {};
		return this.forEach(function(ele){
				var contentTop = 0,
					scrollbar = $.createDom('<div class="scroll-bar"><div class="track"></div><div class="thumb"></div></div><div class="inner"></div>');
				$(scrollbar[1]).append(ele.childNodes);
				var wrap = $(ele).append(scrollbar),
					inner = $.classStyle('inner', ele)[0],
					thumb = $.classStyle('thumb', ele)[0],
					track = $.classStyle('track', ele)[0],
					mouseStartY,
					_thumbTop = 0,
					thumbTop = 0,
					thumbHeight = 40,
					contentHeight = parseInt(window.getComputedStyle(inner).height),
					frameHeight = parseInt($(wrap).getComputedStyle().height),
					trackHeight = frameHeight - thumbHeight,
					totalHeight = contentHeight - frameHeight;
				
				function nil(e){
					var event = $.event(e);
					e.preventDefault();
				}
				
				function startDrag(e) {
					mouseStartY = e.screenY;
					$(document.documentElement).addEventHandler('dragstart', nil);
					$(document.documentElement).addEventHandler('selectstart', nil);
					$(document.documentElement).addEventHandler('mousemove', drag);
					$(document.documentElement).addEventHandler('mouseup', endDrag);
				}

				function drag(e) {
					var change = e.screenY - mouseStartY;
					_thumbTop = change + thumbTop;
					if (_thumbTop > trackHeight) {
						_thumbTop = trackHeight;
					} else if (_thumbTop < 0){
						_thumbTop = 0;   
					}
				}

				function endDrag() {
					$(document.documentElement).removeEventHandler('mousemove',drag);
					thumbTop = _thumbTop;
					$(document.documentElement).removeEventHandler('mouseup',endDrag);
					$(document.documentElement).removeEventHandler('dragstart', nil);
					$(document.documentElement).removeEventHandler('selectstart', nil);
				}
				
				function scrollTo(e) {
					thumbTop = e.layerY - thumbHeight / 2;
					if (thumbTop < 0) {
						thumbTop = 0;
					} else if (thumbTop > trackHeight) {
						thumbTop = trackHeight;
					}
					contentTop = -(thumbTop / trackHeight) * totalHeight;
					thumb.style.top = thumbTop + 'px';
					inner.style.top = contentTop + 'px';
				}
				
				$(track).addEventHandler('click', scrollTo);
				
				$(thumb).addEventHandler('mousedown', startDrag);
				
				$(wrap).addEventHandler('mousewheel', function(e){
					contentTop += -e.deltaY;
					if (contentTop < -totalHeight) {
						contentTop = -totalHeight;
					} else if (contentTop > 0) {
						contentTop = 0;
					} else {
						e.preventDefault();
					}
					inner.style.top = contentTop + 'px';
					thumbTop = - (contentTop / totalHeight) * trackHeight;
					thumb.style.top = thumbTop + 'px';
				});
				//console.log(change);
				contentTop = -(_thumbTop / trackHeight) * totalHeight;
				inner.style.top = contentTop.toFixed(0) + 'px';
				thumb.style.top = _thumbTop + 'px';
			});
		};
});