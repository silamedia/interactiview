(function(){"use strict";const S=`.sfi {
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

.sfi--side .sfi__layout {
  grid-template-columns: minmax(320px, 1fr) minmax(240px, 0.42fr);
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

.sfi__questions-panel {
  min-width: 0;
}

.sfi__help {
  margin: 0 0 8px;
  opacity: 0.65;
  font-size: 0.875em;
}

.sfi__questions {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sfi__question-button {
  display: grid;
  width: 100%;
  gap: 3px;
  align-items: start;
  border: 0;
  border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent);
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

.sfi__question-text {
  color: inherit;
}

.sfi__source {
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
  .sfi--side .sfi__layout,
  .sfi__layout {
    grid-template-columns: 1fr;
  }

  .sfi__branding {
    text-align: left;
  }
}
`;crypto.randomUUID();function w(n){const e=n.trim();if(!e)return null;if(/^\d+$/.test(e))return Number(e);if(e.match(/^(\d{1,2}:)?\d{1,2}:\d{2}$/))return e.split(":").map(Number).reduce((r,a)=>r*60+a,0);const t=e.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);if(t&&t[0]){const r=Number(t[1]||0),a=Number(t[2]||0),d=Number(t[3]||0);return r*3600+a*60+d}return null}function q(n){try{const e=new URL(n);return e.hostname==="youtu.be"?u(e.pathname.slice(1)):e.pathname.startsWith("/embed/")||e.pathname.startsWith("/shorts/")?u(e.pathname.split("/")[2]):u(e.searchParams.get("v")||"")}catch{return u(n)}}function k(n){const e=n.items.flatMap(i=>{const t=q(i.youtubeUrl),r=w(i.start),a=w(i.end);return!t||r===null||a===null||a<=r?[]:[{...i,videoId:t,startSeconds:r,endSeconds:a}]});return{title:n.title.trim(),description:n.description.trim(),poster:n.poster.trim(),layout:n.layout==="side"?"side":"stacked",items:e}}function E(n){if(!n)return null;try{const e=JSON.parse(decodeURIComponent(n));return{title:e.title||"",description:e.description||"",poster:e.poster||"",layout:e.layout==="side"?"side":"stacked",items:e.items||[]}}catch{return null}}function u(n){return/^[a-zA-Z0-9_-]{11}$/.test(n)?n:null}function o(n,e={}){const i=document.createElement(n);return e.className&&(i.className=e.className),e.text!==void 0&&(i.textContent=e.text),Object.entries(e.attrs||{}).forEach(([t,r])=>{i.setAttribute(t,r)}),i}function C(n){for(;n.firstChild;)n.firstChild.remove()}let m=null;function P(n,e,i={}){const t=k(e);C(n),n.classList.add("sfi"),n.classList.toggle("sfi--side",t.layout==="side"),n.classList.toggle("sfi--stacked",t.layout!=="side");const r=o("h2",{className:"sfi__title",text:t.title||"Interview"}),a=o("p",{className:"sfi__description",text:t.description}),d=o("div",{className:"sfi__layout"}),p=o("div",{className:"sfi__media"}),g=o("div",{className:"sfi__player"}),b=o("div",{className:"sfi__questions-panel"}),_=o("ul",{className:"sfi__questions"});let l=null,h=null,y=null;if(t.poster){const s=o("img",{className:"sfi__poster",attrs:{src:t.poster,alt:""}});s.addEventListener("error",()=>{s.remove(),t.items[0]&&N(t.items[0])}),p.append(s)}p.append(g),!t.poster&&t.items[0]&&N(t.items[0]),t.items.forEach(s=>{const f=o("li",{className:"sfi__question"}),c=o("button",{className:"sfi__question-button"});c.type="button",c.append(o("span",{className:"sfi__question-text",text:s.question||"Вопрос"})),s.source&&c.append(o("span",{className:"sfi__source",text:s.source})),c.addEventListener("click",async()=>{h=s,A(_,f);const Y=await x();l?l.loadVideoById({videoId:s.videoId,startSeconds:s.startSeconds,endSeconds:s.endSeconds}):(l=v(Y,g,s,()=>l,()=>h,()=>y,V=>{y=V}),l.loadVideoById({videoId:s.videoId,startSeconds:s.startSeconds,endSeconds:s.endSeconds}))}),f.append(c),_.append(f)}),t.items.length?b.append(o("p",{className:"sfi__help",text:"Кликните на вопрос, чтобы увидеть видеоответ."})):_.append(o("li",{className:"sfi__empty",text:"Нет валидных фрагментов для показа."})),b.append(_),d.append(p,b),n.append(r),t.description&&n.append(a),n.append(d,L());async function N(s){const f=await x();l||(h=s,l=v(f,g,s,()=>l,()=>h,()=>y,c=>{y=c}))}}function A(n,e){n.querySelectorAll(".sfi__question").forEach(i=>{i.classList.toggle("sfi__question--active",i===e)})}function z(n,e,i,t){i!==null&&window.clearInterval(i);const r=window.setInterval(()=>{const a=n(),d=e();!a||!d||a.getCurrentTime()>=d.endSeconds&&(a.pauseVideo(),window.clearInterval(r),t(null))},200);t(r)}function v(n,e,i,t,r,a,d){return new n.Player(e,{width:"100%",height:"100%",videoId:i.videoId,playerVars:{autoplay:0,controls:1,rel:0,modestbranding:1,playsinline:1,start:i.startSeconds,end:i.endSeconds},events:{onReady:()=>{t()?.cueVideoById({videoId:i.videoId,startSeconds:i.startSeconds,endSeconds:i.endSeconds})},onStateChange:p=>{p.data===n.PlayerState.PLAYING&&z(t,r,a(),d)}}})}function x(){return window.YT?.Player?Promise.resolve(window.YT):m||(m=new Promise(n=>{const e=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{e?.(),n(window.YT)};const i=document.createElement("script");i.src="https://www.youtube.com/iframe_api",document.head.append(i)}),m)}function L(){const n=o("p",{className:"sfi__branding"}),e=o("a",{text:"Silamedia Interactiview",attrs:{href:"https://sila.media",target:"_blank",rel:"noreferrer"}});return n.append(e),n}const T=".sila-fragment-interview[data-interview]",I="sila-fragment-interview-styles";if(!document.getElementById(I)){const n=document.createElement("style");n.id=I,n.textContent=S,document.head.append(n)}document.querySelectorAll(T).forEach(n=>{const e=E(n.dataset.interview||null);if(!e){n.textContent="Sila Fragment Interview: invalid data.";return}P(n,e)})})();
