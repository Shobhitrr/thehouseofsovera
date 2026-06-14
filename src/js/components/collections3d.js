/* ═══════════════════════════════════════════════
   COLLECTIONS 3D - 3D previews for collection cards & products
   ═══════════════════════════════════════════════ */

const Collections3D = (() => {
    let renderers = [];
    let productRenderers = [];
    let animationFrame;
    let isRunning = false;

    function init() {
        initCollectionCards();
        initProductCards();
        startAnimation();
    }

    function initCollectionCards() {
        const cards = document.querySelectorAll('.collection-card-3d');
        
        cards.forEach(container => {
            const shape = container.dataset.shape || 'ring';
            
            const colorMap = {
                ring: [0.82, 0.7, 0.47],
                bracelet: [0.75, 0.75, 0.78],
                pendant: [0.85, 0.65, 0.5],
                earring: [0.82, 0.7, 0.47],
                chain: [0.75, 0.72, 0.65],
                couple: [0.85, 0.72, 0.55],
                mens: [0.6, 0.6, 0.62]
            };

            try {
                const renderer = new Sovera3D(container, {
                    shape: shape,
                    rotationSpeed: 0.008,
                    scale: 1.2,
                    color: colorMap[shape] || [0.82, 0.7, 0.47],
                    bgColor: [0.984, 0.976, 0.961]
                });
                renderers.push(renderer);
            } catch(e) {
                // Fallback: create CSS animation
                createCSSFallback(container, shape);
            }
        });
    }

    function initProductCards() {
        const products = document.querySelectorAll('.product-3d');
        
        const shapeMap = {
            'ring-thin': 'ring-thin',
            'pendant-drop': 'pendant-drop',
            'bracelet-link': 'bracelet-link',
            'ring-signet': 'ring-signet',
            'earring-stud': 'earring-stud',
            'chain-cuban': 'chain-cuban'
        };

        const colorMap = {
            'ring-thin': [0.85, 0.72, 0.5],
            'pendant-drop': [0.82, 0.7, 0.47],
            'bracelet-link': [0.75, 0.75, 0.78],
            'ring-signet': [0.7, 0.68, 0.62],
            'earring-stud': [0.85, 0.72, 0.5],
            'chain-cuban': [0.82, 0.7, 0.47]
        };

        products.forEach(container => {
            const shape = container.dataset.productShape || 'ring';
            
            try {
                const renderer = new Sovera3D(container, {
                    shape: shapeMap[shape] || shape,
                    rotationSpeed: 0.006,
                    scale: 1.0,
                    color: colorMap[shape] || [0.82, 0.7, 0.47],
                    bgColor: [0.984, 0.976, 0.957]
                });
                productRenderers.push(renderer);
            } catch(e) {
                createCSSFallback(container, shape);
            }
        });
    }

    function createCSSFallback(container, shape) {
        const shapeEl = document.createElement('div');
        
        const styles = {
            ring: 'width:80px;height:80px;border:4px solid #C9A96E;border-radius:50%;',
            'ring-thin': 'width:80px;height:80px;border:2px solid #C9A96E;border-radius:50%;',
            'ring-signet': 'width:70px;height:70px;border:5px solid #8B7B6B;border-radius:50%;',
            bracelet: 'width:100px;height:100px;border:3px solid #B8B8BC;border-radius:50%;',
            'bracelet-link': 'width:90px;height:90px;border:4px solid #B8B8BC;border-radius:50%;',
            pendant: 'width:50px;height:70px;border:3px solid #C9A96E;border-radius:50% 50% 50% 50% / 40% 40% 60% 60%;',
            'pendant-drop': 'width:40px;height:60px;border:3px solid #C9A96E;border-radius:50% 50% 50% 50% / 40% 40% 60% 60%;',
            earring: 'width:30px;height:30px;border:3px solid #C9A96E;border-radius:50%;',
            'earring-stud': 'width:25px;height:25px;background:#C9A96E;border-radius:50%;',
            chain: 'width:60px;height:80px;border:3px solid #AFA89C;border-radius:40%;',
            'chain-cuban': 'width:70px;height:90px;border:4px solid #C9A96E;border-radius:40%;',
            couple: 'width:80px;height:80px;border:3px solid #C9A96E;border-radius:50%;box-shadow:20px 0 0 -1px transparent, 20px 0 0 3px #D4B98A;',
            mens: 'width:80px;height:80px;border:6px solid #8B8B8E;border-radius:50%;'
        };

        shapeEl.style.cssText = `
            ${styles[shape] || styles.ring}
            animation: rotateSlow 8s linear infinite, breathe 4s ease-in-out infinite;
            box-shadow: 0 4px 20px rgba(201,169,110,0.15);
        `;
        
        container.style.cssText += 'display:flex;align-items:center;justify-content:center;';
        container.appendChild(shapeEl);
    }

    function startAnimation() {
        if (isRunning) return;
        isRunning = true;
        animate();
    }

    function animate() {
        // Only render visible renderers for performance
        renderers.forEach(r => {
            if (r && !r.useFallback && isElementVisible(r.container)) {
                r.render();
            }
        });

        productRenderers.forEach(r => {
            if (r && !r.useFallback && isElementVisible(r.container)) {
                r.render();
            }
        });

        animationFrame = requestAnimationFrame(animate);
    }

    function isElementVisible(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.bottom > -100 &&
            rect.top < window.innerHeight + 100
        );
    }

    function destroy() {
        isRunning = false;
        if (animationFrame) cancelAnimationFrame(animationFrame);
        renderers.forEach(r => r && r.destroy());
        productRenderers.forEach(r => r && r.destroy());
        renderers = [];
        productRenderers = [];
    }

    return { init, destroy };
})();

window.Collections3D = Collections3D;
