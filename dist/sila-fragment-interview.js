(function(){"use strict";const N=`.sfi {
  max-width: 100%;
}

.sfi *,
.sfi *::before,
.sfi *::after {
  box-sizing: border-box;
}

.sfi__title {
  margin: 0 0 8px;
}

.sfi__description {
  max-width: 72ch;
  margin: 0 0 18px;
}

.sfi__layout {
  display: grid;
  grid-template-columns: minmax(320px, 1fr);
  gap: 14px;
  align-items: start;
}

.sfi__media {
  position: relative;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: #111;
}

.sfi__media::before {
  display: block;
  padding-top: 56.25%;
  content: "";
}

.sfi__poster,
.sfi__player,
.sfi__player iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.sfi__poster {
  object-fit: cover;
}

.sfi__player {
  z-index: 1;
}

.sfi__status {
  position: absolute;
  right: 12px;
  bottom: 10px;
  z-index: 2;
  max-width: calc(100% - 24px);
  margin: 0;
  padding: 6px 8px;
  background: rgb(0 0 0 / 0.68);
  color: #fff;
  font-size: 12px;
  line-height: 1.3;
}

.sfi__questions {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 12px 0 0;
  list-style: none;
}

.sfi__question-button {
  display: grid;
  width: 100%;
  grid-template-columns: auto 1fr;
  gap: 3px 10px;
  align-items: start;
  border: 0;
  border-top: 1px solid var(--sfi-line);
  border-radius: 0;
  padding: 10px 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.sfi__question-button:hover,
.sfi__question--active .sfi__question-button {
  color: inherit;
  background: transparent;
}

.sfi__question-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 1px;
}

.sfi__question-index {
  opacity: 0.55;
}

.sfi__question-text {
  color: inherit;
}

.sfi__source {
  grid-column: 2;
  opacity: 0.65;
  font-size: 0.875em;
}

.sfi__empty {
  padding: 12px;
}

.sfi__branding {
  margin: 6px 0 0;
  font-size: 10px;
  line-height: 1.2;
  opacity: 0.55;
  text-align: right;
}

.sfi__branding a {
  color: inherit;
  text-decoration: none;
  border: 0;
  font-size: inherit;
  font-weight: 400;
}

.sfi__branding a:hover {
  opacity: 1;
}

@media (max-width: 720px) {
  .sfi__layout {
    grid-template-columns: 1fr;
  }

  .sfi__branding {
    text-align: left;
  }
}
`;crypto.randomUUID();function g(n){const t=n.trim();if(!t)return null;if(/^\d+$/.test(t))return Number(t);if(t.match(/^(\d{1,2}:)?\d{1,2}:\d{2}$/))return t.split(":").map(Number).reduce((r,a)=>r*60+a,0);const e=t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);if(e&&e[0]){const r=Number(e[1]||0),a=Number(e[2]||0),d=Number(e[3]||0);return r*3600+a*60+d}return null}function S(n){try{const t=new URL(n);return t.hostname==="youtu.be"?u(t.pathname.slice(1)):t.pathname.startsWith("/embed/")||t.pathname.startsWith("/shorts/")?u(t.pathname.split("/")[2]):u(t.searchParams.get("v")||"")}catch{return u(n)}}function q(n){const t=n.items.flatMap(i=>{const e=S(i.youtubeUrl),r=g(i.start),a=g(i.end);return!e||r===null||a===null||a<=r?[]:[{...i,videoId:e,startSeconds:r,endSeconds:a}]});return{title:n.title.trim(),description:n.description.trim(),poster:n.poster.trim(),items:t}}function C(n){if(!n)return null;try{return JSON.parse(decodeURIComponent(n))}catch{return null}}function u(n){return/^[a-zA-Z0-9_-]{11}$/.test(n)?n:null}function o(n,t={}){const i=document.createElement(n);return t.className&&(i.className=t.className),t.text!==void 0&&(i.textContent=t.text),Object.entries(t.attrs||{}).forEach(([e,r])=>{i.setAttribute(e,r)}),i}function k(n){for(;n.firstChild;)n.firstChild.remove()}let f=null;function E(n,t,i={}){const e=q(t);k(n),n.classList.add("sfi");const r=o("h2",{className:"sfi__title",text:e.title||"Interview"}),a=o("p",{className:"sfi__description",text:e.description}),d=o("div",{className:"sfi__layout"}),l=o("div",{className:"sfi__media"}),y=o("div",{className:"sfi__player"}),m=o("ol",{className:"sfi__questions"}),_=o("p",{className:"sfi__status",text:"Выберите вопрос."});let c=null,w=null,v=null;if(e.poster){const s=o("img",{className:"sfi__poster",attrs:{src:e.poster,alt:""}});l.append(s)}l.append(y,_),e.items.forEach((s,Y)=>{const h=o("li",{className:"sfi__question"}),p=o("button",{className:"sfi__question-button"});p.type="button",p.append(o("span",{className:"sfi__question-index",text:String(Y+1).padStart(2,"0")}),o("span",{className:"sfi__question-text",text:s.question||"Untitled question"})),s.source&&p.append(o("span",{className:"sfi__source",text:s.source})),p.addEventListener("click",async()=>{w=s,P(m,h),_.textContent="Загрузка фрагмента...";const I=await A();c?c.loadVideoById({videoId:s.videoId,startSeconds:s.startSeconds,endSeconds:s.endSeconds}):c=new I.Player(y,{width:"100%",height:"100%",videoId:s.videoId,playerVars:{autoplay:1,controls:1,rel:0,modestbranding:1,playsinline:1,start:s.startSeconds,end:s.endSeconds},events:{onReady:()=>{c?.loadVideoById({videoId:s.videoId,startSeconds:s.startSeconds,endSeconds:s.endSeconds}),c?.playVideo()},onStateChange:U=>{U.data===I.PlayerState.PLAYING&&z(()=>c,()=>w,_,v,M=>{v=M})}}}),_.textContent=`${s.question} (${b(s)})`}),h.append(p),m.append(h)}),e.items.length||m.append(o("li",{className:"sfi__empty",text:"Нет валидных фрагментов для показа."})),d.append(l,m),n.append(r),e.description&&n.append(a),n.append(d,$())}function P(n,t){n.querySelectorAll(".sfi__question").forEach(i=>{i.classList.toggle("sfi__question--active",i===t)})}function z(n,t,i,e,r){e!==null&&window.clearInterval(e);const a=window.setInterval(()=>{const d=n(),l=t();!d||!l||d.getCurrentTime()>=l.endSeconds&&(d.pauseVideo(),i.textContent=`Фрагмент завершен: ${b(l)}`,window.clearInterval(a),r(null))},200);r(a)}function A(){return window.YT?.Player?Promise.resolve(window.YT):f||(f=new Promise(n=>{const t=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{t?.(),n(window.YT)};const i=document.createElement("script");i.src="https://www.youtube.com/iframe_api",document.head.append(i)}),f)}function b(n){return`${n.start} - ${n.end}`}function $(){const n=o("p",{className:"sfi__branding"}),t=o("a",{text:"Silamedia Interactiview",attrs:{href:"https://sila.media",target:"_blank",rel:"noreferrer"}});return n.append(t),n}const T=".sila-fragment-interview[data-interview]",x="sila-fragment-interview-styles";if(!document.getElementById(x)){const n=document.createElement("style");n.id=x,n.textContent=N,document.head.append(n)}document.querySelectorAll(T).forEach(n=>{const t=C(n.dataset.interview||null);if(!t){n.textContent="Sila Fragment Interview: invalid data.";return}E(n,t)})})();
