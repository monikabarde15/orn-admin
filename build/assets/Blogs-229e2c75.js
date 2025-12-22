import{a as r,F as we,j as h,r as o,b as R,c as Ce,u as ke,s as Ne,P as Te,I as Se,d as Ie,D as $e,e as se}from"./index-aa6256f1.js";import{S as le}from"./sweetalert2.all-9ea85998.js";import{l as Pe}from"./quill.snow-74fbaf72.js";import{I as Ee,Y as H,y as A}from"./IconListCheck-29f54f00.js";import{I as Fe}from"./IconHorizontalDots-09e08eaf.js";const Me=({className:e,fill:t=!1,duotone:a=!0})=>r(we,{children:t?h("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:e,children:[r("path",{opacity:a?"0.5":"1",d:"M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z",fill:"currentColor"}),r("path",{d:"M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z",fill:"currentColor"}),r("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5C17.75 10.9142 17.4142 11.25 17 11.25H7C6.58579 11.25 6.25 10.9142 6.25 10.5ZM7.25 14C7.25 13.5858 7.58579 13.25 8 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H8C7.58579 14.75 7.25 14.4142 7.25 14ZM8.25 17.5C8.25 17.0858 8.58579 16.75 9 16.75H15C15.4142 16.75 15.75 17.0858 15.75 17.5C15.75 17.9142 15.4142 18.25 15 18.25H9C8.58579 18.25 8.25 17.9142 8.25 17.5Z",fill:a?"currentColor":"white"})]}):h("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:e,children:[r("path",{opacity:a?"0.5":"1",d:"M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195",stroke:"currentColor",strokeWidth:"1.5"}),r("path",{d:"M8 14H16",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),r("path",{d:"M7 10.5H17",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),r("path",{d:"M9 17.5H15",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),r("path",{d:"M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z",stroke:"currentColor",strokeWidth:"1.5"})]})}),je=({className:e,fill:t=!1,duotone:a=!0})=>h("svg",{width:"20",height:"20",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"1.5",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",className:e,children:[r("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),r("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]});let He={data:""},De=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||He,Be=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,ze=/\/\*[^]*?\*\/|  +/g,ie=/\n+/g,P=(e,t)=>{let a="",i="",c="";for(let n in e){let s=e[n];n[0]=="@"?n[1]=="i"?a=n+" "+s+";":i+=n[1]=="f"?P(s,n):n+"{"+P(s,n[1]=="k"?"":t)+"}":typeof s=="object"?i+=P(s,t?t.replace(/([^,])+/g,u=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,u):u?u+" "+d:d)):n):s!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),c+=P.p?P.p(n,s):n+":"+s+";")}return a+(t&&c?t+"{"+c+"}":c)+i},I={},oe=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+oe(e[a]);return t}return e},Ae=(e,t,a,i,c)=>{let n=oe(e),s=I[n]||(I[n]=(d=>{let p=0,f=11;for(;p<d.length;)f=101*f+d.charCodeAt(p++)>>>0;return"go"+f})(n));if(!I[s]){let d=n!==e?e:(p=>{let f,m,b=[{}];for(;f=Be.exec(p.replace(ze,""));)f[4]?b.shift():f[3]?(m=f[3].replace(ie," ").trim(),b.unshift(b[0][m]=b[0][m]||{})):b[0][f[1]]=f[2].replace(ie," ").trim();return b[0]})(e);I[s]=P(c?{["@keyframes "+s]:d}:d,a?"":"."+s)}let u=a&&I.g?I.g:null;return a&&(I.g=I[s]),((d,p,f,m)=>{m?p.data=p.data.replace(m,d):p.data.indexOf(d)===-1&&(p.data=f?d+p.data:p.data+d)})(I[s],t,i,u),s},Le=(e,t,a)=>e.reduce((i,c,n)=>{let s=t[n];if(s&&s.call){let u=s(a),d=u&&u.props&&u.props.className||/^go/.test(u)&&u;s=d?"."+d:u&&typeof u=="object"?u.props?"":P(u,""):u===!1?"":u}return i+c+(s??"")},"");function V(e){let t=this||{},a=e.call?e(t.p):e;return Ae(a.unshift?a.raw?Le(a,[].slice.call(arguments,1),t.p):a.reduce((i,c)=>Object.assign(i,c&&c.call?c(t.p):c),{}):a,De(t.target),t.g,t.o,t.k)}let ne,X,G;V.bind({g:1});let $=V.bind({k:1});function Oe(e,t,a,i){P.p=t,ne=e,X=a,G=i}function E(e,t){let a=this||{};return function(){let i=arguments;function c(n,s){let u=Object.assign({},n),d=u.className||c.className;a.p=Object.assign({theme:X&&X()},u),a.o=/ *go\d+/.test(d),u.className=V.apply(a,i)+(d?" "+d:""),t&&(u.ref=s);let p=e;return e[0]&&(p=u.as||e,delete u.as),G&&p[0]&&G(u),ne(p,u)}return t?t(c):c}}var _e=e=>typeof e=="function",_=(e,t)=>_e(e)?e(t):e,Re=(()=>{let e=0;return()=>(++e).toString()})(),de=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Ve=20,J="default",ce=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(s=>s.id===t.toast.id?{...s,...t.toast}:s)};case 2:let{toast:i}=t;return ce(e,{type:e.toasts.find(s=>s.id===i.id)?1:0,toast:i});case 3:let{toastId:c}=t;return{...e,toasts:e.toasts.map(s=>s.id===c||c===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(s=>s.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+n}))}}},O=[],ue={toasts:[],pausedAt:void 0,settings:{toastLimit:Ve}},S={},pe=(e,t=J)=>{S[t]=ce(S[t]||ue,e),O.forEach(([a,i])=>{a===t&&i(S[t])})},me=e=>Object.keys(S).forEach(t=>pe(e,t)),Ze=e=>Object.keys(S).find(t=>S[t].toasts.some(a=>a.id===e)),Z=(e=J)=>t=>{pe(t,e)},Ue={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},We=(e={},t=J)=>{let[a,i]=o.useState(S[t]||ue),c=o.useRef(S[t]);o.useEffect(()=>(c.current!==S[t]&&i(S[t]),O.push([t,i]),()=>{let s=O.findIndex(([u])=>u===t);s>-1&&O.splice(s,1)}),[t]);let n=a.toasts.map(s=>{var u,d,p;return{...e,...e[s.type],...s,removeDelay:s.removeDelay||((u=e[s.type])==null?void 0:u.removeDelay)||(e==null?void 0:e.removeDelay),duration:s.duration||((d=e[s.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||Ue[s.type],style:{...e.style,...(p=e[s.type])==null?void 0:p.style,...s.style}}});return{...a,toasts:n}},Ye=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Re()}),B=e=>(t,a)=>{let i=Ye(t,e,a);return Z(i.toasterId||Ze(i.id))({type:2,toast:i}),i.id},v=(e,t)=>B("blank")(e,t);v.error=B("error");v.success=B("success");v.loading=B("loading");v.custom=B("custom");v.dismiss=(e,t)=>{let a={type:3,toastId:e};t?Z(t)(a):me(a)};v.dismissAll=e=>v.dismiss(void 0,e);v.remove=(e,t)=>{let a={type:4,toastId:e};t?Z(t)(a):me(a)};v.removeAll=e=>v.remove(void 0,e);v.promise=(e,t,a)=>{let i=v.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(c=>{let n=t.success?_(t.success,c):void 0;return n?v.success(n,{id:i,...a,...a==null?void 0:a.success}):v.dismiss(i),c}).catch(c=>{let n=t.error?_(t.error,c):void 0;n?v.error(n,{id:i,...a,...a==null?void 0:a.error}):v.dismiss(i)}),e};var qe=1e3,Ke=(e,t="default")=>{let{toasts:a,pausedAt:i}=We(e,t),c=o.useRef(new Map).current,n=o.useCallback((m,b=qe)=>{if(c.has(m))return;let g=setTimeout(()=>{c.delete(m),s({type:4,toastId:m})},b);c.set(m,g)},[]);o.useEffect(()=>{if(i)return;let m=Date.now(),b=a.map(g=>{if(g.duration===1/0)return;let j=(g.duration||0)+g.pauseDuration-(m-g.createdAt);if(j<0){g.visible&&v.dismiss(g.id);return}return setTimeout(()=>v.dismiss(g.id,t),j)});return()=>{b.forEach(g=>g&&clearTimeout(g))}},[a,i,t]);let s=o.useCallback(Z(t),[t]),u=o.useCallback(()=>{s({type:5,time:Date.now()})},[s]),d=o.useCallback((m,b)=>{s({type:1,toast:{id:m,height:b}})},[s]),p=o.useCallback(()=>{i&&s({type:6,time:Date.now()})},[i,s]),f=o.useCallback((m,b)=>{let{reverseOrder:g=!1,gutter:j=8,defaultPosition:F}=b||{},N=a.filter(w=>(w.position||F)===(m.position||F)&&w.height),W=N.findIndex(w=>w.id===m.id),D=N.filter((w,C)=>C<W&&w.visible).length;return N.filter(w=>w.visible).slice(...g?[D+1]:[0,D]).reduce((w,C)=>w+(C.height||0)+j,0)},[a]);return o.useEffect(()=>{a.forEach(m=>{if(m.dismissed)n(m.id,m.removeDelay);else{let b=c.get(m.id);b&&(clearTimeout(b),c.delete(m.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:d,startPause:u,endPause:p,calculateOffset:f}}},Qe=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Xe=$`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ge=$`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Je=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Qe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Xe} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Ge} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,et=$`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,tt=E("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${et} 1s linear infinite;
`,at=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,rt=$`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,st=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${at} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${rt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,lt=E("div")`
  position: absolute;
`,it=E("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ot=$`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,nt=E("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ot} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,dt=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return t!==void 0?typeof t=="string"?o.createElement(nt,null,t):t:a==="blank"?null:o.createElement(it,null,o.createElement(tt,{...i}),a!=="loading"&&o.createElement(lt,null,a==="error"?o.createElement(Je,{...i}):o.createElement(st,{...i})))},ct=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ut=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,pt="0%{opacity:0;} 100%{opacity:1;}",mt="0%{opacity:1;} 100%{opacity:0;}",ft=E("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ht=E("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,gt=(e,t)=>{let a=e.includes("top")?1:-1,[i,c]=de()?[pt,mt]:[ct(a),ut(a)];return{animation:t?`${$(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${$(c)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},bt=o.memo(({toast:e,position:t,style:a,children:i})=>{let c=e.height?gt(e.position||t||"top-center",e.visible):{opacity:0},n=o.createElement(dt,{toast:e}),s=o.createElement(ht,{...e.ariaProps},_(e.message,e));return o.createElement(ft,{className:e.className,style:{...c,...a,...e.style}},typeof i=="function"?i({icon:n,message:s}):o.createElement(o.Fragment,null,n,s))});Oe(o.createElement);var yt=({id:e,className:t,style:a,onHeightUpdate:i,children:c})=>{let n=o.useCallback(s=>{if(s){let u=()=>{let d=s.getBoundingClientRect().height;i(e,d)};u(),new MutationObserver(u).observe(s,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return o.createElement("div",{ref:n,className:t,style:a},c)},vt=(e,t)=>{let a=e.includes("top"),i=a?{top:0}:{bottom:0},c=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:de()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...i,...c}},xt=V`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,L=16,wt=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:c,toasterId:n,containerStyle:s,containerClassName:u})=>{let{toasts:d,handlers:p}=Ke(a,n);return o.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:L,left:L,right:L,bottom:L,pointerEvents:"none",...s},className:u,onMouseEnter:p.startPause,onMouseLeave:p.endPause},d.map(f=>{let m=f.position||t,b=p.calculateOffset(f,{reverseOrder:e,gutter:i,defaultPosition:t}),g=vt(m,b);return o.createElement(yt,{id:f.id,key:f.id,onHeightUpdate:p.updateHeight,className:f.visible?xt:"",style:g},f.type==="custom"?_(f.message,f):c?c(f):o.createElement(bt,{toast:f,position:m}))}))};const U="https://cybitbackend.onrender.com/api",Ct=()=>R.get(`${U}/blogs`),kt=e=>R.post(`${U}/blogs`,e),Nt=(e,t)=>R.put(`${U}/blogs/${e}`,t),Tt=e=>R.delete(`${U}/blogs/${e}`),Ft=()=>{const e=Ce();ke(l=>l.themeConfig.rtlClass==="rtl");const t={id:"",title:"",description:"",descriptionText:"",image:null,priority:"low",tag:""},[a,i]=o.useState([]),[c,n]=o.useState([]),[s,u]=o.useState([]),[d,p]=o.useState(t),[f,m]=o.useState(null),[b,g]=o.useState(!1),[j,F]=o.useState(!1),[N,W]=o.useState(t),[D,w]=o.useState(""),[C,fe]=o.useState(""),[z,Y]=o.useState(!1),[x]=o.useState({currentPage:1,totalPages:0,pageSize:10,startIndex:0,endIndex:0});o.useEffect(()=>{e(Ne("Blogs")),q()},[]);const q=async()=>{try{const l=await Ct();l.data.success?(i(l.data.data),u(l.data.data),ee(l.data.data)):(i([]),u([]))}catch(l){console.error(l),i([]),u([])}},he=l=>{const{value:y,id:T}=l.target;p({...d,[T]:y})},ge=l=>{if(l.target.files&&l.target.files[0]){p({...d,image:l.target.files[0]});const y=new FileReader;y.onload=()=>m(y.result),y.readAsDataURL(l.target.files[0])}},K=(l=!0)=>{l&&(x.currentPage=1);let y=a.filter(k=>k.status!=="trash");["complete","important","trash"].includes(C)?y=a.filter(k=>k.status===C):["team","update"].includes(C)?y=y.filter(k=>k.tag===C):["high","medium","low"].includes(C)&&(y=y.filter(k=>k.priority===C));const T=y.filter(k=>{var re;return(re=k.title)==null?void 0:re.toLowerCase().includes(D.toLowerCase())});u(T),ee(T)},ee=l=>{if(!l.length){n([]),x.startIndex=-1,x.endIndex=-1;return}x.totalPages=Math.ceil(l.length/x.pageSize),x.currentPage>x.totalPages&&(x.currentPage=1),x.startIndex=(x.currentPage-1)*x.pageSize,x.endIndex=Math.min(x.startIndex+x.pageSize-1,l.length-1),n(l.slice(x.startIndex,x.endIndex+1))},be=l=>{const y=s.map(T=>T._id===l._id?{...T,status:T.status==="complete"?"":"complete"}:T);u(y),K(!1)},te=(l=null)=>{Y(!1),l?(p({...l}),m(l.path?`/images/${l.path}`:null)):(p(t),m(null)),g(!0)},ye=l=>{W(l),F(!0)},M=(l,y)=>{le.fire({toast:!0,position:"top-end",showConfirmButton:!1,timer:2e3,timerProgressBar:!0,icon:l,title:y})},[Q,ae]=o.useState(!1),ve=async()=>{if(!d.title||!d.title.trim())return M("warning","Title is required!");if(!d.descriptionText||!d.descriptionText.trim())return M("warning","Description is required!");try{ae(!0);const l=new FormData;l.append("title",d.title),l.append("description",d.description),d.image&&l.append("image",d.image),d._id?(await Nt(d._id,l),M("success","Blog updated successfully!")):(await kt(l),M("success","Blog added successfully!")),g(!1),q()}catch(l){console.error(l),M("error","Something went wrong. Try again!")}finally{ae(!1)}},xe=async l=>{try{(await le.fire({title:"Are you sure?",text:"This blog will be permanently deleted!",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, delete it!",cancelButtonText:"Cancel"})).isConfirmed&&(await Tt(l._id),q(),M("success","Blog deleted successfully!"))}catch(y){console.error(y),M("error","Failed to delete blog!")}};return h("div",{className:"flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full",children:[r(wt,{position:"top-right",reverseOrder:!1}),r("div",{className:`panel p-4 flex-none w-[240px] max-w-full absolute xl:relative z-10 space-y-4 xl:h-auto h-full xl:block ltr:xl:rounded-r-md ltr:rounded-r-none rtl:xl:rounded-l-md rtl:rounded-l-none hidden ${z&&"!block"}`,children:h("div",{className:"flex flex-col h-full pb-16",children:[h("div",{className:"pb-5 flex text-center items-center",children:[r(Me,{}),r("h3",{className:"text-lg font-semibold ltr:ml-3 rtl:mr-3",children:"Blog List"})]}),r("div",{className:"h-px w-full border-b border-white-light dark:border-[#1b2e4b] mb-5"}),r(Te,{className:"relative ltr:pr-3.5 rtl:pl-3.5 ltr:-mr-3.5 rtl:-ml-3.5 h-full grow",children:r("div",{className:"space-y-1",children:h("button",{type:"button",className:`w-full flex justify-between items-center p-2 rounded-md font-medium h-10 ${C===""?"bg-gray-100 dark:text-primary text-primary dark:bg-[#181F32]":""}`,onClick:()=>{fe(""),K()},children:[h("div",{className:"flex items-center",children:[r(Ee,{className:"w-4.5 h-4.5 shrink-0"}),r("div",{className:"ltr:ml-3 rtl:mr-3",children:"Inbox"})]}),r("div",{className:"bg-primary-light dark:bg-[#060818] rounded-md py-0.5 px-2 font-semibold whitespace-nowrap",children:a.filter(l=>l.status!=="trash").length})]})})}),r("div",{className:"ltr:left-0 rtl:right-0 absolute bottom-0 p-4 w-full",children:h("button",{className:"btn btn-primary w-full",onClick:()=>te(),children:[r(je,{className:"ltr:mr-2 rtl:ml-2 shrink-0"}),"Add New Blog"]})})]})}),r("div",{className:`overlay bg-black/60 z-[5] w-full h-full rounded-md absolute hidden ${z&&"!block xl:!hidden"}`,onClick:()=>Y(!z)}),r("div",{className:"panel p-0 flex-1 overflow-auto h-full",children:h("div",{className:"flex flex-col h-full",children:[r("div",{className:"p-4 flex sm:flex-row flex-col w-full sm:items-center gap-4",children:h("div",{className:"ltr:mr-3 rtl:ml-3 flex items-center flex-1",children:[r("button",{type:"button",className:"xl:hidden hover:text-primary",onClick:()=>Y(!z),children:r(Se,{})}),h("div",{className:"relative flex-1",children:[r("input",{type:"text",className:"form-input peer ltr:!pr-10 rtl:!pl-10",placeholder:"Search Task...",value:D,onChange:l=>w(l.target.value),onKeyUp:()=>K()}),r("div",{className:"absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary",children:r(Ie,{})})]})]})}),r("div",{className:"table-responsive grow overflow-y-auto sm:min-h-[300px] min-h-[400px]",children:c.length?r("table",{className:"table-hover w-full",children:r("tbody",{children:c.map(l=>h("tr",{className:"group cursor-pointer",children:[r("td",{className:"w-1",children:r("input",{type:"checkbox",className:"form-checkbox",onClick:()=>be(l),defaultChecked:l.status==="complete"})}),h("td",{onClick:()=>ye(l),children:[r("div",{className:`font-semibold ${l.status==="complete"?"line-through":""}`,children:l.title}),r("div",{className:`text-gray-600 line-clamp-2 ${l.status==="complete"?"line-through":""}`,dangerouslySetInnerHTML:{__html:l.description}})]}),r("td",{children:r("div",{className:"dropdown",children:r($e,{button:r(Fe,{}),children:h("ul",{children:[r("li",{children:r("button",{onClick:()=>te(l),children:"Edit"})}),r("li",{children:r("button",{onClick:()=>xe(l),children:"Delete"})})]})})})})]},l._id))})}):r("div",{className:"flex justify-center items-center font-semibold text-lg min-h-[300px]",children:"No data available"})})]})}),r(H,{appear:!0,show:b,as:o.Fragment,children:h(A,{as:"div",className:"relative z-[51]",onClose:()=>g(!1),children:[r(H.Child,{as:o.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:r("div",{className:"fixed inset-0 bg-[black]/60"})}),r("div",{className:"fixed inset-0 overflow-y-auto",children:r("div",{className:"flex min-h-full items-center justify-center px-4 py-8",children:r(H.Child,{as:o.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:h(A.Panel,{className:"panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark",children:[r("button",{type:"button",onClick:()=>g(!1),className:"absolute top-4 ltr:right-4 rtl:left-4",children:r(se,{})}),r("div",{className:"text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]",children:d.id?"Edit Blog":"Add Blog"}),h("div",{className:"p-5",children:[h("div",{className:"mb-5",children:[r("label",{children:"Title"}),r("input",{id:"title",type:"text",className:"form-input",value:d.title,onChange:he})]}),h("div",{className:"mb-5",children:[r("label",{children:"Image"}),r("input",{type:"file",accept:"image/*",onChange:ge}),f&&r("img",{src:f,className:"h-32 w-32 object-cover rounded-md mt-2",alt:"Preview"})]}),h("div",{className:"mb-5",children:[r("label",{children:"Description"}),r(Pe,{theme:"snow",value:d.description,onChange:(l,y,T,k)=>p({...d,description:l,descriptionText:k.getText()}),style:{minHeight:"200px"}})]}),h("div",{className:"flex justify-end gap-2 mt-4",children:[r("button",{className:"btn btn-outline-danger",onClick:()=>g(!1),children:"Cancel"}),r("button",{className:`btn btn-primary ${Q?"opacity-50 cursor-not-allowed":""}`,onClick:ve,disabled:Q,children:Q?"Saving...":d.id?"Update":"Add"})]})]})]})})})})]})}),r(H,{appear:!0,show:j,as:o.Fragment,children:h(A,{as:"div",className:"relative z-[51]",onClose:()=>F(!1),children:[r(H.Child,{as:o.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:r("div",{className:"fixed inset-0 bg-[black]/60"})}),r("div",{className:"fixed inset-0 overflow-y-auto",children:r("div",{className:"flex min-h-full items-center justify-center px-4 py-8",children:r(H.Child,{as:o.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:h(A.Panel,{className:"panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark",children:[r("button",{type:"button",onClick:()=>F(!1),className:"absolute top-4 ltr:right-4 rtl:left-4",children:r(se,{})}),h("div",{className:"flex items-center flex-wrap gap-2 text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3",children:[r("div",{children:N.title}),N.priority&&r("div",{className:"badge",children:N.priority}),N.tag&&r("div",{className:"badge",children:N.tag})]}),h("div",{className:"p-5",children:[r("div",{dangerouslySetInnerHTML:{__html:N.description}}),r("div",{className:"flex justify-end mt-4",children:r("button",{className:"btn btn-outline-danger",onClick:()=>F(!1),children:"Close"})})]})]})})})})]})})]})};export{kt as addBlog,Ft as default,Tt as deleteBlog,Ct as fetchBlogs,Nt as updateBlog};
