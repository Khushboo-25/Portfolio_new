/* ======================================================
   Khushboo Chaurasiya — Portfolio JS
   Features: typed animation, active nav scroll spy,
   scroll progress bar, back-to-top, mobile menu,
   dark/light mode toggle, contact form handler
====================================================== */

// ── Declarations first to avoid hoisting issues ──────
const navbar    = document.getElementById('navbar');
const menuBtn   = document.getElementById('menu-btn');
const themeIcon = document.getElementById('theme-icon');
const themeToggle = document.getElementById('theme-toggle');
const backTop   = document.getElementById('back-top');
const progress  = document.getElementById('scroll-progress');

// ── Mobile Menu ───────────────────────────────────────
menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) {
        navbar.classList.remove('active');
    }
});

// Close menu when a nav link is clicked
navbar.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navbar.classList.remove('active'));
});

// ── Scroll Progress + Back-to-Top ────────────────────
window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const percent    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progress.style.width = percent + '%';

    // Back-to-top visibility
    if (scrollTop > 320) {
        backTop.classList.add('visible');
    } else {
        backTop.classList.remove('visible');
    }
});

backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Active Nav Highlight (Intersection Observer) ──────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === '#' + id
                );
            });
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ── Dark / Light Mode Toggle ──────────────────────────
const savedTheme = localStorage.getItem('kp-theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.className = 'fa-solid fa-sun';
}

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('kp-theme', isLight ? 'light' : 'dark');
});

// ── Typed Text Animation ──────────────────────────────
const roles = [
    'Full Stack Developer',
    'MERN Stack Engineer',
    'Competitive Programmer',
    'Problem Solver'
];

const typedEl  = document.getElementById('typed-text');
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const TYPING_SPEED   = 80;
const DELETING_SPEED = 45;
const PAUSE_AFTER    = 1800;
const PAUSE_BEFORE   = 300;

function typeWriter() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        // Typing forward
        typedEl.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeWriter, PAUSE_AFTER);
            return;
        }
        setTimeout(typeWriter, TYPING_SPEED);
    } else {
        // Deleting
        typedEl.textContent = currentRole.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex  = (roleIndex + 1) % roles.length;
            setTimeout(typeWriter, PAUSE_BEFORE);
            return;
        }
        setTimeout(typeWriter, DELETING_SPEED);
    }
}

// Start after a short initial delay
setTimeout(typeWriter, 600);

// ── Contact Form Handler (Formspree AJAX) ────────────
async function handleFormSubmit(e) {
    e.preventDefault();
    const form      = e.target;
    const status    = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText   = document.getElementById('btn-text');
    const endpoint  = form.dataset.formspreeEndpoint;

    // Sync hidden _replyto with the email field so Formspree threads correctly
    const emailVal = form.querySelector('#cf-email').value.trim();
    const replyTo  = form.querySelector('#cf-replyto');
    if (replyTo) replyTo.value = emailVal;

    // If the placeholder endpoint is still in place, warn the developer
    if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
        status.textContent = '⚠ Set your Formspree endpoint in the HTML form to enable real email delivery.';
        status.style.color = '#fbbf24';
        return;
    }

    // Loading state
    submitBtn.disabled  = true;
    btnText.textContent = 'Sending…';
    status.textContent  = '';

    try {
        const response = await fetch(endpoint, {
            method:  'POST',
            headers: { 'Accept': 'application/json' },
            body:    new FormData(form),
        });

        if (response.ok) {
            status.textContent = '✔ Message sent! I\'ll get back to you soon.';
            status.style.color = '#81e6a0';
            form.reset();
        } else {
            const data = await response.json().catch(() => ({}));
            const msg  = data?.errors?.map(err => err.message).join(', ')
                         || 'Something went wrong. Try emailing me directly.';
            status.textContent = '✗ ' + msg;
            status.style.color = '#f87171';
        }
    } catch {
        status.textContent = '✗ Network error — please email me directly at khushboo250104@gmail.com';
        status.style.color = '#f87171';
    } finally {
        submitBtn.disabled  = false;
        btnText.textContent = 'Send Message';
        // Clear status after 7 seconds
        setTimeout(() => { status.textContent = ''; }, 7000);
    }
}

// ── AOS Init ─────────────────────────────────────────
AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: true,
    offset: 60
});
