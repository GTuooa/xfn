(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[95],{1019:function(e,t,n){"use strict";n.r(t),n.d(t,"reducer",(function(){return f})),n.d(t,"view",(function(){return h}));n(29),n(48);var a,r=n(7),i=n(8),o=n(109),c=n(9),s=n(10),l=n(0),d=n.n(l),p=n(47),m=n(2),u=(n(17),n(11)),v=(n(1888),n(225)),h=Object(p.c)((function(e){return e}))(a=function(e){Object(s.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).htmlWidth=0,a.renderPdf=function(e){var t=document.getElementById("canvas_wrapper");t.innerHTML="";var n=atob(e),r=window.PDFJS;if(!r)return a.setState({networkFaild:!0}),message.info("\u7f51\u8def\u95ee\u9898\u5bfc\u81f4PDF\u9884\u89c8\u76f8\u5173\u6587\u4ef6\u52a0\u8f7d\u5931\u8d25",2);if(r.cMapUrl="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.288/cmaps/",r.cMapPacked=!0,!r.getDocument)return a.setState({networkFaild:!0}),message.info("\u7f51\u8def\u95ee\u9898\u5bfc\u81f4PDF\u9884\u89c8\u76f8\u5173\u6587\u4ef6\u52a0\u8f7d\u5931\u8d25",2);var i=r.getDocument({data:n}),c=Object(o.a)(a);i.promise.then((function(e){for(var n="",a=(e.numPages,0);a<e.numPages;a++)(n=document.createElement("canvas")).id="pdf_canvas_".concat(a),t.appendChild(n);for(var r=function(t){e.getPage(t+1).then((function(e){var n=e.pageInfo.view[2],a=function(){var e=document.getElementById("pdf_canvas_".concat(t)).getContext("2d");return(window.devicePixelRatio||1)/(e.webkitBackingStorePixelRatio||e.mozBackingStorePixelRatio||e.msBackingStorePixelRatio||e.oBackingStorePixelRatio||e.backingStorePixelRatio||1)}(),r=e.getViewport((c.htmlWidth-20)/n),i=document.getElementById("pdf_canvas_".concat(t));console.log("viewport.width",r.width),i.style.width=r.width+"px",i.style.height=r.height+"px",i.width=r.width*a,i.height=r.height*a;var o=i.getContext("2d");return e.render({transform:[a,0,0,a,0,0],canvasContext:o,viewport:r}).promise}))},i=0;i<e.numPages;i++)r(i)})).catch((function(e){document.getElementById("canvas_wrapper").innerHTML="",c.setState({broken:!0}),console.error("PDFPreviewError: "+e)}))},a.state={broken:!1,networkFaild:!1},a}return Object(i.a)(n,[{key:"componentDidMount",value:function(){m.a.setTitle({title:"PDF\u9884\u89c8"}),m.a.setIcon({showIcon:!1}),m.a.setRight({show:!1}),this.props.previewEnclosureState.get("base64")&&(this.setState({broken:!1}),this.renderPdf(this.props.previewEnclosureState.get("base64")));var e=document.getElementById("canvas_wrapper");this.htmlWidth=Number(window.getComputedStyle(e).width.replace("px",""))}},{key:"componentWillReceiveProps",value:function(e){console.log("dededfef")}},{key:"render",value:function(){var e=this.props,t=(e.dispatch,e.previewEnclosureState,this.state),n=t.broken,a=t.networkFaild;return d.a.createElement(u.h,{className:"img-box"},d.a.createElement("div",{className:"img-box-contain"},d.a.createElement("div",{className:"pdf-box-contain-overflow"},d.a.createElement("div",{className:"pdf_canvas_main"},d.a.createElement("div",{className:"pdf_canvas_pdf"},d.a.createElement("div",{id:"canvas_wrapper"}))),n?d.a.createElement("div",{className:"noSupport"},d.a.createElement(u.l,{type:"file"}),d.a.createElement("p",null,"PDF\u6587\u4ef6\u635f\u574f\uff0c\u65e0\u6cd5\u9884\u89c8")):"",a?d.a.createElement("div",{className:"noSupport"},d.a.createElement(u.l,{type:"file"}),d.a.createElement("p",null,"\u7f51\u7edc\u5f02\u5e38\uff0c\u65e0\u6cd5\u9884\u89c8")):"")))}}]),n}(d.a.Component))||a,f={previewEnclosureState:v.a}},1888:function(e,t,n){}}]);