/*
 	calling 'prefix' in the given browser (Ex: Chrome) returns an object:
 	Object {dom: "WebKit", lowercase: "webkit", css: "-webkit-", js: "Webkit"}
 	
 	Can be used with jquery $.css() method, ex:
 	
 	BEFORE**:
 		$frame.find('.right').css({ '-webkit-transform': 'rotateY(90deg) translateZ('+(newWidth-(depth/2))+'px)' });
 		
 	AFTER**:
 		$frame.find('.right').css({ prefix.css + 'transform': 'rotateY(90deg) translateZ('+(newWidth-(depth/2))+'px)' });
 */
prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();