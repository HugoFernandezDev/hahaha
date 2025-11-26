/* main.js - maneja: corazones, envelope open, carrusel, typewriter, music control, scroll progress, sorpresa */

(() => {
  // assets y nodos
  const ASSETS = window.__PAGE_ASSETS || {};
  const heartsRoot = document.getElementById('hearts-root');
  const envelope = document.getElementById('envelope');
  const envelopeWrap = document.getElementById('envelope-wrap');
  const btnMusic = document.getElementById('btn-music');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const musica = document.getElementById('musica');
  const envelopeFront = document.getElementById('envelope-front');
  const carta = document.getElementById('carta');
  const btnPrev = document.getElementById('prev');
  const btnNext = document.getElementById('next');
  const carouselImg = document.getElementById('carousel-img');
  const typeTarget = document.getElementById('type-target');
  const textoCompleto = ASSETS.texto || '';
  const modal = document.getElementById('modal');
  const btnCerrar = document.getElementById('btn-cerrar');
  const signature = document.getElementById('firma');
  const progressEl = document.getElementById('progress');

  // -----------------------
  // CORAZONES (background)
  // -----------------------
  function crearCorazonOnce() {
    const el = document.createElement('div');
    el.className = 'heart-fall';
    el.style.position = 'fixed';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.top = (-10 - Math.random() * 20) + 'vh';
    el.style.fontSize = (18 + Math.random() * 26) + 'px';
    el.style.zIndex = 10;
    el.style.animationDuration = (4 + Math.random() * 3) + 's';
    el.innerText = '❤️';
    heartsRoot.appendChild(el);
    setTimeout(() => { el.remove(); }, 9000);
  }

  // start hearts periodically but gentle
  setInterval(() => { if (Math.random() > 0.3) crearCorazonOnce(); }, 350);

  // -----------------------
  // MUSIC CONTROL BUTTON
  // -----------------------
  let playing = false;
  btnMusic.addEventListener('click', (e) => {
    e.preventDefault();
    if (!playing) {
      musica.play().catch(() => {});
      playing = true;
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
    } else {
      musica.pause();
      playing = false;
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
    }
  });

  // sync icons when music ends
  musica.addEventListener('ended', () => {
    playing = false;
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
  });

  // -----------------------
  // ENVELOPE OPEN -> show carta + play music + typewriter
  // -----------------------
  let opened = false;
  envelopeWrap.addEventListener('click', () => {
    if (opened) return;
    // micro animation
    envelope.classList.add('open');
    setTimeout(() => {
      envelope.classList.add('opacity-0');
    }, 180);
    setTimeout(() => {
      envelopeWrap.classList.add('scale-95');
      envelopeWrap.style.opacity = '0';
      // reveal carta
      carta.classList.remove('hidden');
      carta.classList.add('fade-in');
      // start music if not playing
      if (!playing) {
        musica.play().catch(() => {});
        playing = true;
        iconPlay.classList.add('hidden'); iconPause.classList.remove('hidden');
      }
      // start typewriter
      startTypewriter(textoCompleto, typeTarget, 18, () => {
        // show signature when finished
        signature.style.display = 'block';
      });

      opened = true;
    }, 260);
  });

  // -----------------------
  // CARRUSEL
  // -----------------------
  const images = ASSETS.images || [];
  let idx = 0;
  if (images.length && carouselImg) {
    carouselImg.src = images[0];
    btnPrev.addEventListener('click', () => {
      idx = (idx - 1 + images.length) % images.length;
      carouselImg.src = images[idx];
    });
    btnNext.addEventListener('click', () => {
      idx = (idx + 1) % images.length;
      carouselImg.src = images[idx];
    });
    // auto-rotate
    setInterval(() => {
      idx = (idx + 1) % images.length;
      carouselImg.src = images[idx];
    }, 4200);
  } else {
    // hide controls if no images
    if (btnPrev) btnPrev.style.display = 'none';
    if (btnNext) btnNext.style.display = 'none';
  }
  // -----------------------
  // SCROLL PROGRESS & SURPRISE
  // -----------------------
  carta.addEventListener('scroll', () => {
    const h = carta.scrollHeight - carta.clientHeight;
    const p = Math.min(1, (carta.scrollTop / (h || 1)));
    if (progressEl) progressEl.style.width = (p * 100) + '%';

    // when reaches bottom -> show modal surprise once
    if (p > 0.98) {
      // small delay then show modal
      setTimeout(() => {
        if (modal && modal.classList.contains('hidden')) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }
      }, 600);
    }
  });

  // close modal
  btnCerrar.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });

  // small accessibility: space/enter on envelope triggers same
  envelopeWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') envelopeWrap.click();
  });

  // -----------------------
  // small init: set aria / keyboard
  // -----------------------
  envelopeWrap.setAttribute('tabindex','0');
  envelopeWrap.style.outline = 'none';

  // DONE
})();
