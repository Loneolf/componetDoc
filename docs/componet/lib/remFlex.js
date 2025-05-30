// --------------------------------------------------
// meta标签
var metaHTML = `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="format-detection" content="telephone=no,email=no,adress=no">
  <meta name="screen-orientation" content="portrait">
  <meta name="x5-fullscreen" content="true">
  <meta name="x5-orientation" content="portrait">
  <meta name="full-screen" content="yes">
  <meta name="screen-orientation" content="portrait">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">`
document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', metaHTML);
// --------------------------------------------------
// 响应式自适应
(function (doc, win) {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  var recalc = function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) { return }
    if (clientWidth > 750) { clientWidth = 750 }
    docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
  }
  if (!doc.addEventListener) { return }
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
