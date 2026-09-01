(()=>{
let open=false,lastCard=null;
const enhance=()=>{
  const main=document.querySelector('main.shell');
  if(!main||!main.querySelector('.top .title')||main.querySelector('.top .title').textContent.trim()!=='Your progress')return;
  const candidates=[...main.querySelectorAll('.card')];
  const card=candidates.find(c=>c.textContent.includes('Bodyweight history'));
  if(!card||card===lastCard&&card.querySelector('.history-toggle'))return;
  lastCard=card;
  const title=[...card.querySelectorAll('h2,h3,.eyebrow,.title')].find(x=>x.textContent.trim()==='Bodyweight history');
  if(!title)return;
  const rows=[...card.children].filter(el=>el!==title.closest('.card-top')&&!el.classList.contains('history-controls')&&/\bkg\b/i.test(el.textContent));
  if(rows.length<=7)return;
  const wrap=document.createElement('div');wrap.className='history-list';
  rows.forEach(r=>{wrap.appendChild(r);});
  const items=[...wrap.children];
  const toggle=document.createElement('button');toggle.type='button';toggle.className='history-toggle text-link';toggle.textContent='Show full history';
  const apply=()=>{items.forEach((r,i)=>{r.style.display=open||i>=items.length-7?'':'none'});toggle.textContent=open?'Hide older entries':'Show full history';};
  toggle.onclick=()=>{open=!open;apply()};
  card.appendChild(wrap);card.appendChild(toggle);apply();
};
new MutationObserver(()=>enhance()).observe(document.body,{childList:true,subtree:true});
setTimeout(enhance,100);
})();
