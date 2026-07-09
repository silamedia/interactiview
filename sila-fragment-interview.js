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
`;crypto.randomUUID();function w(n){const e=n.trim();if(!e)return null;if(/^\d+$/.test(e))return Number(e);if(e.match(/^(\d{1,2}:)?\d{1,2}:\d{2}$/))return e.split(":").map(Number).reduce((o,a)=>o*60+a,0);const t=e.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);if(t&&t[0]){const o=Number(t[1]||0),a=Number(t[2]||0),d=Number(t[3]||0);return o*3600+a*60+d}return null}function S(n){try{const e=new URL(n);return e.hostname==="youtu.be"?u(e.pathname.slice(1)):e.pathname.startsWith("/embed/")||e.pathname.startsWith("/shorts/")?u(e.pathname.split("/")[2]):u(e.searchParams.get("v")||"")}catch{return u(n)}}function q(n){const e=n.items.flatMap(s=>{const t=S(s.youtubeUrl),o=w(s.start),a=w(s.end);return!t||o===null||a===null||a<=o?[]:[{...s,videoId:t,startSeconds:o,endSeconds:a}]});return{title:n.title.trim(),description:n.description.trim(),poster:n.poster.trim(),layout:n.layout==="side"?"side":"stacked",items:e}}function k(n){if(!n)return null;try{const e=JSON.parse(decodeURIComponent(n));return{title:e.title||"",description:e.description||"",poster:e.poster||"",layout:e.layout==="side"?"side":"stacked",items:e.items||[]}}catch{return null}}function u(n){return/^[a-zA-Z0-9_-]{11}$/.test(n)?n:null}function i(n,e={}){const s=document.createElement(n);return e.className&&(s.className=e.className),e.text!==void 0&&(s.textContent=e.text),Object.entries(e.attrs||{}).forEach(([t,o])=>{s.setAttribute(t,o)}),s}function C(n){for(;n.firstChild;)n.firstChild.remove()}let m=null;function E(n,e,s={}){const t=q(e);C(n),n.classList.add("sfi"),n.classList.toggle("sfi--side",t.layout==="side"),n.classList.toggle("sfi--stacked",t.layout!=="side");const o=i("h2",{className:"sfi__title",text:t.title||"Interview"}),a=i("p",{className:"sfi__description",text:t.description}),d=i("div",{className:"sfi__layout"}),p=i("div",{className:"sfi__media"}),g=i("div",{className:"sfi__player"}),b=i("div",{className:"sfi__questions-panel"}),_=i("ul",{className:"sfi__questions"});let l=null,h=null,y=null;if(t.poster){const r=i("img",{className:"sfi__poster",attrs:{src:t.poster,alt:""}});p.append(r)}p.append(g),!t.poster&&t.items[0]&&Y(t.items[0]),t.items.forEach(r=>{const f=i("li",{className:"sfi__question"}),c=i("button",{className:"sfi__question-button"});c.type="button",c.append(i("span",{className:"sfi__question-text",text:r.question||"Вопрос"})),r.source&&c.append(i("span",{className:"sfi__source",text:r.source})),c.addEventListener("click",async()=>{h=r,P(_,f);const L=await v();l?l.loadVideoById({videoId:r.videoId,startSeconds:r.startSeconds,endSeconds:r.endSeconds}):(l=x(L,g,r,()=>l,()=>h,()=>y,V=>{y=V}),l.loadVideoById({videoId:r.videoId,startSeconds:r.startSeconds,endSeconds:r.endSeconds}))}),f.append(c),_.append(f)}),t.items.length?b.append(i("p",{className:"sfi__help",text:"Кликните на вопрос, чтобы увидеть видеоответ."})):_.append(i("li",{className:"sfi__empty",text:"Нет валидных фрагментов для показа."})),b.append(_),d.append(p,b),n.append(o),t.description&&n.append(a),n.append(d,z());async function Y(r){const f=await v();l||(h=r,l=x(f,g,r,()=>l,()=>h,()=>y,c=>{y=c}))}}function P(n,e){n.querySelectorAll(".sfi__question").forEach(s=>{s.classList.toggle("sfi__question--active",s===e)})}function A(n,e,s,t){s!==null&&window.clearInterval(s);const o=window.setInterval(()=>{const a=n(),d=e();!a||!d||a.getCurrentTime()>=d.endSeconds&&(a.pauseVideo(),window.clearInterval(o),t(null))},200);t(o)}function x(n,e,s,t,o,a,d){return new n.Player(e,{width:"100%",height:"100%",videoId:s.videoId,playerVars:{autoplay:0,controls:1,rel:0,modestbranding:1,playsinline:1,start:s.startSeconds,end:s.endSeconds},events:{onReady:()=>{t()?.cueVideoById({videoId:s.videoId,startSeconds:s.startSeconds,endSeconds:s.endSeconds})},onStateChange:p=>{p.data===n.PlayerState.PLAYING&&A(t,o,a(),d)}}})}function v(){return window.YT?.Player?Promise.resolve(window.YT):m||(m=new Promise(n=>{const e=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{e?.(),n(window.YT)};const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api",document.head.append(s)}),m)}function z(){const n=i("p",{className:"sfi__branding"}),e=i("a",{text:"Silamedia Interactiview",attrs:{href:"https://sila.media",target:"_blank",rel:"noreferrer"}});return n.append(e),n}const T=".sila-fragment-interview[data-interview]",I="sila-fragment-interview-styles";if(!document.getElementById(I)){const n=document.createElement("style");n.id=I,n.textContent=N,document.head.append(n)}document.querySelectorAll(T).forEach(n=>{const e=k(n.dataset.interview||null);if(!e){n.textContent="Sila Fragment Interview: invalid data.";return}E(n,e)})})();
