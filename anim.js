document.addEventListener('DOMContentLoaded', () => {
    splitTitle();
    setupReveal();
    setupParallax();
});

function splitTitle() {
    const title = document.querySelector('.title');
    if (!title) {
        return;
    }
    const chars = [...title.textContent.trim()];
    title.textContent = '';
    title.setAttribute('aria-label', chars.join(''));
    chars.forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.animationDelay = `${i * 55}ms`;
        title.appendChild(span);
    });
}

function setupReveal() {
    const targets = document.querySelectorAll('section, footer');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    targets.forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

function setupParallax() {
    const header = document.querySelector('header');
    const decos = document.querySelectorAll('.deco');
    if (!header || decos.length === 0) {
        return;
    }
    header.addEventListener('mousemove', (event) => {
        const rect = header.getBoundingClientRect();
        const dx = (event.clientX - rect.left) / rect.width - 0.5;
        const dy = (event.clientY - rect.top) / rect.height - 0.5;
        decos.forEach((el, i) => {
            const depth = 10 + i * 7;
            el.style.setProperty('--px', `${(-dx * depth).toFixed(1)}px`);
            el.style.setProperty('--py', `${(-dy * depth).toFixed(1)}px`);
        });
    });
    header.addEventListener('mouseleave', () => {
        decos.forEach((el) => {
            el.style.setProperty('--px', '0px');
            el.style.setProperty('--py', '0px');
        });
    });
}
