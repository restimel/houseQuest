!function(t){var n={};function r(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=n,r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:e})},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r.p="/",r(r.s="eROv")}({"+E39":function(t,n,r){t.exports=!r("S82l")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},"+ZMJ":function(t,n,r){var e=r("lOnJ");t.exports=function(t,n,r){if(e(t),void 0===n)return t;switch(r){case 1:return function(r){return t.call(n,r)};case 2:return function(r,e){return t.call(n,r,e)};case 3:return function(r,e,o){return t.call(n,r,e,o)}}return function(){return t.apply(n,arguments)}}},"+tPU":function(t,n,r){r("xGkn");for(var e=r("7KvD"),o=r("hJx8"),i=r("/bQp"),u=r("dSzd")("toStringTag"),a="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),f=0;f<a.length;f++){var s=a[f],c=e[s],l=c&&c.prototype;l&&!l[u]&&o(l,u,s),i[s]=i.Array}},"/bQp":function(t,n){t.exports={}},"06OY":function(t,n,r){var e=r("3Eo+")("meta"),o=r("EqjI"),i=r("D2L2"),u=r("evD5").f,a=0,f=Object.isExtensible||function(){return!0},s=!r("S82l")(function(){return f(Object.preventExtensions({}))}),c=function(t){u(t,e,{value:{i:"O"+ ++a,w:{}}})},l=t.exports={KEY:e,NEED:!1,fastKey:function(t,n){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,e)){if(!f(t))return"F";if(!n)return"E";c(t)}return t[e].i},getWeak:function(t,n){if(!i(t,e)){if(!f(t))return!0;if(!n)return!1;c(t)}return t[e].w},onFreeze:function(t){return s&&l.NEED&&f(t)&&!i(t,e)&&c(t),t}}},"1kS7":function(t,n){n.f=Object.getOwnPropertySymbols},"2KxR":function(t,n){t.exports=function(t,n,r,e){if(!(t instanceof n)||void 0!==e&&e in t)throw TypeError(r+": incorrect invocation!");return t}},"3C/1":function(t,n,r){r("M6a0"),r("zQR9"),r("+tPU"),r("qCoq"),r("UvrK"),r("Xjd4"),r("bqnK"),t.exports=r("FeBl").Map},"3Eo+":function(t,n){var r=0,e=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++r+e).toString(36))}},"3fs2":function(t,n,r){var e=r("RY/4"),o=r("dSzd")("iterator"),i=r("/bQp");t.exports=r("FeBl").getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[e(t)]}},"4WTo":function(t,n,r){var e=r("NWt+");t.exports=function(t,n){var r=[];return e(t,!1,r.push,r,n),r}},"4mcu":function(t,n){t.exports=function(){}},"52gC":function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},"5PlU":function(t,n,r){var e=r("RY/4"),o=r("dSzd")("iterator"),i=r("/bQp");t.exports=r("FeBl").isIterable=function(t){var n=Object(t);return void 0!==n[o]||"@@iterator"in n||i.hasOwnProperty(e(n))}},"5zde":function(t,n,r){r("zQR9"),r("qyJz"),t.exports=r("FeBl").Array.from},"77Pl":function(t,n,r){var e=r("EqjI");t.exports=function(t){if(!e(t))throw TypeError(t+" is not an object!");return t}},"7Doy":function(t,n,r){var e=r("EqjI"),o=r("7UMu"),i=r("dSzd")("species");t.exports=function(t){var n;return o(t)&&("function"!=typeof(n=t.constructor)||n!==Array&&!o(n.prototype)||(n=void 0),e(n)&&null===(n=n[i])&&(n=void 0)),void 0===n?Array:n}},"7KvD":function(t,n){var r=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},"7UMu":function(t,n,r){var e=r("R9M2");t.exports=Array.isArray||function(t){return"Array"==e(t)}},"880/":function(t,n,r){t.exports=r("hJx8")},"94VQ":function(t,n,r){"use strict";var e=r("Yobk"),o=r("X8DO"),i=r("e6n0"),u={};r("hJx8")(u,r("dSzd")("iterator"),function(){return this}),t.exports=function(t,n,r){t.prototype=e(u,{next:o(1,r)}),i(t,n+" Iterator")}},"9Bbf":function(t,n,r){"use strict";var e=r("kM2E");t.exports=function(t){e(e.S,t,{of:function(){for(var t=arguments.length,n=new Array(t);t--;)n[t]=arguments[t];return new this(n)}})}},"9C8M":function(t,n,r){"use strict";var e=r("evD5").f,o=r("Yobk"),i=r("xH/j"),u=r("+ZMJ"),a=r("2KxR"),f=r("NWt+"),s=r("vIB/"),c=r("EGZi"),l=r("bRrM"),v=r("+E39"),d=r("06OY").fastKey,p=r("LIJb"),h=v?"_s":"size",x=function(t,n){var r,e=d(n);if("F"!==e)return t._i[e];for(r=t._f;r;r=r.n)if(r.k==n)return r};t.exports={getConstructor:function(t,n,r,s){var c=t(function(t,e){a(t,c,n,"_i"),t._t=n,t._i=o(null),t._f=void 0,t._l=void 0,t[h]=0,void 0!=e&&f(e,r,t[s],t)});return i(c.prototype,{clear:function(){for(var t=p(this,n),r=t._i,e=t._f;e;e=e.n)e.r=!0,e.p&&(e.p=e.p.n=void 0),delete r[e.i];t._f=t._l=void 0,t[h]=0},delete:function(t){var r=p(this,n),e=x(r,t);if(e){var o=e.n,i=e.p;delete r._i[e.i],e.r=!0,i&&(i.n=o),o&&(o.p=i),r._f==e&&(r._f=o),r._l==e&&(r._l=i),r[h]--}return!!e},forEach:function(t){p(this,n);for(var r,e=u(t,arguments.length>1?arguments[1]:void 0,3);r=r?r.n:this._f;)for(e(r.v,r.k,this);r&&r.r;)r=r.p},has:function(t){return!!x(p(this,n),t)}}),v&&e(c.prototype,"size",{get:function(){return p(this,n)[h]}}),c},def:function(t,n,r){var e,o,i=x(t,n);return i?i.v=r:(t._l=i={i:o=d(n,!0),k:n,v:r,p:e=t._l,n:void 0,r:!1},t._f||(t._f=i),e&&(e.n=i),t[h]++,"F"!==o&&(t._i[o]=i)),t},getEntry:x,setStrong:function(t,n,r){s(t,n,function(t,r){this._t=p(t,n),this._k=r,this._l=void 0},function(){for(var t=this._k,n=this._l;n&&n.r;)n=n.p;return this._t&&(this._l=n=n?n.n:this._t._f)?c(0,"keys"==t?n.k:"values"==t?n.v:[n.k,n.v]):(this._t=void 0,c(1))},r?"entries":"values",!r,!0),l(n)}}},ALrJ:function(t,n,r){var e=r("+ZMJ"),o=r("MU5D"),i=r("sB3e"),u=r("QRG4"),a=r("oeOm");t.exports=function(t,n){var r=1==t,f=2==t,s=3==t,c=4==t,l=6==t,v=5==t||l,d=n||a;return function(n,a,p){for(var h,x,y=i(n),g=o(y),m=e(a,p,3),b=u(g.length),M=0,_=r?d(n,b):f?d(n,0):void 0;b>M;M++)if((v||M in g)&&(x=m(h=g[M],M,y),t))if(r)_[M]=x;else if(x)switch(t){case 3:return!0;case 5:return h;case 6:return M;case 2:_.push(h)}else if(c)return!1;return l?-1:s||c?c:_}}},BDhv:function(t,n,r){var e=r("kM2E");e(e.P+e.R,"Set",{toJSON:r("m9gC")("Set")})},BO1k:function(t,n,r){t.exports={default:r("fxRn"),__esModule:!0}},D2L2:function(t,n){var r={}.hasOwnProperty;t.exports=function(t,n){return r.call(t,n)}},EGZi:function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},EqjI:function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},FeBl:function(t,n){var r=t.exports={version:"2.5.5"};"number"==typeof __e&&(__e=r)},HpRW:function(t,n,r){"use strict";var e=r("kM2E"),o=r("lOnJ"),i=r("+ZMJ"),u=r("NWt+");t.exports=function(t){e(e.S,t,{from:function(t){var n,r,e,a,f=arguments[1];return o(this),(n=void 0!==f)&&o(f),void 0==t?new this:(r=[],n?(e=0,a=i(f,arguments[2],2),u(t,!1,function(t){r.push(a(t,e++))})):u(t,!1,r.push,r),new this(r))}})}},Ibhu:function(t,n,r){var e=r("D2L2"),o=r("TcQ7"),i=r("vFc/")(!1),u=r("ax3d")("IE_PROTO");t.exports=function(t,n){var r,a=o(t),f=0,s=[];for(r in a)r!=u&&e(a,r)&&s.push(r);for(;n.length>f;)e(a,r=n[f++])&&(~i(s,r)||s.push(r));return s}},LIJb:function(t,n,r){var e=r("EqjI");t.exports=function(t,n){if(!e(t)||t._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return t}},M6a0:function(t,n){},MU5D:function(t,n,r){var e=r("R9M2");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==e(t)?t.split(""):Object(t)}},Mhyx:function(t,n,r){var e=r("/bQp"),o=r("dSzd")("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(e.Array===t||i[o]===t)}},MmMw:function(t,n,r){var e=r("EqjI");t.exports=function(t,n){if(!e(t))return t;var r,o;if(n&&"function"==typeof(r=t.toString)&&!e(o=r.call(t)))return o;if("function"==typeof(r=t.valueOf)&&!e(o=r.call(t)))return o;if(!n&&"function"==typeof(r=t.toString)&&!e(o=r.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},"NWt+":function(t,n,r){var e=r("+ZMJ"),o=r("msXi"),i=r("Mhyx"),u=r("77Pl"),a=r("QRG4"),f=r("3fs2"),s={},c={};(n=t.exports=function(t,n,r,l,v){var d,p,h,x,y=v?function(){return t}:f(t),g=e(r,l,n?2:1),m=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(i(y)){for(d=a(t.length);d>m;m++)if((x=n?g(u(p=t[m])[0],p[1]):g(t[m]))===s||x===c)return x}else for(h=y.call(t);!(p=h.next()).done;)if((x=o(h,g,p.value,n))===s||x===c)return x}).BREAK=s,n.RETURN=c},NpIQ:function(t,n){n.f={}.propertyIsEnumerable},O4g8:function(t,n){t.exports=!0},ON07:function(t,n,r){var e=r("EqjI"),o=r("7KvD").document,i=e(o)&&e(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},PzxK:function(t,n,r){var e=r("D2L2"),o=r("sB3e"),i=r("ax3d")("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),e(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},QRG4:function(t,n,r){var e=r("UuGF"),o=Math.min;t.exports=function(t){return t>0?o(e(t),9007199254740991):0}},R4wc:function(t,n,r){var e=r("kM2E");e(e.S+e.F,"Object",{assign:r("To3L")})},R9M2:function(t,n){var r={}.toString;t.exports=function(t){return r.call(t).slice(8,-1)}},RPLV:function(t,n,r){var e=r("7KvD").document;t.exports=e&&e.documentElement},"RY/4":function(t,n,r){var e=r("R9M2"),o=r("dSzd")("toStringTag"),i="Arguments"==e(function(){return arguments}());t.exports=function(t){var n,r,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,n){try{return t[n]}catch(t){}}(n=Object(t),o))?r:i?e(n):"Object"==(u=e(n))&&"function"==typeof n.callee?"Arguments":u}},S82l:function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},SfB7:function(t,n,r){t.exports=!r("+E39")&&!r("S82l")(function(){return 7!=Object.defineProperty(r("ON07")("div"),"a",{get:function(){return 7}}).a})},TcQ7:function(t,n,r){var e=r("MU5D"),o=r("52gC");t.exports=function(t){return e(o(t))}},To3L:function(t,n,r){"use strict";var e=r("lktj"),o=r("1kS7"),i=r("NpIQ"),u=r("sB3e"),a=r("MU5D"),f=Object.assign;t.exports=!f||r("S82l")(function(){var t={},n={},r=Symbol(),e="abcdefghijklmnopqrst";return t[r]=7,e.split("").forEach(function(t){n[t]=t}),7!=f({},t)[r]||Object.keys(f({},n)).join("")!=e})?function(t,n){for(var r=u(t),f=arguments.length,s=1,c=o.f,l=i.f;f>s;)for(var v,d=a(arguments[s++]),p=c?e(d).concat(c(d)):e(d),h=p.length,x=0;h>x;)l.call(d,v=p[x++])&&(r[v]=d[v]);return r}:f},UuGF:function(t,n){var r=Math.ceil,e=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?e:r)(t)}},UvrK:function(t,n,r){var e=r("kM2E");e(e.P+e.R,"Map",{toJSON:r("m9gC")("Map")})},V3tA:function(t,n,r){r("R4wc"),t.exports=r("FeBl").Object.assign},X8DO:function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},Xd32:function(t,n,r){r("+tPU"),r("zQR9"),t.exports=r("5PlU")},Xjd4:function(t,n,r){r("9Bbf")("Map")},Ya8g:function(t,n){},Yobk:function(t,n,r){var e=r("77Pl"),o=r("qio6"),i=r("xnc9"),u=r("ax3d")("IE_PROTO"),a=function(){},f=function(){var t,n=r("ON07")("iframe"),e=i.length;for(n.style.display="none",r("RPLV").appendChild(n),n.src="javascript:",(t=n.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),f=t.F;e--;)delete f.prototype[i[e]];return f()};t.exports=Object.create||function(t,n){var r;return null!==t?(a.prototype=e(t),r=new a,a.prototype=null,r[u]=t):r=f(),void 0===n?r:o(r,n)}},ax3d:function(t,n,r){var e=r("e8AB")("keys"),o=r("3Eo+");t.exports=function(t){return e[t]||(e[t]=o(t))}},bRrM:function(t,n,r){"use strict";var e=r("7KvD"),o=r("FeBl"),i=r("evD5"),u=r("+E39"),a=r("dSzd")("species");t.exports=function(t){var n="function"==typeof o[t]?o[t]:e[t];u&&n&&!n[a]&&i.f(n,a,{configurable:!0,get:function(){return this}})}},bqnK:function(t,n,r){r("HpRW")("Map")},"c/Tr":function(t,n,r){t.exports={default:r("5zde"),__esModule:!0}},d7EF:function(t,n,r){"use strict";n.__esModule=!0;var e=i(r("us/S")),o=i(r("BO1k"));function i(t){return t&&t.__esModule?t:{default:t}}n.default=function(){return function(t,n){if(Array.isArray(t))return t;if((0,e.default)(Object(t)))return function(t,n){var r=[],e=!0,i=!1,u=void 0;try{for(var a,f=(0,o.default)(t);!(e=(a=f.next()).done)&&(r.push(a.value),!n||r.length!==n);e=!0);}catch(t){i=!0,u=t}finally{try{!e&&f.return&&f.return()}finally{if(i)throw u}}return r}(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()},dSzd:function(t,n,r){var e=r("e8AB")("wks"),o=r("3Eo+"),i=r("7KvD").Symbol,u="function"==typeof i;(t.exports=function(t){return e[t]||(e[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=e},dY0y:function(t,n,r){var e=r("dSzd")("iterator"),o=!1;try{var i=[7][e]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,n){if(!n&&!o)return!1;var r=!1;try{var i=[7],u=i[e]();u.next=function(){return{done:r=!0}},i[e]=function(){return u},t(i)}catch(t){}return r}},e6n0:function(t,n,r){var e=r("evD5").f,o=r("D2L2"),i=r("dSzd")("toStringTag");t.exports=function(t,n,r){t&&!o(t=r?t:t.prototype,i)&&e(t,i,{configurable:!0,value:n})}},e8AB:function(t,n,r){var e=r("7KvD"),o=e["__core-js_shared__"]||(e["__core-js_shared__"]={});t.exports=function(t){return o[t]||(o[t]={})}},eROv:function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var e=r("BO1k"),o=r.n(e),i=r("c/Tr"),u=r.n(i),a=r("lHA8"),f=r.n(a),s=r("ifoU"),c=r.n(s),l=r("d7EF"),v=r.n(l),d=r("woOf"),p=r.n(d),h=r("Ya8g"),x=(r.n(h),{id:-1,error:!1,data:null,progress:-1});self.onmessage=function(t){var n=t.data,r=n.id,e={id:r,error:!1,data:null};!function(t,n,r,e){switch(t){case"analyze":r.data=b(n);break;case"composition":p()(x,{id:e,error:!1,data:{progress:0}}),r.data={progress:0},function(t,n){var r=t.mazes,e=t.mazeWidth,i=t.mazeHeight,u=t.mazeWidthHouse,a=(t.mazeHeightHouse,t.houseWidth),s=t.houseHeight,l=t.starts,d=t.ends,h=t.useOnce,S=t.offset,w=t.filter,E=t.nbPossibilities,P=e*i,k=S,j=l.concat(d),A=(T=w.weight,B=1*T.nbCellAccessible,F=1*T.nbShortPath,I=1*T.nbMovements,H=1*T.nbComplexMove,N=1*T.nbHardMove,.01+B+F+I+H+N),R=new c.a,z=new f.a,C=k,L=k,D=t.infos.map(function(n,r){var e=void 0,o=void 0;return e=n.houses.length?n.houses:t.defaultInfo.houses,o=n.orientations.length?n.orientations:t.defaultInfo.orientations,{houses:e,orientations:o,idxHouse:0,idxOrientation:0,x:Math.floor(r/u),y:r%u,shortcutCost:o.length,orientationShortCut:1}});var T,B,F,I,H,N;if(D.reduceRight(function(t,n,r){if(t){var e=t.shortcutCost*t.houses.length;n.orientationShortCut=e,n.shortcutCost*=e}if(L){var o=n.orientations.length,i=L%o;n.idxOrientation=i,L=(L-i)/o;var u=n.houses.length,a=L%u;n.idxHouse=a,L=(L-a)/u}return n},null),h){for(var J=0;J<D.length;J++){var Q=D[J];if(Q.idxHouse>=Q.houses.length){if(0===J)return tt();Q.idxHouse=0;var U=D[--J],q=U.houses[U.idxHouse];z.delete(q),C+=U.orientations.length-1,U.idxHouse++,J--;var G=U.idxOrientation;G&&(C-=G,U.idxOrientation=0)}else{var K=Q.houses[Q.idxHouse];if(z.has(K)){C+=Q.shortcutCost,Q.idxHouse++,J--;var W=Q.idxOrientation;W&&(C-=W,Q.idxOrientation=0)}else K!==g&&z.add(K)}}k=C}var V=0,Y=0,X=l.map(function(t){var n=$(t),r=v()(n,2),e=r[0],o=r[1];return V=Math.max(V,o),e}),Z=d.map(function(t){var n=$(t),r=v()(n,2),e=r[0],o=r[1];return Y=Math.max(Y,o),e});function $(t){var n=t.split(", "),r=v()(n,2),o=r[0],u=r[1],f="",c=+o,l=+u;c<0?(c=0,f="l"):c>=e&&(c=e-1,f="r"),l<0?(l=0,f="u"):l>=i&&(l=i-1,f="d");var d=Math.floor((c*i+l)/(a*s)),p=c%a,h=l%s;return[function(t,n,r,e){return function(){return function(t,n,r){var e=D[r],o=e.houses[e.idxHouse],i=e.orientations[e.idxOrientation],u=ot(o,i).maze[t];return u&&u[n]||{}}(t,n,r)[e]}}(p,h,d,f),d]}function tt(){m({finished:!0,id:n,data:{progress:C/E,offset:C}},!0)}function nt(t){m({id:n,data:p()({progress:C/E,offset:C},t)},!0)}function rt(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:D.length-1,n=D[t],r=!1;!r;){r=!0;var e=n.houses[n.idxHouse],o=n.orientations.length-1;if(e!==g&&n.idxOrientation<o)n.idxOrientation++;else{C+=n.orientationShortCut*(o-n.idxOrientation),n.idxOrientation=0;for(var i=!1;!i;){if(i=!0,n.idxHouse<n.houses.length-1)n.idxHouse++;else{if(n.idxHouse=0,!(t>0))return!1;if(!rt(t-1))return!1}if(h){for(var u=new f.a,a=0;a<=t;a++){var s=D[a],c=s.houses[s.idxHouse];if(c!==g){if(u.has(c)){i=!1;break}u.add(c)}}i||(C+=n.shortcutCost)}}}t===V&&(r=X.some(function(t){return t()})),r&&t===Y&&(r=Z.some(function(t){return t()})),r||(C+=n.orientationShortCut)}return!0}function et(){var t=function(t,n){for(var r=new Array(t),e=0;e<t;e++){var o=new Array(n);r[e]=o;for(var i=0;i<n;i++)o[i]={u:!0,d:!0,l:!0,r:!0}}return r}(e,i);function n(t,n,r){var e=r[t],o=e&&e[n];if(!o){var i=[t,n].join(", "),u=!!j.find(function(t){return t===i});return{u:u,d:u,l:u,r:u}}return o}function r(t,n,r){var e=t[n][r],o=e.u,i=e.d,u=e.l,a=e.r;return{u:o,d:i,l:u,r:a}}var u=!0,f=!1,c=void 0;try{for(var l,v=o()(D);!(u=(l=v.next()).done);u=!0)for(var d=l.value,p=d.houses[d.idxHouse],h=d.orientations[d.idxOrientation],x=d.x*a,y=d.y*s,g=ot(p,h),m=g.maze,b=0;b<a;b++)for(var M=0;M<s;M++)t[b+x][M+y]=r(m,b,M)}catch(t){f=!0,c=t}finally{try{!u&&v.return&&v.return()}finally{if(f)throw c}}for(var _=t.length,O=t[0].length,S=0;S<_;S++)for(var w=0;w<O;w++){var E=t[S][w];E.u&&!n(S,w-1,t).d&&(E.u=!1),E.d&&!n(S,w+1,t).u&&(E.d=!1),E.r&&!n(S+1,w,t).l&&(E.r=!1),E.l&&!n(S-1,w,t).r&&(E.l=!1)}return t}function ot(t,n){var e=t+"§"+n;if(!R.has(e)){var o=r[t];"UP"===n?R.set(e,o):R.set(e,{maze:function(t,n){var r=t.maze,e=r.length,o=r[0].length,i=new Array(e);function u(t,i){var u=void 0,a=void 0;switch(n){case"DOWN":return u=o-i-1,{u:(a=r[e-t-1][u]||y).d,d:a.u,r:a.l,l:a.r};case"LEFT":return u=t,{u:(a=r[e-i-1][u]||y).r,d:a.l,r:a.d,l:a.u};case"RIGHT":return u=o-t-1,{u:(a=r[i][u]||y).l,d:a.r,r:a.u,l:a.d};case"UP":return r[t][i]}}for(var a=0;a<e;a++)for(var f=i[a]=new Array(o),s=0;s<o;s++)f[s]=u(a,s);return i}(o,n)})}return R.get(e)}setTimeout(function t(n){if(n!==x.id)return tt();var r=performance.now();var o=[];var i=k===C?M/2:M;do{var u=void 0;if(k!==C&&!rt())return o.length&&(nt({results:o}),o=null),tt();if(++C>E){if(o.length&&(nt({results:o}),o=[]),C>2*E)return tt();console.warn("Limit reach",C,E)}if(u=et()){var a=b({maze:u,starts:l,ends:d});a.nbShortestPath>P||(a.difficulty=_(w.weight,{result:a,nbMaxCells:P,sizeX:e}),a.difficultyPercent=O(a.difficulty,A),a.difficultyPercent<w.difficulty[0]||a.difficultyPercent>w.difficulty[1]||o.push({houses:D.map(function(t){return t.houses[t.idxHouse]+"§"+t.orientations[t.idxOrientation]}),result:a}))}}while(performance.now()-r<i);nt({results:o});o=[];setTimeout(t,1,n)},1,n)}(n,e);break;case"stopComposition":x.id=-1;break;default:r.error=!0,r.data='Action "'+t+'" is not implemented.'}}(n.action,n.data,e,r),m(e)};var y={u:!1,d:!1,r:!1,l:!1},g="_empty_";function m(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1]?p()({},x,t):t;self.postMessage(n)}function b(t){var n=t.maze,r=t.starts,e=t.ends;function o(t,n){return t+", "+n}function i(t,r){return n[t]&&n[t][r]||S.get(o(t,r))||y}function a(t,n,r){return r?P[t]&&P[t][n]:P[t]&&P[t][n]||w.get(o(t,n))||{dist:1/0,orientation:"",parent:NaN,dirParent:""}}function s(t,n,r,e,i){var u=o(t,n);if(!M.has(u)){var f=a(t,n,!0);f&&(f.dist=r,f.parent=e,f.dirParent=i,f.orientation=i,M.set(u,[t,n]))}}var l={d:0,u:0,r:1,l:-1,"-d":0,"-u":0,"-r":-1,"-l":1},d={d:1,u:-1,r:0,l:0,"-d":-1,"-u":1,"-r":0,"-l":0},h={u:"u",d:"d",r:"r",l:"l","-u":"d","-d":"u","-r":"l","-l":"r"},x={u:0,d:0,l:1,r:1,"-u":0,"-d":0,"-l":1,"-r":1};function g(t,n,r,e,u){var f=a(t,n),s=h[f.orientation],c=x[s],p=r.slice(),y=e?1:0;u||(p[c]=s),(e||u)&&(p[c=(c+1)%2]=h["-"+p[c]],s=e?p.join(""):p[c]);var g=function t(n,r,e){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,u=i(n,r),a=(o+1)%2,f=e[a],s=e[o],c=void 0,p=void 0,h=0;if(u[f]){var x=t(n+l[f],r+d[f],e,a),y=v()(x,3);c=y[0],p=y[1],h=y[2],u[s]&&h++}else if(u[s]){var g=t(n+l[s],r+d[s],e,o),m=v()(g,3);c=m[0],p=m[1],h=m[2]}else c=n,p=r;return[c,p,h]}(t,n,p,c),m=v()(g,3),b=m[0],M=m[1],_=m[2];return[b,M,_=_>1?_-1:0,y,p,s,o(b,M)]}function m(t,n){function r(t,n){var r=v()(t,7),e=r[0],o=r[1],i=r[2],u=r[3],a=r[4],f=r[5],s=r[6];return{id:s+"-"+a.join(","),cid:s,x:e,y:o,position:a,mvt:f,cost:n,complex:i,hard:u}}var e=i(t,n);return function(t){var n=t.initValues,r=t.computeNext,e=t.checkEnd,o=new c.a,i=void 0,u=n.map(function(t){return{v:t,id:t.id,d:0,dh:t.cost,parent:null}});function a(t,n){return n.dh-t.dh||n.d-t.d}var f=function(){u.sort(a);var t=u.pop();if(o.set(t.id,t),e(t.v))return i=t,"break";var n=t.d+t.v.cost,f=r(t.v);f.forEach(function(r){if(!o.has(r.id)){var e=u.find(function(t){return t.id===r.id});e?e.dh>n+r.cost&&(e.v=r,e.d=n,e.dh=n+r.cost,e.parent=t.id):u.push({v:r,id:r.id,d:n,dh:n+r.cost,parent:t.id})}})};do{var s=f();if("break"===s)break}while(u.length);var l=[],v=[],d=0,p=0;for(;i;)l.push(i.v),v.push(i.v.mvt),d+=i.v.complex,p+=i.v.hard,i=o.get(i.parent);return[v.reverse(),d,p,l.reverse()]}({initValues:[r([t,n,0,0,[e.d?"u":"d",e.l?"r":"l"],"",o(t,n)],0)],computeNext:function(t){var n=t.x,e=t.y,o=t.position,i=g(n,e,o,!1,!1),u=g(n,e,o,!1,!0),a=g(n,e,o,!0,!1);return[r(i,1),r(u,1),r(a,10)]},checkEnd:function(t){return O.has(t.cid)}})}function b(t,n){t.forEach(function(r,e){var u=v()(r,2),a=u[0],f=u[1],s=p()({},y),c={dist:n,orientation:"",parent:NaN,dirParent:""};t.has(o(a+1,f))?s.r=!0:i(a+1,f).l&&(s.r=!0,c.orientation="r"),t.has(o(a-1,f))?s.l=!0:i(a-1,f).r&&(s.l=!0,c.orientation="l"),t.has(o(a,f+1))?s.d=!0:i(a,f+1).u&&(s.d=!0,c.orientation="d"),t.has(o(a,f-1))?s.u=!0:i(a,f-1).d&&(s.u=!0,c.orientation="u"),S.set(e,s),w.set(e,c)})}var M=new c.a,_=new c.a(r.map(function(t){return[t,t.split(/,\s*/).map(function(t){return+t})]})),O=new c.a(e.map(function(t){return[t,t.split(/,\s*/).map(function(t){return+t})]})),S=new c.a,w=new c.a;b(_,0),b(O,1/0);for(var E=n.length,P=new Array(E),k=0;k<E;k++){var j=n[k].length;P[k]=new Array(j);for(var A=0;A<j;A++)P[k][A]={dist:1/0,orientation:"",parent:NaN,dirParent:""}}_.forEach(function(t,n){M.set(n,t)}),M.forEach(function(t){var r=v()(t,2);!function(t,r){var e=o(t,r),u=n[t]&&n[t][r],f=void 0;u?f=a(t,r).dist+1:(f=1,u={u:i(t,r-1).d,d:i(t,r+1).u,r:i(t+1,r).l,l:i(t-1,r).r}),u.u&&s(t,r-1,f,e,"d"),u.d&&s(t,r+1,f,e,"u"),u.r&&s(t+1,r,f,e,"l"),u.l&&s(t-1,r,f,e,"r")}(r[0],r[1])});var R=new f.a,z=function(){var t=void 0,n=void 0,r=1/0;if(O.forEach(function(e){var u=v()(e,2),f=u[0],s=u[1],c=void 0;i(f+1,s).l&&(c=a(f+1,s).dist)<r&&(r=c,t=o(f+1,s),n="r"),i(f-1,s).r&&(c=a(f-1,s).dist)<r&&(r=c,t=o(f-1,s),n="l"),i(f,s+1).u&&(c=a(f,s+1).dist)<r&&(r=c,t=o(f,s+1),n="d"),i(f,s-1).d&&(c=a(f,s-1).dist)<r&&(r=c,t=o(f,s-1),n="u")}),isFinite(r)){var e=r;do{var u=t.split(", ").map(function(t){return+t}),f=v()(u,2),s=a(f[0],f[1]);R.add(t),s.orientation="-"+n,n=s.dirParent,t=s.parent,e=s.dist}while(e>1);R.add(t)}return r}(),C=[],L=0,D=0;return isFinite(z)&&_.forEach(function(t,n){var r=v()(t,2),e=r[0],o=r[1];if(R.has(n)){var i=m(e,o),u=v()(i,3);C=u[0],L=u[1],D=u[2]}}),{nbCellAccessible:M.size,nbShortestPath:z,shortestPath:u()(R),cells:P,accessible:u()(M.keys()),movements:C,complexMovements:L,hardMovements:D,difficulty:0,difficultyPercent:0}}var M=1500;function _(t,n){var r=n.result,e=n.nbMaxCells,o=n.sizeX;return.01+r.nbCellAccessible/e*t.nbCellAccessible+r.nbShortestPath/e*t.nbShortPath+r.movements.length/(e-o)*t.nbMovements+S(r.complexMovements,o,6)*t.nbComplexMove+S(r.hardMovements,9,3)*t.nbHardMove}function O(t,n){var r=S(t,n,5);return Math.round(1e4*r)/100}function S(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100;return 1-n/((arguments.length>2&&void 0!==arguments[2]?arguments[2]:1)*t+n)}},evD5:function(t,n,r){var e=r("77Pl"),o=r("SfB7"),i=r("MmMw"),u=Object.defineProperty;n.f=r("+E39")?Object.defineProperty:function(t,n,r){if(e(t),n=i(n,!0),e(r),o)try{return u(t,n,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[n]=r.value),t}},fBQ2:function(t,n,r){"use strict";var e=r("evD5"),o=r("X8DO");t.exports=function(t,n,r){n in t?e.f(t,n,o(0,r)):t[n]=r}},fkB2:function(t,n,r){var e=r("UuGF"),o=Math.max,i=Math.min;t.exports=function(t,n){return(t=e(t))<0?o(t+n,0):i(t,n)}},fxRn:function(t,n,r){r("+tPU"),r("zQR9"),t.exports=r("g8Ux")},g8Ux:function(t,n,r){var e=r("77Pl"),o=r("3fs2");t.exports=r("FeBl").getIterator=function(t){var n=o(t);if("function"!=typeof n)throw TypeError(t+" is not iterable!");return e(n.call(t))}},h65t:function(t,n,r){var e=r("UuGF"),o=r("52gC");t.exports=function(t){return function(n,r){var i,u,a=String(o(n)),f=e(r),s=a.length;return f<0||f>=s?t?"":void 0:(i=a.charCodeAt(f))<55296||i>56319||f+1===s||(u=a.charCodeAt(f+1))<56320||u>57343?t?a.charAt(f):i:t?a.slice(f,f+2):u-56320+(i-55296<<10)+65536}}},hJx8:function(t,n,r){var e=r("evD5"),o=r("X8DO");t.exports=r("+E39")?function(t,n,r){return e.f(t,n,o(1,r))}:function(t,n,r){return t[n]=r,t}},ifoU:function(t,n,r){t.exports={default:r("3C/1"),__esModule:!0}},ioQ5:function(t,n,r){r("HpRW")("Set")},kM2E:function(t,n,r){var e=r("7KvD"),o=r("FeBl"),i=r("+ZMJ"),u=r("hJx8"),a=r("D2L2"),f=function(t,n,r){var s,c,l,v=t&f.F,d=t&f.G,p=t&f.S,h=t&f.P,x=t&f.B,y=t&f.W,g=d?o:o[n]||(o[n]={}),m=g.prototype,b=d?e:p?e[n]:(e[n]||{}).prototype;for(s in d&&(r=n),r)(c=!v&&b&&void 0!==b[s])&&a(g,s)||(l=c?b[s]:r[s],g[s]=d&&"function"!=typeof b[s]?r[s]:x&&c?i(l,e):y&&b[s]==l?function(t){var n=function(n,r,e){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,r)}return new t(n,r,e)}return t.apply(this,arguments)};return n.prototype=t.prototype,n}(l):h&&"function"==typeof l?i(Function.call,l):l,h&&((g.virtual||(g.virtual={}))[s]=l,t&f.R&&m&&!m[s]&&u(m,s,l)))};f.F=1,f.G=2,f.S=4,f.P=8,f.B=16,f.W=32,f.U=64,f.R=128,t.exports=f},lHA8:function(t,n,r){t.exports={default:r("pPW7"),__esModule:!0}},lOnJ:function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},lktj:function(t,n,r){var e=r("Ibhu"),o=r("xnc9");t.exports=Object.keys||function(t){return e(t,o)}},m9gC:function(t,n,r){var e=r("RY/4"),o=r("4WTo");t.exports=function(t){return function(){if(e(this)!=t)throw TypeError(t+"#toJSON isn't generic");return o(this)}}},msXi:function(t,n,r){var e=r("77Pl");t.exports=function(t,n,r,o){try{return o?n(e(r)[0],r[1]):n(r)}catch(n){var i=t.return;throw void 0!==i&&e(i.call(t)),n}}},oNmr:function(t,n,r){r("9Bbf")("Set")},oeOm:function(t,n,r){var e=r("7Doy");t.exports=function(t,n){return new(e(t))(n)}},pPW7:function(t,n,r){r("M6a0"),r("zQR9"),r("+tPU"),r("ttyz"),r("BDhv"),r("oNmr"),r("ioQ5"),t.exports=r("FeBl").Set},qCoq:function(t,n,r){"use strict";var e=r("9C8M"),o=r("LIJb");t.exports=r("qo66")("Map",function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function(t){var n=e.getEntry(o(this,"Map"),t);return n&&n.v},set:function(t,n){return e.def(o(this,"Map"),0===t?0:t,n)}},e,!0)},qio6:function(t,n,r){var e=r("evD5"),o=r("77Pl"),i=r("lktj");t.exports=r("+E39")?Object.defineProperties:function(t,n){o(t);for(var r,u=i(n),a=u.length,f=0;a>f;)e.f(t,r=u[f++],n[r]);return t}},qo66:function(t,n,r){"use strict";var e=r("7KvD"),o=r("kM2E"),i=r("06OY"),u=r("S82l"),a=r("hJx8"),f=r("xH/j"),s=r("NWt+"),c=r("2KxR"),l=r("EqjI"),v=r("e6n0"),d=r("evD5").f,p=r("ALrJ")(0),h=r("+E39");t.exports=function(t,n,r,x,y,g){var m=e[t],b=m,M=y?"set":"add",_=b&&b.prototype,O={};return h&&"function"==typeof b&&(g||_.forEach&&!u(function(){(new b).entries().next()}))?(b=n(function(n,r){c(n,b,t,"_c"),n._c=new m,void 0!=r&&s(r,y,n[M],n)}),p("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","),function(t){var n="add"==t||"set"==t;t in _&&(!g||"clear"!=t)&&a(b.prototype,t,function(r,e){if(c(this,b,t),!n&&g&&!l(r))return"get"==t&&void 0;var o=this._c[t](0===r?0:r,e);return n?this:o})}),g||d(b.prototype,"size",{get:function(){return this._c.size}})):(b=x.getConstructor(n,t,y,M),f(b.prototype,r),i.NEED=!0),v(b,t),O[t]=b,o(o.G+o.W+o.F,O),g||x.setStrong(b,t,y),b}},qyJz:function(t,n,r){"use strict";var e=r("+ZMJ"),o=r("kM2E"),i=r("sB3e"),u=r("msXi"),a=r("Mhyx"),f=r("QRG4"),s=r("fBQ2"),c=r("3fs2");o(o.S+o.F*!r("dY0y")(function(t){Array.from(t)}),"Array",{from:function(t){var n,r,o,l,v=i(t),d="function"==typeof this?this:Array,p=arguments.length,h=p>1?arguments[1]:void 0,x=void 0!==h,y=0,g=c(v);if(x&&(h=e(h,p>2?arguments[2]:void 0,2)),void 0==g||d==Array&&a(g))for(r=new d(n=f(v.length));n>y;y++)s(r,y,x?h(v[y],y):v[y]);else for(l=g.call(v),r=new d;!(o=l.next()).done;y++)s(r,y,x?u(l,h,[o.value,y],!0):o.value);return r.length=y,r}})},sB3e:function(t,n,r){var e=r("52gC");t.exports=function(t){return Object(e(t))}},ttyz:function(t,n,r){"use strict";var e=r("9C8M"),o=r("LIJb");t.exports=r("qo66")("Set",function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function(t){return e.def(o(this,"Set"),t=0===t?0:t,t)}},e)},"us/S":function(t,n,r){t.exports={default:r("Xd32"),__esModule:!0}},"vFc/":function(t,n,r){var e=r("TcQ7"),o=r("QRG4"),i=r("fkB2");t.exports=function(t){return function(n,r,u){var a,f=e(n),s=o(f.length),c=i(u,s);if(t&&r!=r){for(;s>c;)if((a=f[c++])!=a)return!0}else for(;s>c;c++)if((t||c in f)&&f[c]===r)return t||c||0;return!t&&-1}}},"vIB/":function(t,n,r){"use strict";var e=r("O4g8"),o=r("kM2E"),i=r("880/"),u=r("hJx8"),a=r("/bQp"),f=r("94VQ"),s=r("e6n0"),c=r("PzxK"),l=r("dSzd")("iterator"),v=!([].keys&&"next"in[].keys()),d=function(){return this};t.exports=function(t,n,r,p,h,x,y){f(r,n,p);var g,m,b,M=function(t){if(!v&&t in w)return w[t];switch(t){case"keys":case"values":return function(){return new r(this,t)}}return function(){return new r(this,t)}},_=n+" Iterator",O="values"==h,S=!1,w=t.prototype,E=w[l]||w["@@iterator"]||h&&w[h],P=E||M(h),k=h?O?M("entries"):P:void 0,j="Array"==n&&w.entries||E;if(j&&(b=c(j.call(new t)))!==Object.prototype&&b.next&&(s(b,_,!0),e||"function"==typeof b[l]||u(b,l,d)),O&&E&&"values"!==E.name&&(S=!0,P=function(){return E.call(this)}),e&&!y||!v&&!S&&w[l]||u(w,l,P),a[n]=P,a[_]=d,h)if(g={values:O?P:M("values"),keys:x?P:M("keys"),entries:k},y)for(m in g)m in w||i(w,m,g[m]);else o(o.P+o.F*(v||S),n,g);return g}},woOf:function(t,n,r){t.exports={default:r("V3tA"),__esModule:!0}},xGkn:function(t,n,r){"use strict";var e=r("4mcu"),o=r("EGZi"),i=r("/bQp"),u=r("TcQ7");t.exports=r("vIB/")(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,r=this._i++;return!t||r>=t.length?(this._t=void 0,o(1)):o(0,"keys"==n?r:"values"==n?t[r]:[r,t[r]])},"values"),i.Arguments=i.Array,e("keys"),e("values"),e("entries")},"xH/j":function(t,n,r){var e=r("hJx8");t.exports=function(t,n,r){for(var o in n)r&&t[o]?t[o]=n[o]:e(t,o,n[o]);return t}},xnc9:function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},zQR9:function(t,n,r){"use strict";var e=r("h65t")(!0);r("vIB/")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,r=this._i;return r>=n.length?{value:void 0,done:!0}:(t=e(n,r),this._i+=t.length,{value:t,done:!1})})}});
//# sourceMappingURL=0a8f396a27d4d70533b3.worker.js.map