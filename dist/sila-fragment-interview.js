(function(){"use strict";const I=`.sfi {
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
`;crypto.randomUUID();function b(n){const t=n.trim();if(!t)return null;if(/^\d+$/.test(t))return Number(t);if(t.match(/^(\d{1,2}:)?\d{1,2}:\d{2}$/))return t.split(":").map(Number).reduce((s,r)=>s*60+r,0);const e=t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);if(e&&e[0]){const s=Number(e[1]||0),r=Number(e[2]||0),d=Number(e[3]||0);return s*3600+r*60+d}return null}function S(n){try{const t=new URL(n);return t.hostname==="youtu.be"?u(t.pathname.slice(1)):t.pathname.startsWith("/embed/")||t.pathname.startsWith("/shorts/")?u(t.pathname.split("/")[2]):u(t.searchParams.get("v")||"")}catch{return u(n)}}function N(n){const t=n.items.flatMap(i=>{const e=S(i.youtubeUrl),s=b(i.start),r=b(i.end);return!e||s===null||r===null||r<=s?[]:[{...i,videoId:e,startSeconds:s,endSeconds:r}]});return{title:n.title.trim(),description:n.description.trim(),poster:n.poster.trim(),layout:n.layout==="side"?"side":"stacked",items:t}}function q(n){if(!n)return null;try{const t=JSON.parse(decodeURIComponent(n));return{title:t.title||"",description:t.description||"",poster:t.poster||"",layout:t.layout==="side"?"side":"stacked",items:t.items||[]}}catch{return null}}function u(n){return/^[a-zA-Z0-9_-]{11}$/.test(n)?n:null}function a(n,t={}){const i=document.createElement(n);return t.className&&(i.className=t.className),t.text!==void 0&&(i.textContent=t.text),Object.entries(t.attrs||{}).forEach(([e,s])=>{i.setAttribute(e,s)}),i}function k(n){for(;n.firstChild;)n.firstChild.remove()}let m=null;function C(n,t,i={}){const e=N(t);k(n),n.classList.add("sfi"),n.classList.toggle("sfi--side",e.layout==="side"),n.classList.toggle("sfi--stacked",e.layout!=="side");const s=a("h2",{className:"sfi__title",text:e.title||"Interview"}),r=a("p",{className:"sfi__description",text:e.description}),d=a("div",{className:"sfi__layout"}),p=a("div",{className:"sfi__media"}),g=a("div",{className:"sfi__player"}),_=a("ul",{className:"sfi__questions"});let l=null,h=null,y=null;if(e.poster){const o=a("img",{className:"sfi__poster",attrs:{src:e.poster,alt:""}});p.append(o)}p.append(g),!e.poster&&e.items[0]&&Y(e.items[0]),e.items.forEach(o=>{const f=a("li",{className:"sfi__question"}),c=a("button",{className:"sfi__question-button"});c.type="button",c.append(a("span",{className:"sfi__question-text",text:o.question||"Вопрос"})),o.source&&c.append(a("span",{className:"sfi__source",text:o.source})),c.addEventListener("click",async()=>{h=o,E(_,f);const z=await x();l?l.loadVideoById({videoId:o.videoId,startSeconds:o.startSeconds,endSeconds:o.endSeconds}):(l=w(z,g,o,()=>l,()=>h,()=>y,L=>{y=L}),l.loadVideoById({videoId:o.videoId,startSeconds:o.startSeconds,endSeconds:o.endSeconds}))}),f.append(c),_.append(f)}),e.items.length||_.append(a("li",{className:"sfi__empty",text:"Нет валидных фрагментов для показа."})),d.append(p,_),n.append(s),e.description&&n.append(r),n.append(d,A());async function Y(o){const f=await x();l||(h=o,l=w(f,g,o,()=>l,()=>h,()=>y,c=>{y=c}))}}function E(n,t){n.querySelectorAll(".sfi__question").forEach(i=>{i.classList.toggle("sfi__question--active",i===t)})}function P(n,t,i,e){i!==null&&window.clearInterval(i);const s=window.setInterval(()=>{const r=n(),d=t();!r||!d||r.getCurrentTime()>=d.endSeconds&&(r.pauseVideo(),window.clearInterval(s),e(null))},200);e(s)}function w(n,t,i,e,s,r,d){return new n.Player(t,{width:"100%",height:"100%",videoId:i.videoId,playerVars:{autoplay:0,controls:1,rel:0,modestbranding:1,playsinline:1,start:i.startSeconds,end:i.endSeconds},events:{onReady:()=>{e()?.cueVideoById({videoId:i.videoId,startSeconds:i.startSeconds,endSeconds:i.endSeconds})},onStateChange:p=>{p.data===n.PlayerState.PLAYING&&P(e,s,r(),d)}}})}function x(){return window.YT?.Player?Promise.resolve(window.YT):m||(m=new Promise(n=>{const t=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{t?.(),n(window.YT)};const i=document.createElement("script");i.src="https://www.youtube.com/iframe_api",document.head.append(i)}),m)}function A(){const n=a("p",{className:"sfi__branding"}),t=a("a",{text:"Silamedia Interactiview",attrs:{href:"https://sila.media",target:"_blank",rel:"noreferrer"}});return n.append(t),n}const T=".sila-fragment-interview[data-interview]",v="sila-fragment-interview-styles";if(!document.getElementById(v)){const n=document.createElement("style");n.id=v,n.textContent=I,document.head.append(n)}document.querySelectorAll(T).forEach(n=>{const t=q(n.dataset.interview||null);if(!t){n.textContent="Sila Fragment Interview: invalid data.";return}C(n,t)})})();
