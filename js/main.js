/**
 * LOPUO Studio — Main Scripts
 * 1. Global Navigation & Interactions (Resilient, mobile & touch enabled)
 * 2. L-to-R Travelling Wave Halftone World Map (Subtle, light, dynamic reveal)
 */

/* ============================================================
   SECTION 1: NAVIGATION & SLIDES (Standalone, resilient)
   ============================================================ */
(function () {
  'use strict';

  var TOTAL = 4;
  var DARK_SLIDES = [3];
  var BG_COLORS = [
    '#f8f8f6',  // 0: Hero (Studio Clean)
    '#faf1e6',  // 1: HoleSnap (Warm Amber Tint)
    '#eff7f2',  // 2: Zider (Forest Freshness)
    '#0f1a17'   // 3: Zirwork (Deep Tech Slate)
  ];
  var BG_NAMES = ['', 'HoleSnap', 'ZIDER', 'Zirwork'];

  var current = 0;
  var animating = false;
  var wheelAcc = 0;
  var touchStartY = 0;
  var touchStartX = 0;

  var body    = document.body;
  var slides  = document.querySelectorAll('.slide');
  var dots    = document.querySelectorAll('.dot');
  var bgName  = document.getElementById('bgName');
  var counter = document.getElementById('slideCounter');

  // Scroll to next slide or loop to top
  window.scrollNext = function () {
    if (current < TOTAL - 1) {
      window.goTo(current + 1);
    } else {
      window.goTo(0);
    }
  };

  // Navigation function exposed globally
  window.goTo = function (next) {
    if (animating || next === current || next < 0 || next >= TOTAL) return;
    animating = true;
    var prev = current;
    var dir = next > prev ? 'up' : 'down';
    current = next;

    // Background & Watermark Sync
    if (body) body.style.backgroundColor = BG_COLORS[current];
    if (bgName) bgName.textContent = BG_NAMES[current];

    // Dark Mode Sync
    var dark = DARK_SLIDES.indexOf(current) > -1;
    if (body) body.classList.toggle('dark-slide', dark);

    // Map Color Sync
    if (window.setGlobeSlide) window.setGlobeSlide(current);

    // Dots Sync
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });

    // Counter Display
    if (counter) {
      if (current === 0) {
        counter.textContent = '';
      } else {
        counter.textContent = current + ' / ' + (TOTAL - 1);
      }
    }

    // Bottom Scroll Button state
    var btnText = document.getElementById('scrollBtnText');
    var btnArrow = document.getElementById('scrollBadgeArrow');
    if (btnText) {
      btnText.textContent = (current === TOTAL - 1) ? 'BACK TO TOP' : 'SCROLL TO CONTINUE';
    }
    if (btnArrow) {
      btnArrow.style.transform = (current === TOTAL - 1) ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // Slide Animations
    if (slides[prev]) {
      slides[prev].classList.add(dir === 'up' ? 'leave-up' : 'leave-down');
      slides[prev].classList.remove('is-active');
    }

    if (slides[current]) {
      slides[current].style.opacity = '1';
      slides[current].classList.add(dir === 'up' ? 'enter-up' : 'enter-down');
      slides[current].classList.add('is-active');
    }

    setTimeout(function () {
      if (slides[prev]) {
        slides[prev].classList.remove('leave-up', 'leave-down');
        slides[prev].style.opacity = '';
      }
      if (slides[current]) {
        slides[current].classList.remove('enter-up', 'enter-down');
      }
      animating = false;
    }, 700);
  };

  // Wheel listener
  var wheelTimer = null;
  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (animating) return;

    wheelAcc += e.deltaY;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { wheelAcc = 0; }, 200);

    if (Math.abs(wheelAcc) >= 35) {
      if (wheelAcc > 0 && current < TOTAL - 1) {
        window.goTo(current + 1);
        wheelAcc = 0;
      } else if (wheelAcc < 0 && current > 0) {
        window.goTo(current - 1);
        wheelAcc = 0;
      }
    }
  }, { passive: false });

  // Keyboard navigation
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      window.goTo(current + 1);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      window.goTo(current - 1);
    }
  });

  // Touch navigation (optimized for mobile swipes)
  window.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  window.addEventListener('touchend', function (e) {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    var dy = touchStartY - e.changedTouches[0].clientY;
    var dx = touchStartX - e.changedTouches[0].clientX;

    // Primarily vertical swipe
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
      if (dy > 0 && current < TOTAL - 1) window.goTo(current + 1);
      else if (dy < 0 && current > 0) window.goTo(current - 1);
    }
  }, { passive: true });

  // Mouse Parallax on 3D cards
  var tx = 0, ty = 0, pcx = 0, pcy = 0;
  document.addEventListener('mousemove', function (e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 28;
    ty = (e.clientY / window.innerHeight - 0.5) * 20;
  });

  function parallaxLoop() {
    pcx += (tx - pcx) * 0.055;
    pcy += (ty - pcy) * 0.055;

    if (current > 0) {
      var card = document.getElementById('card' + current);
      if (card) {
        card.style.transform = 'perspective(1000px) rotateY(' + (pcx * 0.4) + 'deg) rotateX(' + (-pcy * 0.3) + 'deg) translateZ(14px)';
      }
      var logo = document.getElementById('logo' + current);
      if (logo) {
        logo.style.transform = 'translateX(' + (pcx * 0.1) + 'px) translateY(' + (pcy * 0.07) + 'px)';
      }
    }
    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  // HoleSnap dot pulse animation
  var holeDots = document.querySelectorAll('#holeGrid .hole-dot');
  function pulseDot() {
    if (current !== 1) {
      setTimeout(pulseDot, 600);
      return;
    }
    var on = [];
    holeDots.forEach(function (d, i) {
      if (d.classList.contains('is-on')) on.push(i);
    });
    if (on.length) {
      var d = holeDots[on[Math.floor(Math.random() * on.length)]];
      d.classList.add('pulse');
      setTimeout(function () { d.classList.remove('pulse'); }, 600);
    }
    setTimeout(pulseDot, 280 + Math.random() * 650);
  }
  setTimeout(pulseDot, 1200);

  if (holeDots.length) {
    holeDots.forEach(function (dot) {
      dot.addEventListener('mouseenter', function () {
        this.classList.toggle('is-on');
      });
    });
  }

  // Reset parallax target on slide change
  var _goTo = window.goTo;
  window.goTo = function (n) {
    tx = 0;
    ty = 0;
    _goTo(n);
  };
})();


