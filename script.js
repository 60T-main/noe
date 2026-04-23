/* ─────────────────────────────────────────────
   NOE BAPTISM — script.js
───────────────────────────────────────────── */

/* ── SCROLL TO TOP ON EVERY LOAD ── */
window.scrollTo(0, 0);
history.scrollRestoration = 'manual';

/* ── INTRO SEQUENCE ── */
const bear    = document.getElementById('intro-bear');
const overlay = document.getElementById('intro-overlay');

// Bear flies in from left → center (0ms)
window.addEventListener('load', () => {
  window.scrollTo(0, 0);

  // Slight delay so CSS transition is active
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bear.classList.add('center');
    });
  });

  // After fly-in + 1s pause → start revealing elements staggered
  setTimeout(() => {
    const revealEls = document.querySelectorAll('[data-reveal]');
    revealEls.forEach(el => {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('revealed'), delay);
    });
  }, 1800); // ~0.9s fly-in + 1s pause

  // Bear flies out to the right
  setTimeout(() => {
    bear.classList.remove('center');
    bear.classList.add('exit');
  }, 2000);

  // Remove overlay + unlock scroll after bear is gone
  setTimeout(() => {
    overlay.style.display = 'none';
    document.body.classList.remove('intro-locked');
  }, 2900); // 2000 + 0.85s exit transition
});

/* ── TIMELINE DATA ── */
const timelineData = {
  church: {
    img:   'dove.png',
    title: 'მეფისქალაქის ტაძარი',
    body:  '13:00 — ნათლობის ცერემონია'
  },
  reception: {
    img:   'horse.png',
    title: 'დარბაზი სალხინაშვილების',
    body:  'სადღეგრძელო სუფრა და სიხარული'
  }
};

/* ── BALLOON FOLLOW (click only) ── */
const tlItems   = document.querySelectorAll('.tl-item');
const tlBalloon = document.getElementById('tlBalloon');

let balloonBaseTop = -180;

function moveBalloonTo(item) {
  if (!tlBalloon) return;
  const dotCenterY = item.offsetTop + item.offsetHeight / 2;
  balloonBaseTop = dotCenterY - tlBalloon.offsetHeight + 30;
  tlBalloon.style.top = balloonBaseTop + 'px';
  tlBalloon.classList.add('visible');
}

/* ── MODAL ── */
const modalOverlay = document.getElementById('modalOverlay');
const modalImg     = document.getElementById('modalImg');
const modalTitle   = document.getElementById('modalTitle');
const modalBody    = document.getElementById('modalBody');
const modalClose   = document.getElementById('modalClose');

function openModal(id) {
  const data = timelineData[id];
  if (!data) return;
  modalImg.src           = data.img;
  modalImg.alt           = data.title;
  modalTitle.textContent = data.title;
  modalBody.textContent  = data.body;
  modalOverlay.classList.add('active');
  modalOverlay.removeAttribute('aria-hidden');
}

function closeModal() {
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
}

/* Hover dip on timeline items */
tlItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    if (!tlBalloon) return;
    tlBalloon.style.transition = 'top 0.4s ease, opacity 0.4s ease';
    tlBalloon.style.top = (balloonBaseTop + 20) + 'px';
  });
  item.addEventListener('mouseleave', () => {
    if (!tlBalloon) return;
    tlBalloon.style.transition = 'top 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease';
    tlBalloon.style.top = balloonBaseTop + 'px';
  });
});

document.querySelectorAll('.tl-card').forEach(card => {
  card.addEventListener('click', () => {
    const item = card.closest('.tl-item');
    tlItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    moveBalloonTo(item);
    openModal(item.dataset.id);
  });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
