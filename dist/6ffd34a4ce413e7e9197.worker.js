!function(t){var n={};function r(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=n,r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:e})},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r.p="/",r(r.s="eROv")}({"+E39":function(t,n,r){t.exports=!r("S82l")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},"+ZMJ":function(t,n,r){var e=r("lOnJ");t.exports=function(t,n,r){if(e(t),void 0===n)return t;switch(r){case 1:return function(r){return t.call(n,r)};case 2:return function(r,e){return t.call(n,r,e)};case 3:return function(r,e,o){return t.call(n,r,e,o)}}return function(){return t.apply(n,arguments)}}},"+tPU":function(t,n,r){r("xGkn");for(var e=r("7KvD"),o=r("hJx8"),i=r("/bQp"),u=r("dSzd")("toStringTag"),c="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),f=0;f<c.length;f++){var a=c[f],s=e[a],l=s&&s.prototype;l&&!l[u]&&o(l,u,a),i[a]=i.Array}},"/bQp":function(t,n){t.exports={}},"06OY":function(t,n,r){var e=r("3Eo+")("meta"),o=r("EqjI"),i=r("D2L2"),u=r("evD5").f,c=0,f=Object.isExtensible||function(){return!0},a=!r("S82l")(function(){return f(Object.preventExtensions({}))}),s=function(t){u(t,e,{value:{i:"O"+ ++c,w:{}}})},l=t.exports={KEY:e,NEED:!1,fastKey:function(t,n){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,e)){if(!f(t))return"F";if(!n)return"E";s(t)}return t[e].i},getWeak:function(t,n){if(!i(t,e)){if(!f(t))return!0;if(!n)return!1;s(t)}return t[e].w},onFreeze:function(t){return a&&l.NEED&&f(t)&&!i(t,e)&&s(t),t}}},"1kS7":function(t,n){n.f=Object.getOwnPropertySymbols},"2KxR":function(t,n){t.exports=function(t,n,r,e){if(!(t instanceof n)||void 0!==e&&e in t)throw TypeError(r+": incorrect invocation!");return t}},"3C/1":function(t,n,r){r("M6a0"),r("zQR9"),r("+tPU"),r("qCoq"),r("UvrK"),r("Xjd4"),r("bqnK"),t.exports=r("FeBl").Map},"3Eo+":function(t,n){var r=0,e=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++r+e).toString(36))}},"3fs2":function(t,n,r){var e=r("RY/4"),o=r("dSzd")("iterator"),i=r("/bQp");t.exports=r("FeBl").getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[e(t)]}},"4WTo":function(t,n,r){var e=r("NWt+");t.exports=function(t,n){var r=[];return e(t,!1,r.push,r,n),r}},"4mcu":function(t,n){t.exports=function(){}},"52gC":function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},"5PlU":function(t,n,r){var e=r("RY/4"),o=r("dSzd")("iterator"),i=r("/bQp");t.exports=r("FeBl").isIterable=function(t){var n=Object(t);return void 0!==n[o]||"@@iterator"in n||i.hasOwnProperty(e(n))}},"5zde":function(t,n,r){r("zQR9"),r("qyJz"),t.exports=r("FeBl").Array.from},"77Pl":function(t,n,r){var e=r("EqjI");t.exports=function(t){if(!e(t))throw TypeError(t+" is not an object!");return t}},"7Doy":function(t,n,r){var e=r("EqjI"),o=r("7UMu"),i=r("dSzd")("species");t.exports=function(t){var n;return o(t)&&("function"!=typeof(n=t.constructor)||n!==Array&&!o(n.prototype)||(n=void 0),e(n)&&null===(n=n[i])&&(n=void 0)),void 0===n?Array:n}},"7KvD":function(t,n){var r=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},"7UMu":function(t,n,r){var e=r("R9M2");t.exports=Array.isArray||function(t){return"Array"==e(t)}},"880/":function(t,n,r){t.exports=r("hJx8")},"94VQ":function(t,n,r){"use strict";var e=r("Yobk"),o=r("X8DO"),i=r("e6n0"),u={};r("hJx8")(u,r("dSzd")("iterator"),function(){return this}),t.exports=function(t,n,r){t.prototype=e(u,{next:o(1,r)}),i(t,n+" Iterator")}},"9Bbf":function(t,n,r){"use strict";var e=r("kM2E");t.exports=function(t){e(e.S,t,{of:function(){for(var t=arguments.length,n=new Array(t);t--;)n[t]=arguments[t];return new this(n)}})}},"9C8M":function(t,n,r){"use strict";var e=r("evD5").f,o=r("Yobk"),i=r("xH/j"),u=r("+ZMJ"),c=r("2KxR"),f=r("NWt+"),a=r("vIB/"),s=r("EGZi"),l=r("bRrM"),v=r("+E39"),p=r("06OY").fastKey,d=r("LIJb"),h=v?"_s":"size",y=function(t,n){var r,e=p(n);if("F"!==e)return t._i[e];for(r=t._f;r;r=r.n)if(r.k==n)return r};t.exports={getConstructor:function(t,n,r,a){var s=t(function(t,e){c(t,s,n,"_i"),t._t=n,t._i=o(null),t._f=void 0,t._l=void 0,t[h]=0,void 0!=e&&f(e,r,t[a],t)});return i(s.prototype,{clear:function(){for(var t=d(this,n),r=t._i,e=t._f;e;e=e.n)e.r=!0,e.p&&(e.p=e.p.n=void 0),delete r[e.i];t._f=t._l=void 0,t[h]=0},delete:function(t){var r=d(this,n),e=y(r,t);if(e){var o=e.n,i=e.p;delete r._i[e.i],e.r=!0,i&&(i.n=o),o&&(o.p=i),r._f==e&&(r._f=o),r._l==e&&(r._l=i),r[h]--}return!!e},forEach:function(t){d(this,n);for(var r,e=u(t,arguments.length>1?arguments[1]:void 0,3);r=r?r.n:this._f;)for(e(r.v,r.k,this);r&&r.r;)r=r.p},has:function(t){return!!y(d(this,n),t)}}),v&&e(s.prototype,"size",{get:function(){return d(this,n)[h]}}),s},def:function(t,n,r){var e,o,i=y(t,n);return i?i.v=r:(t._l=i={i:o=p(n,!0),k:n,v:r,p:e=t._l,n:void 0,r:!1},t._f||(t._f=i),e&&(e.n=i),t[h]++,"F"!==o&&(t._i[o]=i)),t},getEntry:y,setStrong:function(t,n,r){a(t,n,function(t,r){this._t=d(t,n),this._k=r,this._l=void 0},function(){for(var t=this._k,n=this._l;n&&n.r;)n=n.p;return this._t&&(this._l=n=n?n.n:this._t._f)?s(0,"keys"==t?n.k:"values"==t?n.v:[n.k,n.v]):(this._t=void 0,s(1))},r?"entries":"values",!r,!0),l(n)}}},ALrJ:function(t,n,r){var e=r("+ZMJ"),o=r("MU5D"),i=r("sB3e"),u=r("QRG4"),c=r("oeOm");t.exports=function(t,n){var r=1==t,f=2==t,a=3==t,s=4==t,l=6==t,v=5==t||l,p=n||c;return function(n,c,d){for(var h,y,x=i(n),g=o(x),_=e(c,d,3),b=u(g.length),m=0,S=r?p(n,b):f?p(n,0):void 0;b>m;m++)if((v||m in g)&&(y=_(h=g[m],m,x),t))if(r)S[m]=y;else if(y)switch(t){case 3:return!0;case 5:return h;case 6:return m;case 2:S.push(h)}else if(s)return!1;return l?-1:a||s?s:S}}},BDhv:function(t,n,r){var e=r("kM2E");e(e.P+e.R,"Set",{toJSON:r("m9gC")("Set")})},BO1k:function(t,n,r){t.exports={default:r("fxRn"),__esModule:!0}},D2L2:function(t,n){var r={}.hasOwnProperty;t.exports=function(t,n){return r.call(t,n)}},EGZi:function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},EqjI:function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},FeBl:function(t,n){var r=t.exports={version:"2.5.5"};"number"==typeof __e&&(__e=r)},HpRW:function(t,n,r){"use strict";var e=r("kM2E"),o=r("lOnJ"),i=r("+ZMJ"),u=r("NWt+");t.exports=function(t){e(e.S,t,{from:function(t){var n,r,e,c,f=arguments[1];return o(this),(n=void 0!==f)&&o(f),void 0==t?new this:(r=[],n?(e=0,c=i(f,arguments[2],2),u(t,!1,function(t){r.push(c(t,e++))})):u(t,!1,r.push,r),new this(r))}})}},Ibhu:function(t,n,r){var e=r("D2L2"),o=r("TcQ7"),i=r("vFc/")(!1),u=r("ax3d")("IE_PROTO");t.exports=function(t,n){var r,c=o(t),f=0,a=[];for(r in c)r!=u&&e(c,r)&&a.push(r);for(;n.length>f;)e(c,r=n[f++])&&(~i(a,r)||a.push(r));return a}},LIJb:function(t,n,r){var e=r("EqjI");t.exports=function(t,n){if(!e(t)||t._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return t}},M6a0:function(t,n){},MU5D:function(t,n,r){var e=r("R9M2");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==e(t)?t.split(""):Object(t)}},Mhyx:function(t,n,r){var e=r("/bQp"),o=r("dSzd")("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(e.Array===t||i[o]===t)}},MmMw:function(t,n,r){var e=r("EqjI");t.exports=function(t,n){if(!e(t))return t;var r,o;if(n&&"function"==typeof(r=t.toString)&&!e(o=r.call(t)))return o;if("function"==typeof(r=t.valueOf)&&!e(o=r.call(t)))return o;if(!n&&"function"==typeof(r=t.toString)&&!e(o=r.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},"NWt+":function(t,n,r){var e=r("+ZMJ"),o=r("msXi"),i=r("Mhyx"),u=r("77Pl"),c=r("QRG4"),f=r("3fs2"),a={},s={};(n=t.exports=function(t,n,r,l,v){var p,d,h,y,x=v?function(){return t}:f(t),g=e(r,l,n?2:1),_=0;if("function"!=typeof x)throw TypeError(t+" is not iterable!");if(i(x)){for(p=c(t.length);p>_;_++)if((y=n?g(u(d=t[_])[0],d[1]):g(t[_]))===a||y===s)return y}else for(h=x.call(t);!(d=h.next()).done;)if((y=o(h,g,d.value,n))===a||y===s)return y}).BREAK=a,n.RETURN=s},NpIQ:function(t,n){n.f={}.propertyIsEnumerable},O4g8:function(t,n){t.exports=!0},ON07:function(t,n,r){var e=r("EqjI"),o=r("7KvD").document,i=e(o)&&e(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},PzxK:function(t,n,r){var e=r("D2L2"),o=r("sB3e"),i=r("ax3d")("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),e(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},QRG4:function(t,n,r){var e=r("UuGF"),o=Math.min;t.exports=function(t){return t>0?o(e(t),9007199254740991):0}},R4wc:function(t,n,r){var e=r("kM2E");e(e.S+e.F,"Object",{assign:r("To3L")})},R9M2:function(t,n){var r={}.toString;t.exports=function(t){return r.call(t).slice(8,-1)}},RPLV:function(t,n,r){var e=r("7KvD").document;t.exports=e&&e.documentElement},"RY/4":function(t,n,r){var e=r("R9M2"),o=r("dSzd")("toStringTag"),i="Arguments"==e(function(){return arguments}());t.exports=function(t){var n,r,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,n){try{return t[n]}catch(t){}}(n=Object(t),o))?r:i?e(n):"Object"==(u=e(n))&&"function"==typeof n.callee?"Arguments":u}},S82l:function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},SfB7:function(t,n,r){t.exports=!r("+E39")&&!r("S82l")(function(){return 7!=Object.defineProperty(r("ON07")("div"),"a",{get:function(){return 7}}).a})},TcQ7:function(t,n,r){var e=r("MU5D"),o=r("52gC");t.exports=function(t){return e(o(t))}},To3L:function(t,n,r){"use strict";var e=r("lktj"),o=r("1kS7"),i=r("NpIQ"),u=r("sB3e"),c=r("MU5D"),f=Object.assign;t.exports=!f||r("S82l")(function(){var t={},n={},r=Symbol(),e="abcdefghijklmnopqrst";return t[r]=7,e.split("").forEach(function(t){n[t]=t}),7!=f({},t)[r]||Object.keys(f({},n)).join("")!=e})?function(t,n){for(var r=u(t),f=arguments.length,a=1,s=o.f,l=i.f;f>a;)for(var v,p=c(arguments[a++]),d=s?e(p).concat(s(p)):e(p),h=d.length,y=0;h>y;)l.call(p,v=d[y++])&&(r[v]=p[v]);return r}:f},UuGF:function(t,n){var r=Math.ceil,e=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?e:r)(t)}},UvrK:function(t,n,r){var e=r("kM2E");e(e.P+e.R,"Map",{toJSON:r("m9gC")("Map")})},V3tA:function(t,n,r){r("R4wc"),t.exports=r("FeBl").Object.assign},X8DO:function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},Xd32:function(t,n,r){r("+tPU"),r("zQR9"),t.exports=r("5PlU")},Xjd4:function(t,n,r){r("9Bbf")("Map")},Ya8g:function(t,n){},Yobk:function(t,n,r){var e=r("77Pl"),o=r("qio6"),i=r("xnc9"),u=r("ax3d")("IE_PROTO"),c=function(){},f=function(){var t,n=r("ON07")("iframe"),e=i.length;for(n.style.display="none",r("RPLV").appendChild(n),n.src="javascript:",(t=n.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),f=t.F;e--;)delete f.prototype[i[e]];return f()};t.exports=Object.create||function(t,n){var r;return null!==t?(c.prototype=e(t),r=new c,c.prototype=null,r[u]=t):r=f(),void 0===n?r:o(r,n)}},ax3d:function(t,n,r){var e=r("e8AB")("keys"),o=r("3Eo+");t.exports=function(t){return e[t]||(e[t]=o(t))}},bRrM:function(t,n,r){"use strict";var e=r("7KvD"),o=r("FeBl"),i=r("evD5"),u=r("+E39"),c=r("dSzd")("species");t.exports=function(t){var n="function"==typeof o[t]?o[t]:e[t];u&&n&&!n[c]&&i.f(n,c,{configurable:!0,get:function(){return this}})}},bqnK:function(t,n,r){r("HpRW")("Map")},"c/Tr":function(t,n,r){t.exports={default:r("5zde"),__esModule:!0}},d7EF:function(t,n,r){"use strict";n.__esModule=!0;var e=i(r("us/S")),o=i(r("BO1k"));function i(t){return t&&t.__esModule?t:{default:t}}n.default=function(){return function(t,n){if(Array.isArray(t))return t;if((0,e.default)(Object(t)))return function(t,n){var r=[],e=!0,i=!1,u=void 0;try{for(var c,f=(0,o.default)(t);!(e=(c=f.next()).done)&&(r.push(c.value),!n||r.length!==n);e=!0);}catch(t){i=!0,u=t}finally{try{!e&&f.return&&f.return()}finally{if(i)throw u}}return r}(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()},dSzd:function(t,n,r){var e=r("e8AB")("wks"),o=r("3Eo+"),i=r("7KvD").Symbol,u="function"==typeof i;(t.exports=function(t){return e[t]||(e[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=e},dY0y:function(t,n,r){var e=r("dSzd")("iterator"),o=!1;try{var i=[7][e]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,n){if(!n&&!o)return!1;var r=!1;try{var i=[7],u=i[e]();u.next=function(){return{done:r=!0}},i[e]=function(){return u},t(i)}catch(t){}return r}},e6n0:function(t,n,r){var e=r("evD5").f,o=r("D2L2"),i=r("dSzd")("toStringTag");t.exports=function(t,n,r){t&&!o(t=r?t:t.prototype,i)&&e(t,i,{configurable:!0,value:n})}},e8AB:function(t,n,r){var e=r("7KvD"),o=e["__core-js_shared__"]||(e["__core-js_shared__"]={});t.exports=function(t){return o[t]||(o[t]={})}},eROv:function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var e=r("c/Tr"),o=r.n(e),i=r("lHA8"),u=r.n(i),c=r("ifoU"),f=r.n(c),a=r("woOf"),s=r.n(a),l=r("d7EF"),v=r.n(l),p=r("Ya8g");r.n(p);self.onmessage=function(t){var n=t.data,r={id:n.id,error:!1,data:null};!function(t,n,r){switch(t){case"analyze":r.data=function(t){var n=t.maze,r=t.starts,e=t.ends;function i(t,n){return t+", "+n}function c(t,r){return n[t]&&n[t][r]||w.get(i(t,r))||d}function a(t,n,r){return r?j[t]&&j[t][n]:j[t]&&j[t][n]||O.get(i(t,n))||{dist:1/0,orientation:"",parent:NaN,dirParent:""}}function l(t,n,r,e,o){var u=i(t,n);if(!S.has(u)){var c=a(t,n,!0);c&&(c.dist=r,c.parent=e,c.dirParent=o,c.orientation=o,S.set(u,[t,n]))}}var p={d:0,u:0,r:1,l:-1,"-d":0,"-u":0,"-r":-1,"-l":1},h={d:1,u:-1,r:0,l:0,"-d":-1,"-u":1,"-r":0,"-l":0},y={u:"u",d:"d",r:"r",l:"l","-u":"d","-d":"u","-r":"l","-l":"r"},x={u:0,d:0,l:1,r:1,"-u":0,"-d":0,"-l":1,"-r":1};function g(t,n,r,e,o){var u=a(t,n),f=y[u.orientation],s=x[f],l=r.slice(),d=e?1:0;o||(l[s]=f),(e||o)&&(l[s=(s+1)%2]=y["-"+l[s]],f=e?l.join(""):l[s]);var g=function t(n,r,e){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;var i=c(n,r);var u=(o+1)%2;var f=e[u];var a=e[o];var s=void 0,l=void 0;var d=0;if(i[f]){var y=n+p[f],x=r+h[f],g=t(y,x,e,u),_=v()(g,3);s=_[0],l=_[1],d=_[2],i[a]&&d++}else if(i[a]){var b=n+p[a],m=r+h[a],S=t(b,m,e,o),M=v()(S,3);s=M[0],l=M[1],d=M[2]}else s=n,l=r;return[s,l,d]}(t,n,l,s),_=v()(g,3),b=_[0],m=_[1],S=_[2];return[b,m,S=S>1?S-1:0,d,l,f,i(b,m)]}function _(t,n){function r(t,n){var r=v()(t,7),e=r[0],o=r[1],i=r[2],u=r[3],c=r[4],f=r[5],a=r[6];return{id:a+"-"+c.join(","),cid:a,x:e,y:o,position:c,mvt:f,cost:n,complex:i,hard:u}}var e=c(t,n),o=[e.d?"u":"d",e.l?"r":"l"],u=[r([t,n,0,0,o,"",i(t,n)],0)],a=performance.now(),s=function(t){var n=t.initValues,r=t.computeNext,e=t.checkEnd,o=new f.a,i=void 0,u=n.map(function(t){return{v:t,id:t.id,d:0,dh:t.cost,parent:null}});function c(t,n){return n.dh-t.dh||n.d-t.d}var a=function(){u.sort(c);var t=u.pop();if(o.set(t.id,t),e(t.v))return i=t,"break";var n=t.d+t.v.cost,f=r(t.v);f.forEach(function(r){if(!o.has(r.id)){var e=u.find(function(t){return t.id===r.id});e?e.dh>n+r.cost&&(e.v=r,e.d=n,e.dh=n+r.cost,e.parent=t.id):u.push({v:r,id:r.id,d:n,dh:n+r.cost,parent:t.id})}})};do{var s=a();if("break"===s)break}while(u.length);var l=[],v=[],p=0,d=0;for(;i;)l.push(i.v),v.push(i.v.mvt),p+=i.v.complex,d+=i.v.hard,i=o.get(i.parent);return[v.reverse(),p,d,l.reverse()]}({initValues:u,computeNext:function(t){var n=t.x,e=t.y,o=t.position,i=g(n,e,o,!1,!1),u=g(n,e,o,!1,!0),c=g(n,e,o,!0,!1);return[r(i,1),r(u,1),r(c,10)]},checkEnd:function(t){return E.has(t.cid)}});return console.log("Aetoile",performance.now()-a),s}function b(t,n){t.forEach(function(r,e){var o=v()(r,2),u=o[0],f=o[1],a=s()({},d),l={dist:n,orientation:"",parent:NaN,dirParent:""};t.has(i(u+1,f))?a.r=!0:c(u+1,f).l&&(a.r=!0,l.orientation="r"),t.has(i(u-1,f))?a.l=!0:c(u-1,f).r&&(a.l=!0,l.orientation="l"),t.has(i(u,f+1))?a.d=!0:c(u,f+1).u&&(a.d=!0,l.orientation="d"),t.has(i(u,f-1))?a.u=!0:c(u,f-1).d&&(a.u=!0,l.orientation="u"),w.set(e,a),O.set(e,l)})}var m=performance.now(),S=new f.a,M=new f.a(r.map(function(t){return[t,t.split(/,\s*/).map(function(t){return+t})]})),E=new f.a(e.map(function(t){return[t,t.split(/,\s*/).map(function(t){return+t})]})),w=new f.a,O=new f.a;b(M,0),b(E,1/0);for(var k=n.length,j=new Array(k),P=0;P<k;P++){var R=n[P],A=R.length;j[P]=new Array(A);for(var D=0;D<A;D++)j[P][D]={dist:1/0,orientation:"",parent:NaN,dirParent:""}}M.forEach(function(t,n){S.set(n,t)}),S.forEach(function(t){var r=v()(t,2),e=r[0],o=r[1];!function(t,r){var e=i(t,r),o=n[t]&&n[t][r],u=void 0;o?u=a(t,r).dist+1:(u=1,o={u:c(t,r-1).d,d:c(t,r+1).u,r:c(t+1,r).l,l:c(t-1,r).r});o.u&&l(t,r-1,u,e,"d");o.d&&l(t,r+1,u,e,"u");o.r&&l(t+1,r,u,e,"l");o.l&&l(t-1,r,u,e,"r")}(e,o)});var L=new u.a,T=function(){var t=void 0,n=void 0,r=1/0;if(E.forEach(function(e){var o=v()(e,2),u=o[0],f=o[1],s=void 0;c(u+1,f).l&&(s=a(u+1,f).dist)<r&&(r=s,t=i(u+1,f),n="r"),c(u-1,f).r&&(s=a(u-1,f).dist)<r&&(r=s,t=i(u-1,f),n="l"),c(u,f+1).u&&(s=a(u,f+1).dist)<r&&(r=s,t=i(u,f+1),n="d"),c(u,f-1).d&&(s=a(u,f-1).dist)<r&&(r=s,t=i(u,f-1),n="u")}),isFinite(r)){var e=r;do{var o=t.split(", ").map(function(t){return+t}),u=v()(o,2),f=u[0],s=u[1],l=a(f,s);L.add(t),l.orientation="-"+n,n=l.dirParent,t=l.parent,e=l.dist}while(e>1);L.add(t)}return r}(),B=[],z=0,F=0;isFinite(T)&&M.forEach(function(t,n){var r=v()(t,2),e=r[0],o=r[1];if(L.has(n)){var i=_(e,o),u=v()(i,3);B=u[0],z=u[1],F=u[2]}});return console.log("analyze (in worker):",performance.now()-m),{nbCellAccessible:S.size,nbShortestPath:T,shortestPath:o()(L),cells:j,accessible:o()(S.keys()),movements:B,complexMovements:z,hardMovements:F}}(n);break;default:r.error=!0,r.data='Action "'+t+'" is not implemented.'}}(n.action,n.data,r),self.postMessage(r)};var d={u:!1,d:!1,r:!1,l:!1}},evD5:function(t,n,r){var e=r("77Pl"),o=r("SfB7"),i=r("MmMw"),u=Object.defineProperty;n.f=r("+E39")?Object.defineProperty:function(t,n,r){if(e(t),n=i(n,!0),e(r),o)try{return u(t,n,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[n]=r.value),t}},fBQ2:function(t,n,r){"use strict";var e=r("evD5"),o=r("X8DO");t.exports=function(t,n,r){n in t?e.f(t,n,o(0,r)):t[n]=r}},fkB2:function(t,n,r){var e=r("UuGF"),o=Math.max,i=Math.min;t.exports=function(t,n){return(t=e(t))<0?o(t+n,0):i(t,n)}},fxRn:function(t,n,r){r("+tPU"),r("zQR9"),t.exports=r("g8Ux")},g8Ux:function(t,n,r){var e=r("77Pl"),o=r("3fs2");t.exports=r("FeBl").getIterator=function(t){var n=o(t);if("function"!=typeof n)throw TypeError(t+" is not iterable!");return e(n.call(t))}},h65t:function(t,n,r){var e=r("UuGF"),o=r("52gC");t.exports=function(t){return function(n,r){var i,u,c=String(o(n)),f=e(r),a=c.length;return f<0||f>=a?t?"":void 0:(i=c.charCodeAt(f))<55296||i>56319||f+1===a||(u=c.charCodeAt(f+1))<56320||u>57343?t?c.charAt(f):i:t?c.slice(f,f+2):u-56320+(i-55296<<10)+65536}}},hJx8:function(t,n,r){var e=r("evD5"),o=r("X8DO");t.exports=r("+E39")?function(t,n,r){return e.f(t,n,o(1,r))}:function(t,n,r){return t[n]=r,t}},ifoU:function(t,n,r){t.exports={default:r("3C/1"),__esModule:!0}},ioQ5:function(t,n,r){r("HpRW")("Set")},kM2E:function(t,n,r){var e=r("7KvD"),o=r("FeBl"),i=r("+ZMJ"),u=r("hJx8"),c=r("D2L2"),f=function(t,n,r){var a,s,l,v=t&f.F,p=t&f.G,d=t&f.S,h=t&f.P,y=t&f.B,x=t&f.W,g=p?o:o[n]||(o[n]={}),_=g.prototype,b=p?e:d?e[n]:(e[n]||{}).prototype;for(a in p&&(r=n),r)(s=!v&&b&&void 0!==b[a])&&c(g,a)||(l=s?b[a]:r[a],g[a]=p&&"function"!=typeof b[a]?r[a]:y&&s?i(l,e):x&&b[a]==l?function(t){var n=function(n,r,e){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,r)}return new t(n,r,e)}return t.apply(this,arguments)};return n.prototype=t.prototype,n}(l):h&&"function"==typeof l?i(Function.call,l):l,h&&((g.virtual||(g.virtual={}))[a]=l,t&f.R&&_&&!_[a]&&u(_,a,l)))};f.F=1,f.G=2,f.S=4,f.P=8,f.B=16,f.W=32,f.U=64,f.R=128,t.exports=f},lHA8:function(t,n,r){t.exports={default:r("pPW7"),__esModule:!0}},lOnJ:function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},lktj:function(t,n,r){var e=r("Ibhu"),o=r("xnc9");t.exports=Object.keys||function(t){return e(t,o)}},m9gC:function(t,n,r){var e=r("RY/4"),o=r("4WTo");t.exports=function(t){return function(){if(e(this)!=t)throw TypeError(t+"#toJSON isn't generic");return o(this)}}},msXi:function(t,n,r){var e=r("77Pl");t.exports=function(t,n,r,o){try{return o?n(e(r)[0],r[1]):n(r)}catch(n){var i=t.return;throw void 0!==i&&e(i.call(t)),n}}},oNmr:function(t,n,r){r("9Bbf")("Set")},oeOm:function(t,n,r){var e=r("7Doy");t.exports=function(t,n){return new(e(t))(n)}},pPW7:function(t,n,r){r("M6a0"),r("zQR9"),r("+tPU"),r("ttyz"),r("BDhv"),r("oNmr"),r("ioQ5"),t.exports=r("FeBl").Set},qCoq:function(t,n,r){"use strict";var e=r("9C8M"),o=r("LIJb");t.exports=r("qo66")("Map",function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function(t){var n=e.getEntry(o(this,"Map"),t);return n&&n.v},set:function(t,n){return e.def(o(this,"Map"),0===t?0:t,n)}},e,!0)},qio6:function(t,n,r){var e=r("evD5"),o=r("77Pl"),i=r("lktj");t.exports=r("+E39")?Object.defineProperties:function(t,n){o(t);for(var r,u=i(n),c=u.length,f=0;c>f;)e.f(t,r=u[f++],n[r]);return t}},qo66:function(t,n,r){"use strict";var e=r("7KvD"),o=r("kM2E"),i=r("06OY"),u=r("S82l"),c=r("hJx8"),f=r("xH/j"),a=r("NWt+"),s=r("2KxR"),l=r("EqjI"),v=r("e6n0"),p=r("evD5").f,d=r("ALrJ")(0),h=r("+E39");t.exports=function(t,n,r,y,x,g){var _=e[t],b=_,m=x?"set":"add",S=b&&b.prototype,M={};return h&&"function"==typeof b&&(g||S.forEach&&!u(function(){(new b).entries().next()}))?(b=n(function(n,r){s(n,b,t,"_c"),n._c=new _,void 0!=r&&a(r,x,n[m],n)}),d("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","),function(t){var n="add"==t||"set"==t;t in S&&(!g||"clear"!=t)&&c(b.prototype,t,function(r,e){if(s(this,b,t),!n&&g&&!l(r))return"get"==t&&void 0;var o=this._c[t](0===r?0:r,e);return n?this:o})}),g||p(b.prototype,"size",{get:function(){return this._c.size}})):(b=y.getConstructor(n,t,x,m),f(b.prototype,r),i.NEED=!0),v(b,t),M[t]=b,o(o.G+o.W+o.F,M),g||y.setStrong(b,t,x),b}},qyJz:function(t,n,r){"use strict";var e=r("+ZMJ"),o=r("kM2E"),i=r("sB3e"),u=r("msXi"),c=r("Mhyx"),f=r("QRG4"),a=r("fBQ2"),s=r("3fs2");o(o.S+o.F*!r("dY0y")(function(t){Array.from(t)}),"Array",{from:function(t){var n,r,o,l,v=i(t),p="function"==typeof this?this:Array,d=arguments.length,h=d>1?arguments[1]:void 0,y=void 0!==h,x=0,g=s(v);if(y&&(h=e(h,d>2?arguments[2]:void 0,2)),void 0==g||p==Array&&c(g))for(r=new p(n=f(v.length));n>x;x++)a(r,x,y?h(v[x],x):v[x]);else for(l=g.call(v),r=new p;!(o=l.next()).done;x++)a(r,x,y?u(l,h,[o.value,x],!0):o.value);return r.length=x,r}})},sB3e:function(t,n,r){var e=r("52gC");t.exports=function(t){return Object(e(t))}},ttyz:function(t,n,r){"use strict";var e=r("9C8M"),o=r("LIJb");t.exports=r("qo66")("Set",function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function(t){return e.def(o(this,"Set"),t=0===t?0:t,t)}},e)},"us/S":function(t,n,r){t.exports={default:r("Xd32"),__esModule:!0}},"vFc/":function(t,n,r){var e=r("TcQ7"),o=r("QRG4"),i=r("fkB2");t.exports=function(t){return function(n,r,u){var c,f=e(n),a=o(f.length),s=i(u,a);if(t&&r!=r){for(;a>s;)if((c=f[s++])!=c)return!0}else for(;a>s;s++)if((t||s in f)&&f[s]===r)return t||s||0;return!t&&-1}}},"vIB/":function(t,n,r){"use strict";var e=r("O4g8"),o=r("kM2E"),i=r("880/"),u=r("hJx8"),c=r("/bQp"),f=r("94VQ"),a=r("e6n0"),s=r("PzxK"),l=r("dSzd")("iterator"),v=!([].keys&&"next"in[].keys()),p=function(){return this};t.exports=function(t,n,r,d,h,y,x){f(r,n,d);var g,_,b,m=function(t){if(!v&&t in w)return w[t];switch(t){case"keys":case"values":return function(){return new r(this,t)}}return function(){return new r(this,t)}},S=n+" Iterator",M="values"==h,E=!1,w=t.prototype,O=w[l]||w["@@iterator"]||h&&w[h],k=O||m(h),j=h?M?m("entries"):k:void 0,P="Array"==n&&w.entries||O;if(P&&(b=s(P.call(new t)))!==Object.prototype&&b.next&&(a(b,S,!0),e||"function"==typeof b[l]||u(b,l,p)),M&&O&&"values"!==O.name&&(E=!0,k=function(){return O.call(this)}),e&&!x||!v&&!E&&w[l]||u(w,l,k),c[n]=k,c[S]=p,h)if(g={values:M?k:m("values"),keys:y?k:m("keys"),entries:j},x)for(_ in g)_ in w||i(w,_,g[_]);else o(o.P+o.F*(v||E),n,g);return g}},woOf:function(t,n,r){t.exports={default:r("V3tA"),__esModule:!0}},xGkn:function(t,n,r){"use strict";var e=r("4mcu"),o=r("EGZi"),i=r("/bQp"),u=r("TcQ7");t.exports=r("vIB/")(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,r=this._i++;return!t||r>=t.length?(this._t=void 0,o(1)):o(0,"keys"==n?r:"values"==n?t[r]:[r,t[r]])},"values"),i.Arguments=i.Array,e("keys"),e("values"),e("entries")},"xH/j":function(t,n,r){var e=r("hJx8");t.exports=function(t,n,r){for(var o in n)r&&t[o]?t[o]=n[o]:e(t,o,n[o]);return t}},xnc9:function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},zQR9:function(t,n,r){"use strict";var e=r("h65t")(!0);r("vIB/")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,r=this._i;return r>=n.length?{value:void 0,done:!0}:(t=e(n,r),this._i+=t.length,{value:t,done:!1})})}});
//# sourceMappingURL=6ffd34a4ce413e7e9197.worker.js.map