/* ============================================================
   SECTION 2: LIGHTWEIGHT L-TO-R FLOWING MAP CANVAS
   - Soft, delicate opacity (never heavy/black)
   - Left-to-Right travelling wave sweep (dynamic partial reveal)
   - Antarctica bottom-bar removed for natural continental shape
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('globe');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var W, H, dpr;
  var time = 0;

  var MAP_COLS = 110;
  var MAP_ROWS = 56;
  var mapWeights = new Float32Array(MAP_COLS * MAP_ROWS);

  // Run-length encoded geographic land data
  var RLE_DATA = "28,8,1,1,2,8,87,26,7,5,6,2,12,3,42,14,1,16,9,5,10,3,7,7,7,1,29,6,1,7,6,12,22,4,5,14,3,4,9,1,4,7,2,21,3,11,10,15,1,95,1,3,2,8,1,4,15,4,1,4,7,110,4,23,2,6,4,4,13,54,4,23,4,5,5,1,11,1,2,5,1,45,8,3,6,16,1,6,15,3,2,3,1,37,4,3,19,24,14,47,3,2,22,23,14,46,28,19,1,2,15,45,28,19,16,12,1,32,1,2,27,17,18,4,1,38,2,2,28,15,20,3,1,4,1,34,1,3,29,14,20,7,3,1,2,27,1,5,31,12,21,41,1,2,33,9,1,2,20,42,37,6,4,1,19,42,40,4,2,4,17,24,3,17,24,1,14,7,2,3,16,23,4,5,1,6,45,6,3,1,16,22,5,4,2,5,3,2,44,3,19,22,6,3,5,4,2,2,45,9,13,21,7,2,5,4,3,2,45,9,13,20,8,1,5,1,4,1,1,2,47,9,12,3,1,14,14,3,2,3,48,10,17,12,16,2,1,7,45,12,15,11,17,2,1,5,1,4,42,14,14,9,19,2,1,1,1,2,2,7,38,15,13,9,20,3,1,1,1,1,3,4,2,1,37,13,15,9,23,2,2,1,2,1,1,1,3,1,36,13,14,10,1,2,22,4,1,2,42,12,14,13,21,8,5,2,2,1,33,10,15,8,2,2,20,11,42,10,16,7,2,2,19,13,3,1,37,8,18,7,2,2,19,13,41,7,20,5,25,12,41,7,20,4,26,12,40,7,21,3,27,3,3,6,6,1,33,6,59,4,7,2,32,4,63,2,6,3,32,4,63,2,5,2,34,3,71,1,34,4,41,1,65,3,108,2,330,2,34,2,13,1,2,1,2,1,2,2,46,3,29,11,2,26,30,1,7,5,14,56,13,27,12,58,8,29,6,2,2,62,9,1,1,30,1,67,7,2,4,100,2";

  function decodeRLE() {
    var runs = RLE_DATA.split(',');
    var ptr = 0;
    var isLand = 0;
    for (var i = 0; i < runs.length; i++) {
      var count = parseInt(runs[i], 10);
      for (var k = 0; k < count; k++) {
        if (ptr < mapWeights.length) {
          // Exclude bottom rows (flat Antarctica bar) for organic open look
          var row = Math.floor(ptr / MAP_COLS);
          mapWeights[ptr++] = (isLand && row < MAP_ROWS - 6) ? 1.0 : 0.0;
        }
      }
      isLand = 1 - isLand;
    }
  }

  decodeRLE();

  // Slide-synced delicate theme colors (soft, airy, refined)
  var SLIDE_COLORS = [
    { r: 40,  g: 48,  b: 62  },  // 0: Hero (Subtle Studio Slate)
    { r: 234, g: 122, b: 24  },  // 1: HoleSnap (Warm Amber Orange)
    { r: 8,   g: 122, b: 70  },  // 2: Zider (Forest Emerald)
    { r: 137, g: 201, b: 65  }   // 3: Zirwork (Tech Lime)
  ];

  var colorCurrent = { r: 40, g: 48, b: 62 };
  var colorTarget  = { r: 40, g: 48, b: 62 };

  // Mouse interaction
  var mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, radius: 130 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function lerp(a, b, t) {
    return {
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t
    };
  }

  document.addEventListener('mousemove', function (e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  document.addEventListener('mouseleave', function () {
    mouse.targetX = -9999;
    mouse.targetY = -9999;
  });

  function render() {
    ctx.clearRect(0, 0, W, H);

    // Color transition
    colorCurrent = lerp(colorCurrent, colorTarget, 0.05);
    var cr = colorCurrent.r | 0, cg = colorCurrent.g | 0, cb = colorCurrent.b | 0;

    // Mouse spring
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    time += 0.014;

    // Responsive scaling
    var isMobile = W < 768;
    var mapWidth = isMobile ? W * 1.05 : Math.max(W * 0.94, 1020);
    var mapHeight = mapWidth * 0.46;

    var startX = (W - mapWidth) * 0.5;
    var startY = (H - mapHeight) * 0.5;

    var stepX = mapWidth / (MAP_COLS - 1);
    var stepY = mapHeight / (MAP_ROWS - 1);

    // Left-to-Right Travelling Light Wave (Cycles smoothly every ~7 seconds)
    // sweepPos moves from -0.3 to 1.3 across the width of the screen
    var sweepCycle = 7.0;
    var sweepProgress = (time / sweepCycle) % 1.0; // 0 to 1
    var sweepX = -0.35 + sweepProgress * 1.7; // Normalized position -0.35 to 1.35

    for (var r = 0; r < MAP_ROWS; r++) {
      for (var c = 0; c < MAP_COLS; c++) {
        var intensity = mapWeights[r * MAP_COLS + c]; // 0.0 (ocean) or 1.0 (land)

        var bx = startX + c * stepX;
        var by = startY + r * stepY;

        // Normalized X coordinate of dot across screen (0 to 1)
        var normX = c / (MAP_COLS - 1);

        // Distance from the travelling wave peak
        var distFromWave = normX - sweepX;
        // Wave reveal intensity: Gaussian envelope around the travelling peak
        var waveIntensity = Math.exp(-(distFromWave * distFromWave) * 12.0);

        // Secondary flowing undulation
        var undulation = Math.sin(normX * 4.5 - time * 1.5) * 0.5 + 0.5;

        // Dynamic reveal multiplier: only parts of the map are highlighted at any moment!
        // Base ambient visibility (0.12) + Travelling wave focus (up to 0.88)
        var revealFactor = 0.12 + waveIntensity * 0.78 + undulation * 0.10;

        // Subtle height ripple
        var waveElevation = Math.sin(c * 0.08 - time * 1.4) * Math.cos(r * 0.12 + time * 1.1) * (1.5 + intensity * 4);

        var sx = bx;
        var sy = by + waveElevation;

        // Interactive mouse repulsion
        var dx = sx - mouse.x;
        var dy = sy - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var hoverFactor = 0;

        if (dist < mouse.radius) {
          var force = Math.pow(1 - dist / mouse.radius, 1.8);
          var angle = Math.atan2(dy, dx);
          sx += Math.cos(angle) * force * 20;
          sy += Math.sin(angle) * force * 20;
          hoverFactor = force;
        }

        // Refined, subtle dot radius & alpha (Never heavy or dark!)
        var dotRadius, dotAlpha;

        if (intensity < 0.5) {
          // Ocean: ultra-fine delicate lattice
          dotRadius = (isMobile ? 0.45 : 0.55) + hoverFactor * 0.5;
          dotAlpha = (0.025 + waveIntensity * 0.04 + hoverFactor * 0.15);
        } else {
          // Land: elegant halftone particles with dynamic L-to-R reveal
          var baseRadius = isMobile ? 0.75 : 0.9;
          dotRadius = baseRadius + (revealFactor * 1.3) + hoverFactor * 0.8;

          // Maximum alpha is soft and gentle: 0.08 ~ 0.32 (never overpowers text)
          dotAlpha = (0.05 + revealFactor * 0.28 + hoverFactor * 0.2);
        }

        if (dotAlpha <= 0.015) continue;

        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.35, dotRadius), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + Math.min(0.5, dotAlpha).toFixed(3) + ')';
        ctx.fill();
      }
    }

    requestAnimationFrame(render);
  }

  window.setGlobeSlide = function (slideIndex) {
    var c = SLIDE_COLORS[slideIndex] || SLIDE_COLORS[0];
    colorTarget = c;
  };

  window.addEventListener('resize', resize);
  resize();
  render();

})();
