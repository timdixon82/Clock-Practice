'use strict';

import {
  randomTime,
  handAngles,
  formatTime,
  isCorrectAnswer,
  getHint,
  wrapHour,
  wrapMinute,
} from './clock-logic.js';

let currentHour = 3;
let currentMinute = 0;
let userHour = 12;
let userMinute = 0;
let attempts = 0;
let correctCount = 0;
let solved = false;

function attachKeyboardSupport() {
  const hourEl = document.getElementById('hour-display');
  const minEl  = document.getElementById('minute-display');

  hourEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { changeHour(1); e.preventDefault(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { changeHour(-1); e.preventDefault(); }
  });

  minEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { changeMinute(5); e.preventDefault(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { changeMinute(-5); e.preventDefault(); }
  });
}

function init() {
  const markers = document.getElementById('minute-markers');
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 - 90) * Math.PI / 180;
    const isHour = i % 5 === 0;
    const r1 = isHour ? 80 : 86;
    const r2 = 92;
    const x1 = 100 + r1 * Math.cos(angle);
    const y1 = 100 + r1 * Math.sin(angle);
    const x2 = 100 + r2 * Math.cos(angle);
    const y2 = 100 + r2 * Math.sin(angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', isHour ? '#0A2342' : '#555555');
    line.setAttribute('stroke-width', isHour ? 2.5 : 1);
    markers.appendChild(line);
  }

  const numbers = document.getElementById('hour-numbers');
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const x = 100 + 70 * Math.cos(angle);
    const y = 100 + 70 * Math.sin(angle) + 6;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x); text.setAttribute('y', y);
    text.textContent = i;
    numbers.appendChild(text);
  }

  attachKeyboardSupport();

  // Wire buttons with addEventListener, replacing the seven inline onclick attributes
  // that were removed from index.html as part of the Jed code-review fix (Finding 2).
  document.querySelector('.number-btn[aria-label="Decrease hour"]')
    .addEventListener('click', () => changeHour(-1));
  document.querySelector('.number-btn[aria-label="Increase hour"]')
    .addEventListener('click', () => changeHour(1));
  document.querySelector('.number-btn[aria-label="Decrease minutes by five"]')
    .addEventListener('click', () => changeMinute(-5));
  document.querySelector('.number-btn[aria-label="Increase minutes by five"]')
    .addEventListener('click', () => changeMinute(5));
  document.getElementById('check-btn').addEventListener('click', checkAnswer);
  document.getElementById('new-clock-btn').addEventListener('click', newClock);
  document.getElementById('share-btn').addEventListener('click', share);

  newClock();
}

function newClock() {
  ({ hour: currentHour, minute: currentMinute } = randomTime());

  const { hourAngle, minuteAngle } = handAngles(currentHour, currentMinute);

  document.getElementById('hour-hand').setAttribute('transform', `rotate(${hourAngle} 100 100)`);
  document.getElementById('minute-hand').setAttribute('transform', `rotate(${minuteAngle} 100 100)`);

  attempts = 0;
  solved = false;
  document.getElementById('attempts').textContent = '0';

  userHour = 12;
  userMinute = 0;
  updateDisplay();

  const feedback = document.getElementById('feedback');
  feedback.className = 'feedback empty';
  feedback.textContent = '';

  document.getElementById('share-btn').disabled = true;
  document.getElementById('check-btn').disabled = false;
}

function changeHour(delta) {
  if (solved) return;
  userHour = wrapHour(userHour, delta);
  updateDisplay();
}

function changeMinute(delta) {
  if (solved) return;
  userMinute = wrapMinute(userMinute, delta);
  updateDisplay();
}

function updateDisplay() {
  const hEl = document.getElementById('hour-display');
  const mEl = document.getElementById('minute-display');
  hEl.textContent = userHour;
  hEl.setAttribute('aria-valuenow', userHour);
  mEl.textContent = userMinute.toString().padStart(2, '0');
  mEl.setAttribute('aria-valuenow', userMinute);
}

