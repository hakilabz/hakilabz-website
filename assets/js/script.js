/**
 * HAKILABZ — Premium Script
 * Canvas particles • 3D tilt • Logo filter swap • Scroll reveal
 */

/* ─── Theme (default = light) ────────────────────────────────── */
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

const LOGO_LIGHT = '/assets/images/hakilabz-logo.png';
const LOGO_DARK = '/assets/images/hakilabz-logo-dark.png';

function swapLogos(theme) {
    const src = theme === 'dark' ? LOGO_DARK : LOGO_LIGHT;
    document.querySelectorAll('img.logo-img').forEach(img => { img.src = src; });
}

function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('hakilabz-theme', t);
    swapLogos(t);
}

(function initTheme() {
    const saved = localStorage.getItem('hakilabz-theme');
    if (saved) { applyTheme(saved); return; }
    // Respect system pref, but default to light
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
})();

themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
});

// System pref change listener
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('hakilabz-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

/* ─── Hamburger ──────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');

function closeNav() {
    if (!hamburger || !navLinks) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger?.addEventListener('click', e => {
    e.stopPropagation(); // prevent document click handler from immediately closing
    const open = navLinks?.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
});

document.addEventListener('click', e => {
    if (!navLinks?.classList.contains('open')) return;
    if (!navLinks.contains(e.target)) closeNav();
});

// Close on escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
});

window.addEventListener('resize', () => { if (window.innerWidth > 768) closeNav(); }, { passive: true });

/* ─── Smooth scroll ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
        closeNav();
    });
});

/* ─── Navbar scroll shadow ───────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Active nav ─────────────────────────────────────────────── */
const sections = [...document.querySelectorAll('section[id]')];
const navAs = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
        }
    });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ─── Scroll reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Canvas Particle Hero ───────────────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], raf;
    const COUNT = Math.min(70, Math.floor(window.innerWidth / 20));

    function resize() {
        W = canvas.offsetWidth;
        H = canvas.offsetHeight;
        canvas.width = W * window.devicePixelRatio;
        canvas.height = H * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 1.5 + 0.5;
        this.a = Math.random() * 0.5 + 0.1;
    }
    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = W;
        if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H;
        if (this.y > H) this.y = 0;
    };

    function getParticleColor() {
        return html.getAttribute('data-theme') === 'dark'
            ? `rgba(232,25,44,`
            : `rgba(200,20,40,`;
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const col = getParticleColor();

        // Draw lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `${col}${((1 - dist / 120) * 0.18).toFixed(3)})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `${col}${p.a})`;
            ctx.fill();
            p.update();
        });

        raf = requestAnimationFrame(draw);
    }

    function init() {
        resize();
        particles = Array.from({ length: COUNT }, () => new Particle());
        cancelAnimationFrame(raf);
        draw();
    }

    window.addEventListener('resize', () => { resize(); particles.forEach(p => { p.x = Math.min(p.x, W); p.y = Math.min(p.y, H); }); }, { passive: true });

    // Pause when hidden (save perf)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else draw();
    });

    init();
})();

/* ─── 3D Tilt Effect on cards ────────────────────────────────── */
(function initTilt() {
    // Only on pointer devices
    if (!window.matchMedia('(hover: hover)').matches) return;

    const SELECTOR = '.card, .product-card, .pgh-card';
    const STRENGTH = 8; // degrees

    document.querySelectorAll(SELECTOR).forEach(el => {
        let bounds;

        el.addEventListener('mouseenter', () => { bounds = el.getBoundingClientRect(); });

        el.addEventListener('mousemove', e => {
            if (!bounds) bounds = el.getBoundingClientRect();
            const x = (e.clientX - bounds.left) / bounds.width - 0.5; // -0.5 to 0.5
            const y = (e.clientY - bounds.top) / bounds.height - 0.5;
            el.style.transform = `perspective(800px) rotateX(${-y * STRENGTH}deg) rotateY(${x * STRENGTH}deg) translateY(-6px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            bounds = null;
        });
    });
})();

/* ─── Parallax hero (desktop only) ──────────────────────────── */
if (window.matchMedia('(hover: hover)').matches && window.innerWidth > 768) {
    const hc = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (hc && y < window.innerHeight) {
            hc.style.transform = `translateY(${y * 0.22}px)`;
            hc.style.opacity = String(1 - (y / window.innerHeight) * 0.55);
        }
    }, { passive: true });
}

/* ─── Contact form (opens user's mail client) ───────────────────── */
document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="name"]')?.value.trim() || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const message = form.querySelector('[name="message"]')?.value.trim() || '';

    const subject = encodeURIComponent(`Website message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:support@hakilabz.ai?subject=${subject}&body=${body}`;

    const btn = document.getElementById('contact-submit');
    if (btn) {
        btn.textContent = 'Opening Mail App ✓';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Send Message';
            btn.disabled = false;
            form.reset();
        }, 3500);
    }
});

/* ─── Cookie Banner ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const consent = localStorage.getItem('hakilabz-cookie');

    if (!banner) return;
    if (consent === 'accepted') { banner.remove(); initAnalytics(); return; }
    if (consent === 'declined') { banner.remove(); return; }

    document.getElementById('cookie-accept')?.addEventListener('click', () => {
        localStorage.setItem('hakilabz-cookie', 'accepted');
        hideBanner(banner);
        initAnalytics();
    });
    document.getElementById('cookie-decline')?.addEventListener('click', () => {
        localStorage.setItem('hakilabz-cookie', 'declined');
        hideBanner(banner);
    });
});

function hideBanner(el) {
    el.style.transition = 'opacity 0.35s, transform 0.35s';
    el.style.opacity = '0';
    const isMobile = window.innerWidth <= 600;
    el.style.transform = isMobile ? 'translateY(16px)' : 'translateX(-50%) translateY(16px)';
    setTimeout(() => el.remove(), 360);
}

function initAnalytics() {
    const ID = 'G-SJQPFG6QYC';
    // Inject the gtag.js script (only once)
    if (!document.querySelector(`script[src*="${ID}"]`)) {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
        document.head.appendChild(s);
    }
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', ID, { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
}

/* ─── Console Branding ────────────────────────────────────────── */
console.log('%c⚡ HAKILABZ', 'font-size:28px; font-weight:900; letter-spacing:-1px; color:#E8192C;');
console.log('%cAI-Powered Innovation', 'font-size:13px; color:#86868B; letter-spacing:0.05em;');
console.log('%cwant to join the team? → info@hakilabz.ai', 'font-size:11px; color:#636366;');
