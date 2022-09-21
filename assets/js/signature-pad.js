<script type="application/javascript">
"use strict";var Point=function(){function t(t,e,o){this.x=t,this.y=e,this.time=o||Date.now()}return t.prototype.distanceTo=function(t){return Math.sqrt(Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2))},t.prototype.equals=function(t){return this.x===t.x&&this.y===t.y&&this.time===t.time},t.prototype.velocityFrom=function(t){return this.time!==t.time?this.distanceTo(t)/(this.time-t.time):0},t}(),Bezier=function(){function t(t,e,o,i,n,s){this.startPoint=t,this.control2=e,this.control1=o,this.endPoint=i,this.startWidth=n,this.endWidth=s}return t.fromPoints=function(e,o){var i=this.calculateControlPoints(e[0],e[1],e[2]).c2,n=this.calculateControlPoints(e[1],e[2],e[3]).c1;return new t(e[1],i,n,e[2],o.start,o.end)},t.calculateControlPoints=function(t,e,o){var i=t.x-e.x,n=t.y-e.y,s=e.x-o.x,r=e.y-o.y,h=(t.x+e.x)/2,a=(t.y+e.y)/2,c=(e.x+o.x)/2,u=(e.y+o.y)/2,d=Math.sqrt(i*i+n*n),l=Math.sqrt(s*s+r*r),v=l/(d+l),p=c+(h-c)*v,_=u+(a-u)*v,f=e.x-p,m=e.y-_;return{c1:new Point(h+f,a+m),c2:new Point(c+f,u+m)}},t.prototype.length=function(){for(var t,e,o=0,i=0;i<=10;i+=1){var n=i/10,s=this.point(n,this.startPoint.x,this.control1.x,this.control2.x,this.endPoint.x),r=this.point(n,this.startPoint.y,this.control1.y,this.control2.y,this.endPoint.y);if(i>0){var h=s-t,a=r-e;o+=Math.sqrt(h*h+a*a)}t=s,e=r}return o},t.prototype.point=function(t,e,o,i,n){return e*(1-t)*(1-t)*(1-t)+3*o*(1-t)*(1-t)*t+3*i*(1-t)*t*t+n*t*t*t},t}();function throttle(t,e){void 0===e&&(e=250);var o,i,n,s=0,r=null,h=function(){s=Date.now(),r=null,o=t.apply(i,n),r||(i=null,n=[])};return function(){for(var a=[],c=0;c<arguments.length;c++)a[c]=arguments[c];var u=Date.now(),d=e-(u-s);return i=this,n=a,d<=0||d>e?(r&&(clearTimeout(r),r=null),s=u,o=t.apply(i,n),r||(i=null,n=[])):r||(r=window.setTimeout(h,d)),o}}var SignaturePad=function(){function t(e,o){void 0===o&&(o={});var i=this;this.canvas=e,this.options=o,this._handleMouseDown=function(t){1===t.which&&(i._mouseButtonDown=!0,i._strokeBegin(t))},this._handleMouseMove=function(t){i._mouseButtonDown&&i._strokeMoveUpdate(t)},this._handleMouseUp=function(t){1===t.which&&i._mouseButtonDown&&(i._mouseButtonDown=!1,i._strokeEnd(t))},this._handleTouchStart=function(t){if(t.preventDefault(),1===t.targetTouches.length){var e=t.changedTouches[0];i._strokeBegin(e)}},this._handleTouchMove=function(t){t.preventDefault();var e=t.targetTouches[0];i._strokeMoveUpdate(e)},this._handleTouchEnd=function(t){if(t.target===i.canvas){t.preventDefault();var e=t.changedTouches[0];i._strokeEnd(e)}},this.velocityFilterWeight=o.velocityFilterWeight||.7,this.minWidth=o.minWidth||.5,this.maxWidth=o.maxWidth||2.5,this.throttle="throttle"in o?o.throttle:16,this.minDistance="minDistance"in o?o.minDistance:5,this.throttle?this._strokeMoveUpdate=throttle(t.prototype._strokeUpdate,this.throttle):this._strokeMoveUpdate=t.prototype._strokeUpdate,this.dotSize=o.dotSize||function(){return(this.minWidth+this.maxWidth)/2},this.penColor=o.penColor||"black",this.backgroundColor=o.backgroundColor||"rgba(0,0,0,0)",this.onBegin=o.onBegin,this.onEnd=o.onEnd,this._ctx=e.getContext("2d"),this.clear(),this.on()}return t.prototype.clear=function(){var t=this._ctx,e=this.canvas;t.fillStyle=this.backgroundColor,t.clearRect(0,0,e.width,e.height),t.fillRect(0,0,e.width,e.height),this._data=[],this._reset(),this._isEmpty=!0},t.prototype.fromDataURL=function(t,e,o){var i=this;void 0===e&&(e={});var n=new Image,s=e.ratio||window.devicePixelRatio||1,r=e.width||this.canvas.width/s,h=e.height||this.canvas.height/s;this._reset(),n.onload=function(){i._ctx.drawImage(n,0,0,r,h),o&&o()},n.onerror=function(t){o&&o(t)},n.src=t,this._isEmpty=!1},t.prototype.toDataURL=function(t,e){switch(void 0===t&&(t="image/png"),t){case"image/svg+xml":return this._toSVG();default:return this.canvas.toDataURL(t,e)}},t.prototype.on=function(){this.canvas.style.touchAction="none",this.canvas.style.msTouchAction="none",window.PointerEvent?this._handlePointerEvents():(this._handleMouseEvents(),"ontouchstart"in window&&this._handleTouchEvents())},t.prototype.off=function(){this.canvas.style.touchAction="auto",this.canvas.style.msTouchAction="auto",this.canvas.removeEventListener("pointerdown",this._handleMouseDown),this.canvas.removeEventListener("pointermove",this._handleMouseMove),document.removeEventListener("pointerup",this._handleMouseUp),this.canvas.removeEventListener("mousedown",this._handleMouseDown),this.canvas.removeEventListener("mousemove",this._handleMouseMove),document.removeEventListener("mouseup",this._handleMouseUp),this.canvas.removeEventListener("touchstart",this._handleTouchStart),this.canvas.removeEventListener("touchmove",this._handleTouchMove),this.canvas.removeEventListener("touchend",this._handleTouchEnd)},t.prototype.isEmpty=function(){return this._isEmpty},t.prototype.fromData=function(t){var e=this;this.clear(),this._fromData(t,function(t){var o=t.color,i=t.curve;return e._drawCurve({color:o,curve:i})},function(t){var o=t.color,i=t.point;return e._drawDot({color:o,point:i})}),this._data=t},t.prototype.toData=function(){return this._data},t.prototype._strokeBegin=function(t){var e={color:this.penColor,points:[]};this._data.push(e),this._reset(),this._strokeUpdate(t),"function"==typeof this.onBegin&&this.onBegin(t)},t.prototype._strokeUpdate=function(t){var e=t.clientX,o=t.clientY,i=this._createPoint(e,o),n=this._data[this._data.length-1],s=n.points,r=s.length>0&&s[s.length-1],h=!!r&&i.distanceTo(r)<=this.minDistance,a=n.color;if(!r||!r||!h){var c=this._addPoint(i);r?c&&this._drawCurve({color:a,curve:c}):this._drawDot({color:a,point:i}),s.push({time:i.time,x:i.x,y:i.y})}},t.prototype._strokeEnd=function(t){this._strokeUpdate(t),"function"==typeof this.onEnd&&this.onEnd(t)},t.prototype._handlePointerEvents=function(){this._mouseButtonDown=!1,this.canvas.addEventListener("pointerdown",this._handleMouseDown),this.canvas.addEventListener("pointermove",this._handleMouseMove),document.addEventListener("pointerup",this._handleMouseUp)},t.prototype._handleMouseEvents=function(){this._mouseButtonDown=!1,this.canvas.addEventListener("mousedown",this._handleMouseDown),this.canvas.addEventListener("mousemove",this._handleMouseMove),document.addEventListener("mouseup",this._handleMouseUp)},t.prototype._handleTouchEvents=function(){this.canvas.addEventListener("touchstart",this._handleTouchStart),this.canvas.addEventListener("touchmove",this._handleTouchMove),this.canvas.addEventListener("touchend",this._handleTouchEnd)},t.prototype._reset=function(){this._lastPoints=[],this._lastVelocity=0,this._lastWidth=(this.minWidth+this.maxWidth)/2,this._ctx.fillStyle=this.penColor},t.prototype._createPoint=function(t,e){var o=this.canvas.getBoundingClientRect();return new Point(t-o.left,e-o.top,(new Date).getTime())},t.prototype._addPoint=function(t){var e=this._lastPoints;if(e.push(t),e.length>2){3===e.length&&e.unshift(e[0]);var o=this._calculateCurveWidths(e[1],e[2]),i=Bezier.fromPoints(e,o);return e.shift(),i}return null},t.prototype._calculateCurveWidths=function(t,e){var o=this.velocityFilterWeight*e.velocityFrom(t)+(1-this.velocityFilterWeight)*this._lastVelocity,i=this._strokeWidth(o),n={end:i,start:this._lastWidth};return this._lastVelocity=o,this._lastWidth=i,n},t.prototype._strokeWidth=function(t){return Math.max(this.maxWidth/(t+1),this.minWidth)},t.prototype._drawCurveSegment=function(t,e,o){var i=this._ctx;i.moveTo(t,e),i.arc(t,e,o,0,2*Math.PI,!1),this._isEmpty=!1},t.prototype._drawCurve=function(t){var e=t.color,o=t.curve,i=this._ctx,n=o.endWidth-o.startWidth,s=2*Math.floor(o.length());i.beginPath(),i.fillStyle=e;for(var r=0;r<s;r+=1){var h=r/s,a=h*h,c=a*h,u=1-h,d=u*u,l=d*u,v=l*o.startPoint.x;v+=3*d*h*o.control1.x,v+=3*u*a*o.control2.x,v+=c*o.endPoint.x;var p=l*o.startPoint.y;p+=3*d*h*o.control1.y,p+=3*u*a*o.control2.y,p+=c*o.endPoint.y;var _=o.startWidth+c*n;this._drawCurveSegment(v,p,_)}i.closePath(),i.fill()},t.prototype._drawDot=function(t){var e=t.color,o=t.point,i=this._ctx,n="function"==typeof this.dotSize?this.dotSize():this.dotSize;i.beginPath(),this._drawCurveSegment(o.x,o.y,n),i.closePath(),i.fillStyle=e,i.fill()},t.prototype._fromData=function(t,e,o){for(var i=0,n=t;i<n.length;i++){var s=n[i],r=s.color,h=s.points;if(h.length>1)for(var a=0;a<h.length;a+=1){var c=h[a],u=new Point(c.x,c.y,c.time);this.penColor=r,0===a&&this._reset();var d=this._addPoint(u);d&&e({color:r,curve:d})}else this._reset(),o({color:r,point:h[0]})}},t.prototype._toSVG=function(){var t=this,e=this._data,o=Math.max(window.devicePixelRatio||1,1),i=this.canvas.width/o,n=this.canvas.height/o,s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("width",this.canvas.width.toString()),s.setAttribute("height",this.canvas.height.toString()),this._fromData(e,function(t){var e=t.color,o=t.curve,i=document.createElement("path");if(!(isNaN(o.control1.x)||isNaN(o.control1.y)||isNaN(o.control2.x)||isNaN(o.control2.y))){var n="M "+o.startPoint.x.toFixed(3)+","+o.startPoint.y.toFixed(3)+" C "+o.control1.x.toFixed(3)+","+o.control1.y.toFixed(3)+" "+o.control2.x.toFixed(3)+","+o.control2.y.toFixed(3)+" "+o.endPoint.x.toFixed(3)+","+o.endPoint.y.toFixed(3);i.setAttribute("d",n),i.setAttribute("stroke-width",(2.25*o.endWidth).toFixed(3)),i.setAttribute("stroke",e),i.setAttribute("fill","none"),i.setAttribute("stroke-linecap","round"),s.appendChild(i)}},function(e){var o=e.color,i=e.point,n=document.createElement("circle"),r="function"==typeof t.dotSize?t.dotSize():t.dotSize;n.setAttribute("r",r.toString()),n.setAttribute("cx",i.x.toString()),n.setAttribute("cy",i.y.toString()),n.setAttribute("fill",o),s.appendChild(n)});var r='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 '+i+" "+n+'" width="'+i+'" height="'+n+'">',h=s.innerHTML;if(void 0===h){var a=document.createElement("dummy"),c=s.childNodes;a.innerHTML="";for(var u=0;u<c.length;u+=1)a.appendChild(c[u].cloneNode(!0));h=a.innerHTML}return"data:image/svg+xml;base64,"+btoa(r+h+"</svg>")},t}();
var canvas = document.getElementById('signature-pad');
var signaturePad = new SignaturePad(canvas, {
  // Necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
  backgroundColor: 'rgb(255, 255, 255)'
});

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas;
resizeCanvas();

function download(dataURL, filename) {
  var blob = dataURLToBlob(dataURL);
  var url = window.URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  var parts = dataURL.split(';base64,');
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

document.getElementById('save-png').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }

  var data = signaturePad.toDataURL('image/png');
  download(data, "signature.png");
});

document.getElementById('save-jpeg').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }

  var data = signaturePad.toDataURL('image/jpeg');
  download(data, "signature.jpg");
});

document.getElementById('save-svg').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }

  var data = signaturePad.toDataURL('image/svg+xml');
  console.log(atob(data.split(',')[1]));
  download(data, "signature.svg");
});

document.getElementById('clear').addEventListener('click', function () {
  signaturePad.clear();
});
</script>
