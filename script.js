// small helpers
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

// set year
$('#year').textContent = new Date().getFullYear();

// intersection reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('show');
  });
},{threshold: 0.14});
$$('.content-section').forEach(s => observer.observe(s));

// contact form (mailto fallback)
const form = $('#contact-form');
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if (!name || !email || !message) {
    alert('Please fill all fields.');
    return;
  }
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
  // Replace the email address below with your real email
  window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
  form.reset();
});

// PROJECT MODAL logic (no code links — only live demos)
const cards = $$('.project-card');
const modal = $('#modal');
const modalPanel = modal.querySelector('.modal-panel');
const modalImg = $('#modalImg');
const modalTitle = $('#modalTitle');
const modalDesc = $('#modalDesc');
const modalTools = $('#modalTools');
const modalLive = $('#modalLive');
const modalClose = $('#modalClose');
const modalCloseSecondary = $('#modalCloseSecondary');

let currentIndex = 0;

function openModal(i){
  const card = cards[i];
  const img = card.querySelector('img');
  const title = card.dataset.title || '';
  const desc = card.dataset.desc || '';
  const tools = card.dataset.tools || '';
  const live = card.dataset.live || '#';

  modalImg.src = img.src;
  modalImg.alt = img.alt || title;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalTools.textContent = `Tools: ${tools}`;
  modalLive.href = live;

  currentIndex = i;
  modal.setAttribute('aria-hidden','false');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // focus trap: give panel focus for keyboard users
  modalPanel.focus();
}

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// open on click or Enter key
cards.forEach((c, i) => {
  c.addEventListener('click', () => openModal(i));
  c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(i);
    }
  });
});

// close handlers
modalClose.addEventListener('click', closeModal);
modalCloseSecondary.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// Hero canvas (subtle particles)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resizeCanvas();
addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

let particles = [];
class Particle {
  constructor(){
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.r = Math.random()*1.6 + 0.6;
    this.vx = (Math.random()-0.5) * 0.35;
    this.vy = (Math.random()-0.5) * 0.35;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -10 || this.x > canvas.width+10 || this.y < -10 || this.y > canvas.height+10) {
      this.x = Math.random()*canvas.width;
      this.y = Math.random()*canvas.height;
    }
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle = 'rgba(0,191,166,0.42)';
    ctx.fill();
  }
}

function initParticles(){
  particles = [];
  const count = Math.min(140, Math.floor(canvas.width * canvas.height / 90000));
  for (let i=0;i<count;i++) particles.push(new Particle());
}
initParticles();

function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let p of particles){ p.update(); p.draw(); }
  requestAnimationFrame(loop);
}
loop();
