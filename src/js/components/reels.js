/* ═══════════════════════════════════════════════
   REELS - Vertical scrolling experience
   Instagram/TikTok-style behind-the-scenes
   ═══════════════════════════════════════════════ */

const ReelsExperience = (() => {
    let currentReel = 0;
    let totalReels = 7;
    let autoPlayTimer = null;
    let isPaused = false;
    let reelRenderers = [];

    function init() {
        createDots();
        initNavigation();
        initReelRenderers();
        initTouchSwipe();
        initKeyboard();
        startAutoPlay();
        updateReel(0);
    }

    function createDots() {
        const dotsContainer = document.getElementById('reels-dots');
        if (!dotsContainer) return;

        for (let i = 0; i < totalReels; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToReel(i));
            dotsContainer.appendChild(dot);
        }
    }

    function initNavigation() {
        const prevBtn = document.getElementById('reel-prev');
        const nextBtn = document.getElementById('reel-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToReel(currentReel - 1);
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToReel(currentReel + 1);
                resetAutoPlay();
            });
        }
    }

    function initReelRenderers() {
        const reelVisuals = document.querySelectorAll('.reel-3d');
        const shapes = ['gem', 'ring-thin', 'ring', 'pendant', 'bracelet', 'ring-signet', 'pendant-drop'];
        const colors = [
            [0.85, 0.72, 0.5],   // concept - warm gold
            [0.6, 0.6, 0.65],    // CAD - silver/grey
            [0.82, 0.7, 0.47],   // craft - gold
            [0.75, 0.75, 0.78],  // quality - platinum
            [0.85, 0.65, 0.5],   // package - rose gold
            [0.82, 0.7, 0.47],   // finished - gold
            [0.8, 0.72, 0.55]    // experience - warm
        ];

        reelVisuals.forEach((container, index) => {
            try {
                const renderer = new Sovera3D(container, {
                    shape: shapes[index] || 'ring',
                    rotationSpeed: 0.004 + (index * 0.001),
                    scale: 1.3,
                    color: colors[index] || [0.82, 0.7, 0.47],
                    bgColor: [0.984, 0.976, 0.961]
                });
                reelRenderers.push(renderer);
            } catch(e) {
                // CSS fallback handled by Collections3D createCSSFallback
                const fallback = document.createElement('div');
                fallback.style.cssText = `
                    width: 80px; height: 80px;
                    border: 3px solid #C9A96E;
                    border-radius: 50%;
                    animation: rotateSlow 6s linear infinite;
                    margin: auto;
                `;
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
                container.appendChild(fallback);
                reelRenderers.push(null);
            }
        });
    }

    function goToReel(index) {
        if (index < 0) index = totalReels - 1;
        if (index >= totalReels) index = 0;

        const reels = document.querySelectorAll('.reel');
        const dots = document.querySelectorAll('.reels-dots .dot');

        // Deactivate current
        if (reels[currentReel]) {
            reels[currentReel].classList.remove('active');
        }
        if (dots[currentReel]) {
            dots[currentReel].classList.remove('active');
        }

        // Activate new
        currentReel = index;
        
        if (reels[currentReel]) {
            reels[currentReel].classList.add('active');
        }
        if (dots[currentReel]) {
            dots[currentReel].classList.add('active');
        }
    }

    function updateReel(index) {
        goToReel(index);
    }

    function startAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            if (!isPaused) {
                goToReel(currentReel + 1);
            }
        }, 5000);
    }

    function resetAutoPlay() {
        startAutoPlay();
    }

    function pause() {
        isPaused = true;
    }

    function resume() {
        isPaused = false;
    }

    function initTouchSwipe() {
        const container = document.getElementById('reels-container');
        if (!container) return;

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            pause();
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    goToReel(currentReel + 1);
                } else {
                    goToReel(currentReel - 1);
                }
            }

            isDragging = false;
            resume();
            resetAutoPlay();
        }, { passive: true });

        // Pause on hover (desktop)
        container.addEventListener('mouseenter', pause);
        container.addEventListener('mouseleave', () => {
            resume();
            resetAutoPlay();
        });
    }

    function initKeyboard() {
        // Only when reels section is in view
        const section = document.querySelector('.reels-section');
        if (!section) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.addEventListener('keydown', handleKey);
                } else {
                    document.removeEventListener('keydown', handleKey);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(section);
    }

    function handleKey(e) {
        if (e.key === 'ArrowLeft') {
            goToReel(currentReel - 1);
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            goToReel(currentReel + 1);
            resetAutoPlay();
        } else if (e.key === ' ') {
            e.preventDefault();
            isPaused ? resume() : pause();
        }
    }

    // Animation loop for reel renderers
    function animate() {
        reelRenderers.forEach((r, i) => {
            if (r && !r.useFallback && i === currentReel) {
                r.render();
            }
        });
        requestAnimationFrame(animate);
    }

    function start() {
        init();
        animate();
    }

    return { init: start };
})();

window.ReelsExperience = ReelsExperience;