function checkAnswer() {
  if (solved) return;
  attempts++;
  document.getElementById('attempts').textContent = attempts;

  const feedback = document.getElementById('feedback');

  if (isCorrectAnswer(userHour, userMinute, currentHour, currentMinute)) {
    solved = true;
    correctCount++;
    document.getElementById('correct-count').textContent = correctCount;
    feedback.className = 'feedback correct';

    // Build the correct-answer feedback using DOM construction rather than
    // innerHTML, removing the sink entirely (Jed code-review Finding 3).
    feedback.textContent = '';

    const wrapper = document.createElement('div');

    const celebration = document.createElement('span');
    celebration.className = 'celebration';
    celebration.setAttribute('aria-hidden', 'true');
    celebration.textContent = '✅'; // checkmark emoji

    const headline = document.createElement('div');
    headline.textContent = 'Brilliant! You got it right!';

    const detail = document.createElement('div');
    detail.style.fontSize = '1rem';
    detail.style.marginTop = '6px';
    detail.style.fontWeight = 'normal';
    detail.textContent = `It was ${formatTime(currentHour, currentMinute)} — solved in ${attempts} ${attempts === 1 ? 'try' : 'tries'}!`;

    wrapper.appendChild(celebration);
    wrapper.appendChild(headline);
    wrapper.appendChild(detail);
    feedback.appendChild(wrapper);

    document.getElementById('share-btn').disabled = false;
    document.getElementById('check-btn').disabled = true;
    launchConfetti();
  } else {
    feedback.className = 'feedback wrong';
    const hint = getHint(userHour, userMinute, currentHour, currentMinute);
    feedback.textContent = `Not quite! ${hint} Try again`;
  }
}

function launchConfetti() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#FF6F00', '#0A2342', '#15803D', '#6B21A8', '#FFD700', '#C2410C', '#1D4ED8'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.setAttribute('aria-hidden', 'true');
    c.style.left = Math.random() * 100 + '%';
    c.style.top = '-15px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = (Math.random() * 0.6) + 's';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

// ---------- Share-image generation ----------

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function generateShareImage() {
  const svgEl = document.querySelector('svg.clock');
  const clone = svgEl.cloneNode(true);
  clone.setAttribute('width', '400');
  clone.setAttribute('height', '400');
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const W = 600, H = 800;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // Background gradient (matches the app)
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#87CEEB');
        grad.addColorStop(1, '#FFB6C1');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Title — dark navy on light gradient (>9:1 contrast)
        ctx.fillStyle = '#0A2342';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.font = 'bold 44px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillText('I read the clock!', W / 2, 75);

        // White card with shadow
        const cardX = 80, cardY = 110, cardW = 440, cardH = 440, cardR = 28;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.22)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = 'white';
        roundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
        ctx.fill();
        ctx.restore();

        // Clock inside card
        ctx.drawImage(img, cardX + 20, cardY + 20, cardW - 40, cardH - 40);

        // Time
        ctx.fillStyle = '#0A2342';
        ctx.font = 'bold 64px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(formatTime(currentHour, currentMinute), W / 2, 625);

        // Subtitle
        ctx.font = '28px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(
          `Solved in ${attempts} ${attempts === 1 ? 'try' : 'tries'}`,
          W / 2,
          670
        );

        // Tick badge — dark green circle, white tick (5:1+ contrast)
        const cx = W / 2, cy = 740, r = 32;
        ctx.fillStyle = '#15803D';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy + 1);
        ctx.lineTo(cx - 4, cy + 12);
        ctx.lineTo(cx + 16, cy - 10);
        ctx.stroke();

        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], 'clock-practice.png', { type: 'image/png' }));
          } else {
            reject(new Error('toBlob returned null'));
          }
        }, 'image/png', 0.95);
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('SVG image failed to load'));
    };
    img.src = url;
  });
}

// ---------- Sharing ----------

async function share() {
  const time = formatTime(currentHour, currentMinute);
  const text = `I read the clock! It said ${time} and I got it right in ${attempts} ${attempts === 1 ? 'try' : 'tries'}!`;
  const title = 'Clock Practice - Got it right!';

  let file = null;
  try {
    file = await generateShareImage();
  } catch (e) {
    console.warn('Could not generate share image:', e);
  }

  // Best path: native share with image attached
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ title, text, files: [file] });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return; // user cancelled
      // otherwise fall through to next option
    }
  }

  // Fallback 1: native share, text only (also save the image so it is not lost)
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      if (file) downloadFile(file);
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  // Fallback 2: download image + copy text to clipboard
  fallbackShare(text, file);
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function fallbackShare(text, file) {
  if (file) downloadFile(file);

  const feedback = document.getElementById('feedback');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => {
        // Replace alert() with a live region announcement (Jed code-review Finding 5).
        feedback.className = 'feedback correct';
        feedback.textContent = 'Image saved to your downloads. The message has been copied. Paste it into a message to Mum and Dad along with the picture!';
      },
      () => {
        feedback.className = 'feedback correct';
        feedback.textContent = text;
      }
    );
  } else {
    // Replace alert() with a live region announcement (Jed code-review Finding 5).
    feedback.className = 'feedback correct';
    feedback.textContent = text;
  }
}

document.addEventListener('DOMContentLoaded', init);
