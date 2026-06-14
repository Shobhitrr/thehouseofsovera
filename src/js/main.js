/* ═══════════════════════════════════════════════
   MAIN - Application initialization & orchestration
   The House of Sovéra - Premium E-Commerce
   ═══════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── Preloader ───
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        const progress = document.querySelector('.preloader-progress');
        
        if (!preloader) return;

        let loaded = 0;
        const interval = setInterval(() => {
            loaded += Math.random() * 15 + 5;
            if (loaded > 100) loaded = 100;
            if (progress) progress.style.width = loaded + '%';
            
            if (loaded >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    document.body.classList.remove('no-scroll');
                    // Trigger hero reveals
                    triggerHeroReveal();
                }, 400);
            }
        }, 100);
    }

    function triggerHeroReveal() {
        const heroElements = document.querySelectorAll('.hero-content .reveal-up');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, i * 200);
        });
    }

    // ─── Newsletter Form ───
    function initNewsletter() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const btn = form.querySelector('button');
            
            if (input && input.value) {
                btn.textContent = 'Joined ✓';
                btn.style.background = '#5A8A6A';
                input.value = '';
                input.placeholder = 'Welcome to The House';
                
                setTimeout(() => {
                    btn.textContent = 'Join';
                    btn.style.background = '';
                    input.placeholder = 'Your email address';
                }, 3000);
            }
        });
    }

    // ─── Collection Card Clicks ───
    function initCollectionCards() {
        document.querySelectorAll('.collection-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                // Scroll to new arrivals as a demo
                const section = document.getElementById('new-arrivals');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ─── Performance Monitor ───
    function initPerformance() {
        // Lazy load 3D renderers when they come into view
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.dataset.visible = 'true';
                    } else {
                        entry.target.dataset.visible = 'false';
                    }
                });
            }, { rootMargin: '200px' });

            document.querySelectorAll('.collection-card-3d, .product-3d, .reel-3d').forEach(el => {
                lazyObserver.observe(el);
            });
        }
    }

    // ─── SEO & Meta ───
    function initSEO() {
        // Structured data for products
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "The House of Sovéra",
            "description": "Jewellery Designed For Life's Meaningful Moments",
            "url": "https://thehouseofsovera.com",
            "logo": "https://thehouseofsovera.com/logo.png",
            "sameAs": [
                "https://instagram.com/thehouseofsovera",
                "https://pinterest.com/thehouseofsovera"
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // ─── Service Worker Registration (for PWA) ───
    function initServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Service worker would be registered here for PWA support
            // navigator.serviceWorker.register('/sw.js');
        }
    }

    // ─── Security Headers (CSP via meta) ───
    function initSecurity() {
        // Content Security Policy
        const csp = document.createElement('meta');
        csp.httpEquiv = 'Content-Security-Policy';
        csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'";
        document.head.appendChild(csp);

        // Prevent clickjacking
        const xFrame = document.createElement('meta');
        xFrame.httpEquiv = 'X-Frame-Options';
        xFrame.content = 'DENY';
        document.head.appendChild(xFrame);

        // XSS Protection
        const xss = document.createElement('meta');
        xss.httpEquiv = 'X-XSS-Protection';
        xss.content = '1; mode=block';
        document.head.appendChild(xss);

        // Disable right-click on images (basic protection)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'CANVAS' || e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        // Disable image dragging
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'CANVAS' || e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        // Console warning
        console.log(
            '%c⚠️ WARNING',
            'color: #C45B5B; font-size: 24px; font-weight: bold;'
        );
        console.log(
            '%cThis is a protected property of The House of Sovéra. Unauthorized access or copying is prohibited.',
            'color: #6B6560; font-size: 14px;'
        );

        // Disable source inspection shortcuts (basic deterrent)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
                // Allow in development
                // e.preventDefault();
            }
            if (e.ctrlKey && e.key === 'u') {
                // Allow in development
                // e.preventDefault();
            }
        });
    }

    // ─── Copyright Protection ───
    function initCopyProtection() {
        // Watermark on canvas
        const watermark = () => {
            document.querySelectorAll('canvas').forEach(canvas => {
                canvas.dataset.protected = 'sovera-' + Date.now();
            });
        };
        setTimeout(watermark, 2000);

        // Disable text selection on certain elements
        const protectedElements = document.querySelectorAll('.hero-title, .nav-logo, .footer-brand h3');
        protectedElements.forEach(el => {
            el.style.userSelect = 'none';
            el.style.webkitUserSelect = 'none';
        });
    }

    // ─── Initialize Everything ───
    function init() {
        document.body.classList.add('no-scroll');
        
        // Core initializations
        initPreloader();
        initSecurity();
        initCopyProtection();
        initSEO();
        
        // Wait for DOM to be fully ready
        setTimeout(() => {
            // Initialize modules
            CurrencyManager.init();
            CartManager.init();
            AnimationEngine.init();
            Navigation.init();
            Hero3D.init();
            Collections3D.init();
            ReelsExperience.init();
            ProductModal.init();
            
            // Page-level interactions
            initNewsletter();
            initCollectionCards();
            initPerformance();
            initServiceWorker();
        }, 100);
    }

    // ─── DOM Ready ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
