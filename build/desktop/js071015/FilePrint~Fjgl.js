(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{1250:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,r,i,l=h(n(14)),o=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();n(78);var u=h(n(1)),c=h(n(0)),d=n(18),f=n(17);n(1258);var s=v(n(30)),p=h(n(1260)),m=h(n(1264)),g=v(n(60));function v(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function h(e){return e&&e.__esModule?e:{default:e}}var b=(0,f.immutableRenderDecorator)((i=r=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={rotate:0,magnificationRate:1,imgWpercent:0,idx:""},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,u.default.Component),o(t,[{key:"componentDidMount",value:function(){this.props.dispatch(g.setDdConfig())}},{key:"componentWillReceiveProps",value:function(e,t){0==this.props.preview&&1==e.preview&&this.setState({rotate:0,magnificationRate:1,imgWpercent:0,idx:e.page,maxLimit:40,minLimit:40})}},{key:"render",value:function(){var e=this,t=this.props,n=t.preview,a=t.downloadPermission,r=t.previewImgArr,i=t.closePreviewModal,o=t.downloadEnclosure,c=t.dispatch,d=(t.page,t.type,t.uploadKeyJson,this.state),f=d.idx,g=d.rotate,v=d.magnificationRate,h=d.imgWpercent,b=d.maxLimit,y=d.minLimit,w=r.get(f);return u.default.createElement("div",{className:"preview",style:{display:n?"":"none"},onClick:function(e){}},u.default.createElement("div",{className:"nav"},u.default.createElement("button",{onClick:function(){return e.setState({idx:f-1,imgWpercent:0,rotate:0})},disabled:0==f},u.default.createElement(l.default,{type:"left-circle"}),u.default.createElement("div",null,"上一张")),u.default.createElement("button",{disabled:w&&"TRUE"!==w.get("imageOrFile"),onClick:function(){return e.setState({rotate:g+90})}},u.default.createElement(l.default,{type:"reload"}),u.default.createElement("div",null,"旋转")),w&&"application/pdf"===w.get("mimeType")?u.default.createElement("button",{disabled:.5===v,onClick:function(){e.setState({magnificationRate:v-.5})}},u.default.createElement(l.default,{type:"zoom-out"}),u.default.createElement("div",null,"缩小")):u.default.createElement("button",{disabled:-y>=h,onClick:function(){e.setState({imgWpercent:h-10})}},u.default.createElement(l.default,{type:"minus-circle"}),u.default.createElement("div",null,"缩小")),w&&"application/pdf"==w.get("mimeType")?u.default.createElement("button",{disabled:v>=4||"application/pdf"!==w.get("mimeType"),onClick:function(){e.setState({magnificationRate:v+.5})}},u.default.createElement(l.default,{type:"zoom-in"}),u.default.createElement("div",null,"放大")):u.default.createElement("button",{disabled:h>=b,onClick:function(){e.setState({imgWpercent:h+10})}},u.default.createElement(l.default,{type:"plus-circle"}),u.default.createElement("div",null,"放大")),u.default.createElement("button",{disabled:!a},a?u.default.createElement("span",{onClick:function(){return o(r.getIn([f,"signedUrl"]),r.getIn([f,"fileName"]))}},u.default.createElement(l.default,{type:"download"}),u.default.createElement("div",null,"下载")):u.default.createElement("a",null,u.default.createElement(l.default,{type:"download"}),u.default.createElement("div",null,"下载"))),u.default.createElement("button",{disabled:!(w&&"application/pdf"==w.get("mimeType")),onClick:function(){w&&"application/pdf"==w.get("mimeType")&&s.openLink({url:r.getIn([f,"signedUrl"])})}},u.default.createElement(l.default,{type:"printer"}),u.default.createElement("div",null,"打印")),u.default.createElement("button",{onClick:function(){return e.setState({idx:f+1,imgWpercent:0,rotate:0})},disabled:f===r.size-1},u.default.createElement(l.default,{type:"right-circle"}),u.default.createElement("div",null,"下一张"))),w&&"TRUE"===w.get("imageOrFile")&&n?u.default.createElement(m.default,{imgUrl:""+w.get("signedUrl"),imgWpercent:h,rotate:g,preview:n,maxLimit:b,minLimit:y}):"",w&&"application/pdf"===w.get("mimeType")&&n?u.default.createElement(p.default,{pdfUrl:""+w.get("signedUrl"),dispatch:c,magnificationRate:v,preview:n}):"",u.default.createElement("div",{className:"img-box",style:{display:w&&"application/pdf"!==w.get("mimeType")&&"TRUE"!==w.get("imageOrFile")?"":"none"}},u.default.createElement("div",{className:"img-box-contain"},u.default.createElement("div",{className:"img-box-contain-overflow"},u.default.createElement("div",{className:"noSupport"},u.default.createElement(l.default,{type:"file"}),u.default.createElement("p",null,"仅图片及PDF格式支持预览"))))),u.default.createElement("div",{className:"btnBar"},u.default.createElement("div",{className:"title"},"预览"),u.default.createElement("div",{onClick:i,className:"closeBtn"},u.default.createElement(l.default,{type:"close"}))))}}]),t}(),r.displayName="EnclosurePreview",r.propTypes={preview:c.default.bool,downloadPermission:c.default.bool,previewImgArr:c.default.instanceOf(d.List),closePreviewModal:c.default.func,dispatch:c.default.func,page:c.default.number,type:c.default.string},a=i))||a;t.default=b},1258:function(e,t,n){},1260:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,r,i,l=m(n(14)),o=m(n(37)),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();n(78),n(38);var c=m(n(1)),d=m(n(0)),f=n(17);n(1261);n(127),p(n(30));var s=p(n(1263));function p(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function m(e){return e&&e.__esModule?e:{default:e}}var g=(0,f.immutableRenderDecorator)((i=r=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.renderPdf=function(e){var t=document.getElementById("canvas_wrapper");t.innerHTML="";var a=atob(e),r=window.PDFJS;if(!r)return n.setState({networkFaild:!0}),o.default.info("网路问题导致PDF预览相关文件加载失败",2);if(r.cMapUrl="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.288/cmaps/",r.cMapPacked=!0,!r.getDocument)return n.setState({networkFaild:!0}),o.default.info("网路问题导致PDF预览相关文件加载失败",2);var i=r.getDocument({data:a}),l=n;i.promise.then(function(e){var n="";e.numPages;for(var a=0;a<e.numPages;a++)(n=document.createElement("canvas")).id="pdf_canvas_"+a,t.appendChild(n);for(var r=function(t){e.getPage(t+1).then(function(e){var n=e.getViewport(l.props.magnificationRate),a=document.getElementById("pdf_canvas_"+t);a.width=n.width,a.height=n.height;var r=a.getContext("2d");return e.render({canvasContext:r,viewport:n}).promise})},i=0;i<e.numPages;i++)r(i)}).catch(function(e){document.getElementById("canvas_wrapper").innerHTML="",l.setState({broken:!0})})},n.state={base64:"",broken:!1,networkFaild:!1},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,c.default.Component),u(t,[{key:"componentDidMount",value:function(){var e=this;this.props.dispatch(s.getCxpzUploadEnclosure(this.props.pdfUrl,function(t){t&&(e.setState({base64:t,broken:!1}),e.renderPdf(t))}))}},{key:"componentWillReceiveProps",value:function(e){var t=this;this.props.magnificationRate!==e.magnificationRate&&this.renderPdf(this.state.base64),this.props.pdfUrl!==e.pdfUrl&&this.props.dispatch(s.getCxpzUploadEnclosure(e.pdfUrl,function(e){e&&(t.setState({base64:e,broken:!1,networkFaild:!1}),t.renderPdf(e))}))}},{key:"render",value:function(){var e=this.props,t=(e.pdfUrl,e.dispatch,e.magnificationRate,this.state),n=t.broken,a=t.networkFaild;return c.default.createElement("div",{className:"img-box"},c.default.createElement("div",{className:"img-box-contain"},c.default.createElement("div",{className:"pdf-box-contain-overflow"},c.default.createElement("div",{className:"pdf_canvas_main"},c.default.createElement("div",{className:"pdf_canvas_pdf"},c.default.createElement("div",{id:"canvas_wrapper"}))),n?c.default.createElement("div",{className:"noSupport"},c.default.createElement(l.default,{type:"file"}),c.default.createElement("p",null,"PDF文件损坏，无法预览")):"",a?c.default.createElement("div",{className:"noSupport"},c.default.createElement(l.default,{type:"file"}),c.default.createElement("p",null,"网络异常，无法预览")):"")))}}]),t}(),r.displayName="PdfPreview",r.propTypes={pdfUrl:d.default.string,dispatch:d.default.func,magnificationRate:d.default.number},a=i))||a;t.default=g},1261:function(e,t,n){},1263:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCxpzUploadEnclosure=void 0;var a,r=n(31),i=(a=r)&&a.__esModule?a:{default:a},l=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1246)),o=(n(18),n(22));t.getCxpzUploadEnclosure=function(e,t){return function(n){n({type:l.SWITCH_LOADING_MASK}),e.indexOf("xfn-ddy-annex-bucket.oss-accelerate")>0&&(e=e.replace("xfn-ddy-annex-bucket.oss-accelerate","xfn-ddy-annex-bucket.oss-cn-hangzhou-internal")),(0,i.default)("uploadGetEnclosure","POST",JSON.stringify({enclosureUrl:e}),function(e){(0,o.showMessage)(e)?t(e.data.enclosureFile):t(""),n({type:l.SWITCH_LOADING_MASK})})}}},1264:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,r,i,l=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),o=c(n(1)),u=c(n(0));function c(e){return e&&e.__esModule?e:{default:e}}var d=(0,n(17).immutableRenderDecorator)((i=r=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.drawImgScal=function(e,t,a,r){var i,l,o,u,c,d=t/100,f=a/100,s=r/100;i=n.refs.bargraphCanvas,l=i.getContext("2d"),(o=new Image).onload=function(){!0,p()},o.src=e;var p=function(){-s<=d&&d<=f&&(0===d?(u=o.width>960?960:o.width*Number(1+d),c=o.width>960?960*o.height/o.width:o.height*Number(1+d)):(u=o.width>960?960*Number(1+d):o.width*Number(1+d),c=o.width>960?960*o.height/o.width*Number(1+d):o.height*Number(1+d)),n.setState({imgHeight:c,imgWidth:u}),i.width=u,i.height=c,l.clearRect(0,0,u,c),l.drawImage(o,0,0,o.width,o.height,0,0,u,c))}},n.state={imgHeight:0,imgWidth:0},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),l(t,[{key:"componentDidMount",value:function(){this.drawImgScal(this.props.imgUrl,this.props.imgWpercent,this.props.maxLimit,this.props.minLimit)}},{key:"componentWillReceiveProps",value:function(e){this.props.imgUrl!==e.imgUrl&&this.drawImgScal(e.imgUrl,e.imgWpercent,this.props.maxLimit,this.props.minLimit),this.props.imgUrl===e.imgUrl&&this.props.imgWpercent!==e.imgWpercent&&this.drawImgScal(this.props.imgUrl,e.imgWpercent,this.props.maxLimit,this.props.minLimit)}},{key:"isVertail",value:function(e){return!(e<90)&&(90===e||e%180!=0)}},{key:"render",value:function(){var e=this.props,t=(e.imgUrl,e.imgWpercent,e.rotate),n=this.state,a=n.imgHeight,r=n.imgWidth,i=0,l=0;return this.isVertail(t)?(a>960&&(i=a-960),r>960&&(l=r-960)):(r>960&&(i=r-960),a>960&&(l=a/2+10)),o.default.createElement("div",{className:"img-box"},o.default.createElement("div",{className:"img-box-contain"},o.default.createElement("div",{className:"img-box-contain-overflow"},o.default.createElement("canvas",{ref:"bargraphCanvas",style:{transform:"rotate("+t+"deg)",marginLeft:i+"px",marginTop:l+"px",display:"block"}}))))}}]),t}(),r.displayName="ImgPreview",r.propTypes={imgUrl:u.default.string,imgWpercent:u.default.number,rotate:u.default.number,maxLimit:u.default.number,minLimit:u.default.number},a=i))||a;t.default=d}}]);