/* ═══════════════════════════════════════════════
   ANIMATIONS - Scroll reveals, parallax, interactions
   ═══════════════════════════════════════════════ */

const AnimationEngine = (() => {
    let observer;
    let cursorGlow;

    function initScrollReveal() {
        const options = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Optional: unobserve after reveal for performance
                    // observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.reveal-up').forEach(el => {
            observer.observe(el);
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navHeight = 72;
                    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('open')) {
                        mobileMenu.classList.remove('open');
                        document.body.classList.remove('no-scroll');
                    }
                }
            });
        });
    }

    function initNavScroll() {
        const nav = document.getElementById('main-nav');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    function initCursorGlow() {
        // Only on desktop
        if (window.matchMedia('(hover: none)').matches) return;
        
        cursorGlow = document.createElement('div');
        cursorGlow.classList.add('cursor-glow');
        document.body.appendChild(cursorGlow);

        let cursorX = 0, cursorY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function updateGlow() {
            glowX += (cursorX - glowX) * 0.08;
            glowY += (cursorY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(updateGlow);
        }
        updateGlow();
    }

    function initButtonEffects() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                btn.style.setProperty('--mouse-x', x + '%');
                btn.style.setProperty('--mouse-y', y + '%');
            });
        });
    }

    function initCardTilt() {
        if (window.matchMedia('(hover: none)').matches) return;

        document.querySelectorAll('.collection-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                card.style.transform = `
                    perspective(1000px)
                    translateY(-4px)
                    rotateX(${y * -3}deg)
                    rotateY(${x * 3}deg)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                const offset = (center - window.innerHeight / 2) * speed * 0.1;
                el.style.transform = `translateY(${offset}px)`;
            });
        }, { passive: true });
    }

    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    animateCount(entry.target, 0, target, 2000);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    function animateCount(el, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const value = Math.round(start + (end - start) * eased);
            el.textContent = value;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function init() {
        initScrollReveal();
        initSmoothScroll();
        initNavScroll();
        initCursorGlow();
        initButtonEffects();
        initCardTilt();
        initParallax();
        initCounterAnimation();
    }

    return { init };
})();

window.AnimationEngine = AnimationEngine;
