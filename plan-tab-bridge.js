(()=>{
const goPlan=()=>{location.href='plan.html'};
document.addEventListener('click',e=>{const el=e.target.closest('[onclick*="go(\'plan\')"],[onclick*="go(\"plan\")"]');if(el){e.preventDefault();e.stopImmediatePropagation();goPlan()}},true);
})();
