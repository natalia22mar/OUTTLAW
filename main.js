/* OUTTLAW NUEVA · drop SETT 001 (v2). Sin dependencias. */
(function(){
  var d=document, w=window, reduce=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header=d.getElementById('DnHeader'), pill=d.getElementById('DnPill'), hero=d.getElementById('dn-portada'), cierre=d.getElementById('dn-cierre');

  // Todos los COMPRAR (incluido el del header) usan el destino de la sección. TODO apertura: puerta VIP.
  var first=d.querySelector('.dn [data-dn-buy]');
  if(first){ d.querySelectorAll('[data-dn-buy]').forEach(function(a){ a.setAttribute('href', first.getAttribute('href')); }); }

  // Frase (v2): se enciende POR PALABRAS con un destello frío tipo diamante (clase is-lit)
  var rev=[].slice.call(d.querySelectorAll('[data-dn-reveal]')).map(function(el){
    var words=el.textContent.trim().split(/\s+/); el.textContent=''; el.setAttribute('aria-label', words.join(' '));
    var ws=words.map(function(wd,i){
      var sp=d.createElement('span'); sp.className='dn-w'; sp.setAttribute('aria-hidden','true'); sp.textContent=wd;
      el.appendChild(sp); if(i<words.length-1) el.appendChild(d.createTextNode(' ')); return sp;
    });
    return {el:el, words:ws};
  });

  function frame(){
    var y=w.scrollY||w.pageYOffset, vh=w.innerHeight;
    if(header) header.classList.toggle('is-solid', y>24);
    if(pill && hero){
      var on = y > hero.offsetHeight*0.85;
      if(cierre){ var r=cierre.getBoundingClientRect(); if(r.top < vh*0.95) on=false; }
      pill.classList.toggle('is-on', on); pill.setAttribute('aria-hidden', on?'false':'true'); pill.tabIndex = on?0:-1;
    }
    rev.forEach(function(o){
      var r=o.el.getBoundingClientRect();
      // 0 cuando el bloque entra por el 85% de la pantalla, 1 cuando su base llega al 45%
      var p = reduce ? 1 : (vh*0.85 - r.top) / (vh*0.85 - vh*0.45 + r.height*0.6);
      p=Math.max(0,Math.min(1,p)); var lit=Math.round(p*o.words.length);
      o.words.forEach(function(w,i){ w.classList.toggle('is-lit', i<lit); });
    });
  }
  var ticking=false;
  function onScroll(){ if(!ticking){ ticking=true; w.requestAnimationFrame(function(){ ticking=false; frame(); }); } }
  w.addEventListener('scroll', onScroll, {passive:true}); w.addEventListener('resize', onScroll); frame();

  // Entradas suaves
  var ins=d.querySelectorAll('[data-dn-in],[data-dn-curtain]');
  if(!('IntersectionObserver' in w) || reduce){ ins.forEach(function(e){ e.classList.add('is-in'); }); }
  else {
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -12% 0px', threshold:0.05});
    ins.forEach(function(e){ io.observe(e); });
  }
})();
