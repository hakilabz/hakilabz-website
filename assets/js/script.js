/**
 * HAKILABZ — Website Script
 * Light & Feathery • AI Futuristic Design
 */

// ── Theme (light default) ────────────────────────────────────────
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]:not([media])');
    if (metaTheme) metaTheme.content = theme === 'dark' ? '#06060F' : '#ffffff';
}

// Determine initial theme:
// 1. Saved pref, 2. system pref, 3. default → light
const saved = localStorage.getItem('theme');
if (saved === 'dark') {
    applyTheme('dark');
} else if (!saved && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
} else {
    applyTheme('light');
}

themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ── Hamburger Menu ────────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
    if (!hamburgerBtn || !navLinks) return;
    hamburgerBtn.classList.remove('open');
    navLinks.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburgerBtn.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
}

// ── Smooth Scroll ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 72;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        closeMenu();
    });
});

// ── Navbar scroll shadow ──────────────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 60) {
        navbar?.style.setProperty('box-shadow', 'var(--shadow-md)');
    } else {
        navbar?.style.setProperty('box-shadow', 'none');
    }
}, { passive: true });

// ── Active nav highlight ──────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < bottom) {
            navLinkEls.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        }
    });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// ── Scroll-in animations ──────────────────────────────────────────
const animatedEls = document.querySelectorAll('.animate-on-scroll');
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animatedEls.forEach(el => io.observe(el));

// ── Hero parallax (desktop only) ──────────────────────────────────
if (window.innerWidth > 768) {
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const y = window.pageYOffset;
        if (heroContent && y < window.innerHeight) {
            heroContent.style.transform = `translateY(${y * 0.25}px)`;
            heroContent.style.opacity = String(1 - (y / window.innerHeight) * 0.6);
        }
    }, { passive: true });
}

// ── Contact form (simple) ─────────────────────────────────────────
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('[type="submit"]');
    btn.textContent = 'Message Sent ✓';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.opacity = '';
        this.reset();
    }, 3000);
});

// ── Cookie Banner ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const consent = localStorage.getItem('cookieConsent');

    if (banner) {
        if (consent) {
            banner.remove();
            if (consent === 'accepted') initAnalytics();
        } else {
            document.getElementById('cookie-accept')?.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                banner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                banner.style.opacity = '0';
                banner.style.transform = 'translateY(20px)';
                setTimeout(() => banner.remove(), 400);
                initAnalytics();
            });

            document.getElementById('cookie-decline')?.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                banner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                banner.style.opacity = '0';
                banner.style.transform = 'translateY(20px)';
                setTimeout(() => banner.remove(), 400);
            });
        }
    }
});

function initAnalytics() {
    const GA_ID = 'G-SJQPFG6QYC';
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
}

// ── Easter Egg ────────────────────────────────────────────────────
console.log('%c⚡ HAKILABZ', 'font-size:24px; font-weight:900; color:#E8192C;');
console.log('%cAI-Powered Innovation', 'font-size:13px; color:#8B92B8;');
