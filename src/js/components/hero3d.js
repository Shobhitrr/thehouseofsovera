/* ═══════════════════════════════════════════════
   HERO 3D - Main hero section 3D experience
   ═══════════════════════════════════════════════ */

const Hero3D = (() => {
    let renderer;
    let animationFrame;

    function init() {
        const container = document.getElementById('hero-3d');
        if (!container) return;

        renderer = new Sovera3D(container, {
            shape: 'ring',
            rotationSpeed: 0.003,
            scale: 1.8,
            color: [0.82, 0.7, 0.47], // Warm gold
            bgColor: [0.992, 0.984, 0.969] // Match ivory bg
        });

        animate();
    }

    function animate() {
        if (renderer && !renderer.useFallback) {
            renderer.render();
        }
        animationFrame = requestAnimationFrame(animate);
    }

    function destroy() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        if (renderer) {
            renderer.destroy();
        }
    }

    return { init, destroy };
})();

window.Hero3D = Hero3D;
