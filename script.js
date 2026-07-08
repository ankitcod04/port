/* ============================================
   AYUSH GURJAR — PORTFOLIO SCRIPTS
   ============================================ */

// === Particle System ===
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connectDistance = 120;
        this.mouse = { x: null, y: null, radius: 150 };
        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    init() {
        const density = Math.min(window.innerWidth * window.innerHeight / 15000, 80);
        this.particles = [];
        for (let i = 0; i < density; i++) {
            this.particles.push({ x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.4 + 0.1 });
        }
    }
    bindEvents() {
        window.addEventListener('resize', () => { this.resize(); this.init(); });
        window.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
        window.addEventListener('mouseout', () => { this.mouse.x = null; this.mouse.y = null; });
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = this.canvas.width; if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height; if (p.y > this.canvas.height) p.y = 0;
            if (this.mouse.x !== null) {
                const dx = this.mouse.x - p.x, dy = this.mouse.y - p.y, dist = Math.sqrt(dx*dx+dy*dy);
                if (dist < this.mouse.radius) { const force = (this.mouse.radius - dist) / this.mouse.radius; p.x -= dx * force * 0.02; p.y -= dy * force * 0.02; }
            }
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(201,162,39,${p.opacity})`; this.ctx.fill();
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j], dx = p.x-p2.x, dy = p.y-p2.y, dist = Math.sqrt(dx*dx+dy*dy);
                if (dist < this.connectDistance) { const alpha = (1-dist/this.connectDistance)*0.15; this.ctx.beginPath(); this.ctx.moveTo(p.x,p.y); this.ctx.lineTo(p2.x,p2.y); this.ctx.strokeStyle=`rgba(201,162,39,${alpha})`; this.ctx.lineWidth=0.5; this.ctx.stroke(); }
            }
        });
        requestAnimationFrame(() => this.animate());
    }
}

// === Cursor Glow ===
class CursorGlow {
    constructor() {
        this.el = document.getElementById('cursorGlow');
        if (!this.el || window.innerWidth < 768) return;
        this.x = 0; this.y = 0; this.targetX = 0; this.targetY = 0;
        this.bindEvents(); this.animate();
    }
    bindEvents() { document.addEventListener('mousemove', (e) => { this.targetX = e.clientX; this.targetY = e.clientY; }); }
    animate() {
        this.x += (this.targetX - this.x) * 0.08; this.y += (this.targetY - this.y) * 0.08;
        if (this.el) this.el.style.transform = `translate(${this.x - 300}px, ${this.y - 300}px)`;
        requestAnimationFrame(() => this.animate());
    }
}

// === Navbar ===
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.toggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.links = document.querySelectorAll('.nav-link, .mobile-link');
        this.sections = document.querySelectorAll('.section, .hero');
        this.isOpen = false;
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener('scroll', () => this.onScroll());
        if (this.toggle) this.toggle.addEventListener('click', () => this.toggleMenu());
        this.links.forEach(link => { link.addEventListener('click', () => { if (this.isOpen) this.toggleMenu(); }); });
    }
    onScroll() {
        const scrollY = window.scrollY;
        scrollY > 50 ? this.navbar.classList.add('scrolled') : this.navbar.classList.remove('scrolled');
        let current = '';
        this.sections.forEach(section => { const top = section.offsetTop - 200; if (scrollY >= top) current = section.getAttribute('id'); });
        document.querySelectorAll('.nav-link').forEach(link => { link.classList.remove('active'); if (link.getAttribute('href') === `#${current}`) link.classList.add('active'); });
    }
    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.toggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('open');
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
}

// === Scroll Reveal ===
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-up');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); this.observer.unobserve(entry.target); } });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        this.elements.forEach(el => this.observer.observe(el));
    }
}

// === Workflow Timeline ===
class WorkflowAnimation {
    constructor() {
        this.timeline = document.querySelector('.workflow-timeline');
        if (!this.timeline) return;
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) { this.timeline.classList.add('animated'); this.observer.unobserve(entry.target); } });
        }, { threshold: 0.3 });
        this.observer.observe(this.timeline);
    }
}

// === Smooth Scroll (only for anchor hash links, NOT external links) ===
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });
    }
}

// === Tilt Effect (only on skill/exploring cards, NOT project cards with links) ===
class TiltEffect {
    constructor() {
        if (window.innerWidth < 768) return;
        document.querySelectorAll('.skill-category, .exploring-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left, y = e.clientY - rect.top;
                const rotateX = ((y - rect.height/2) / rect.height) * -3;
                const rotateY = ((x - rect.width/2) / rect.width) * 3;
                card.style.transform = `perspective(1000px) translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }
}

// === Typing Effect ===
class TypingEffect {
    constructor() {
        this.subtitle = document.querySelector('.hero-subtitle');
        if (!this.subtitle) return;
        const text = this.subtitle.innerHTML;
        this.subtitle.innerHTML = '';
        this.subtitle.style.opacity = '1';
        setTimeout(() => this.typeHTML(this.subtitle, text, 0), 1200);
    }
    typeHTML(element, html, index) {
        if (index <= html.length) {
            element.innerHTML = html.substring(0, index);
            const speed = html[index] === '<' ? 0 : 20;
            if (html[index] === '<') {
                const closeIndex = html.indexOf('>', index);
                if (closeIndex !== -1) { element.innerHTML = html.substring(0, closeIndex + 1); setTimeout(() => this.typeHTML(element, html, closeIndex + 1), 0); return; }
            }
            setTimeout(() => this.typeHTML(element, html, index + 1), speed);
        }
    }
}

// === Magnetic Buttons ===
class MagneticButtons {
    constructor() {
        if (window.innerWidth < 768) return;
        document.querySelectorAll('.btn, .contact-card').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width/2;
                const y = e.clientY - rect.top - rect.height/2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }
}

// === Tag Animation ===
class TagAnimation {
    constructor() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-tag').forEach((tag, i) => {
                        tag.style.opacity = '0'; tag.style.transform = 'translateY(10px) scale(0.9)';
                        setTimeout(() => { tag.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)'; tag.style.opacity = '1'; tag.style.transform = 'translateY(0) scale(1)'; }, i * 80);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.skill-tags').forEach(c => observer.observe(c));
    }
}

// === Achievement Animation ===
class AchievementAnimation {
    constructor() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }, i * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        document.querySelectorAll('.achievement-card').forEach(card => observer.observe(card));
    }
}

// === Page Loader ===
class PageLoader {
    constructor() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            setTimeout(() => {
                document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
                    setTimeout(() => el.classList.add('visible'), i * 150);
                });
            }, 200);
        });
    }
}

// === Parallax Float ===
class ParallaxFloat {
    constructor() {
        if (window.innerWidth < 768) return;
        this.elements = document.querySelectorAll('.float-el');
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            this.elements.forEach((el, i) => { el.style.transform = `translateY(${scrollY * (i+1) * 0.1}px)`; });
        });
    }
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) new ParticleSystem(canvas);
    new CursorGlow();
    new Navbar();
    new ScrollReveal();
    new SmoothScroll();
    new PageLoader();
    new WorkflowAnimation();
    new TiltEffect();
    new TypingEffect();
    new MagneticButtons();
    new TagAnimation();
    new AchievementAnimation();
    new ParallaxFloat();
});

document.addEventListener('visibilitychange', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) canvas.style.opacity = document.hidden ? '0' : '0.6';
});
