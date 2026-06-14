/* ═══════════════════════════════════════════════
   PRODUCT MODAL - Full product page experience
   ═══════════════════════════════════════════════ */

const ProductModal = (() => {
    let modalRenderer = null;
    let currentProduct = null;

    const productData = {
        'eternal-band': {
            name: 'The Eternal Band',
            story: 'For promises that outlast time',
            price: 4500,
            fullStory: 'The Eternal Band was designed for those moments when words aren\'t enough. Whether it\'s a promise to yourself or someone you love, this band carries the weight of commitment with the lightness of everyday wear. Crafted from 925 sterling silver with an 18K gold vermeil finish.',
            materials: '925 Sterling Silver with 18K Gold Vermeil • Hypoallergenic • Tarnish-resistant coating • 2.5mm band width • Available in sizes 5-13',
            sizeGuide: 'Wrap a strip of paper around your finger. Mark where it overlaps. Measure the length in mm and compare: 49mm = Size 5 • 52mm = Size 6 • 54mm = Size 7 • 57mm = Size 8 • 59mm = Size 9 • 62mm = Size 10',
            care: 'Remove before swimming or bathing. Store in the provided pouch when not wearing. Clean gently with a soft cloth. Avoid contact with perfumes and chemicals. Your piece is designed for everyday wear — just treat it with intention.',
            shipping: 'Free shipping on orders above ₹5,000. Standard delivery: 5-7 business days. Express delivery: 2-3 business days. International shipping available to 40+ countries. Every order includes luxury packaging and a care card.',
            shape: 'ring-thin'
        },
        'milestone-pendant': {
            name: 'Milestone Pendant',
            story: 'Wear your achievements close',
            price: 6200,
            fullStory: 'The Milestone Pendant is for the moments that change your trajectory. That degree, that job, that first apartment — each milestone deserves a marker. This pendant sits close to your heart, a daily reminder of how far you\'ve come.',
            materials: '925 Sterling Silver • Cubic Zirconia accent stone • 18-inch chain with 2-inch extender • Lobster clasp • Pendant size: 12mm diameter',
            sizeGuide: 'One size fits most. The 18-inch chain with 2-inch extender allows you to adjust between choker and standard length. For a longer look, contact us for custom chain lengths.',
            care: 'Store flat to prevent tangling. Remove before sleeping. Clean with warm water and mild soap if needed. Pat dry with soft cloth. The CZ stone can be gently cleaned with a soft toothbrush.',
            shipping: 'Free shipping on orders above ₹5,000. Standard delivery: 5-7 business days. Express delivery: 2-3 business days. Gift wrapping available at checkout.',
            shape: 'pendant-drop'
        },
        'connection-bracelet': {
            name: 'Connection Bracelet',
            story: 'Linked by love, worn every day',
            price: 5800,
            fullStory: 'The Connection Bracelet represents bonds that transcend distance. Every link in this bracelet symbolizes a moment shared, a memory made, a connection that endures. Designed to be worn daily, it\'s a tactile reminder that you\'re never truly alone.',
            materials: '925 Sterling Silver • Interlocking link design • Adjustable from 6.5" to 8" • Safety clasp • Weight: 12g • Rhodium-plated for extra durability',
            sizeGuide: 'Measure your wrist with a flexible tape. Add 1-1.5cm for comfortable fit. Small: 6.5" • Medium: 7" • Large: 7.5" • Extra Large: 8". Not sure? Our adjustable clasp accommodates most wrist sizes.',
            care: 'The bracelet is designed for everyday wear. Remove during intense physical activity. Wipe with the included polishing cloth weekly. Store in the provided box when not wearing.',
            shipping: 'Free shipping on orders above ₹5,000. Arrives in signature Sovéra packaging. Express and international shipping available.',
            shape: 'bracelet-link'
        },
        'identity-signet': {
            name: 'Identity Signet',
            story: 'Your mark, your legacy',
            price: 7200,
            fullStory: 'The Identity Signet is rooted in an ancient tradition of sealing one\'s name onto the world. Reimagined for the modern individual, this ring is for those who know who they are and aren\'t afraid to leave their mark. Heavy enough to feel substantial, refined enough for everyday.',
            materials: '925 Sterling Silver with matte brushed finish • Flat-top signet face: 10mm • Band width: 5mm tapering • Weight: 8g • Available with optional custom engraving',
            sizeGuide: 'Signet rings should fit snugly. We recommend ordering your exact size or 0.5 size smaller than your usual ring size. Available in sizes 6-13 including half sizes.',
            care: 'The brushed finish is designed to develop a natural patina over time. If you prefer the original look, use the included polishing cloth. Avoid harsh chemicals.',
            shipping: 'Standard orders ship within 24 hours. Custom engraved pieces require 3-5 additional business days. Free shipping on all orders above ₹5,000.',
            shape: 'ring-signet'
        },
        'whisper-studs': {
            name: 'Whisper Studs',
            story: 'Quiet confidence, daily elegance',
            price: 3800,
            fullStory: 'The Whisper Studs are for those who speak softly and carry great style. Minimal, elegant, and perfectly proportioned — these studs add a touch of intentional beauty to your everyday without demanding attention. They whisper confidence.',
            materials: '925 Sterling Silver • 5mm diameter • Butterfly back closure • Cubic Zirconia center stone • Sold as pair • Hypoallergenic for sensitive ears',
            sizeGuide: 'One size. The 5mm diameter is designed to complement any ear shape and style. Suitable for standard ear piercings.',
            care: 'Remove before bathing or swimming. Store in the included velvet pouch. Clean periodically with warm soapy water. The butterfly backs can be replaced if loosened over time — contact us for free replacements.',
            shipping: 'Ships within 24 hours. Standard: 5-7 days. Express: 2-3 days. International: 7-14 days. Arrives in signature packaging.',
            shape: 'earring-stud'
        },
        'legacy-chain': {
            name: 'Legacy Chain',
            story: 'Strength you can wear',
            price: 8500,
            fullStory: 'The Legacy Chain is built to last generations. Inspired by the unbreakable bonds of family and heritage, each link is crafted to represent permanence. This is not a trend piece — it\'s designed to become an heirloom, growing more meaningful with every year you wear it.',
            materials: '925 Sterling Silver with 18K Gold Vermeil • Cuban link style • 20-inch length • 4mm width • Box clasp with safety latch • Weight: 28g',
            sizeGuide: '20-inch standard length sits below the collarbone. For a different length, contact us for 18" or 22" options. The 4mm width works beautifully as a standalone piece or layered.',
            care: 'This substantial piece is built for daily wear. Store flat to prevent kinking. Polish monthly with the included cloth. The gold vermeil finish is designed to last years with proper care.',
            shipping: 'Ships in premium wooden gift box. Free express shipping included. International delivery: 5-10 business days with tracking.',
            shape: 'chain-cuban'
        }
    };

    function init() {
        initProductClicks();
        initQuickAdd();
        initModalClose();
        initTabs();
        initModalAddToCart();
    }

    function initProductClicks() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking quick-add button
                if (e.target.closest('.quick-add-btn')) return;
                
                const productId = card.dataset.product;
                if (productId && productData[productId]) {
                    openModal(productId);
                }
            });
        });
    }

    function initQuickAdd() {
        document.querySelectorAll('.quick-add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                CartManager.addItem(name, price);
                
                // Button feedback
                const originalText = btn.textContent;
                btn.textContent = '✓ Added';
                btn.style.background = '#5A8A6A';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 1500);
            });
        });
    }

    function openModal(productId) {
        const product = productData[productId];
        if (!product) return;

        currentProduct = product;

        const modal = document.getElementById('product-modal');
        const nameEl = document.getElementById('modal-product-name');
        const storyEl = document.getElementById('modal-product-story');
        const priceEl = document.getElementById('modal-product-price');
        const tabContent = document.getElementById('modal-tab-content');
        const modal3d = document.getElementById('product-modal-3d');

        if (nameEl) nameEl.textContent = product.name;
        if (storyEl) storyEl.textContent = product.story;
        if (priceEl) priceEl.textContent = CurrencyManager.format(product.price);
        if (tabContent) tabContent.innerHTML = `<p>${product.fullStory}</p>`;

        // Reset active tab
        document.querySelectorAll('.detail-tab').forEach(tab => tab.classList.remove('active'));
        const firstTab = document.querySelector('.detail-tab[data-tab="story"]');
        if (firstTab) firstTab.classList.add('active');

        // Create 3D renderer for modal
        if (modal3d) {
            modal3d.innerHTML = '';
            try {
                modalRenderer = new Sovera3D(modal3d, {
                    shape: product.shape,
                    rotationSpeed: 0.005,
                    scale: 1.5,
                    color: [0.82, 0.7, 0.47],
                    bgColor: [0.984, 0.976, 0.961]
                });
                animateModal();
            } catch(e) {
                // Fallback
                modal3d.innerHTML = `<div style="width:100px;height:100px;border:4px solid #C9A96E;border-radius:50%;animation:rotateSlow 6s linear infinite;margin:auto;"></div>`;
            }
        }

        if (modal) {
            modal.classList.add('open');
            document.body.classList.add('no-scroll');
        }
    }

    function animateModal() {
        if (modalRenderer && !modalRenderer.useFallback) {
            modalRenderer.render();
        }
        if (document.getElementById('product-modal').classList.contains('open')) {
            requestAnimationFrame(animateModal);
        }
    }

    function closeModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }
        if (modalRenderer) {
            modalRenderer.destroy();
            modalRenderer = null;
        }
    }

    function initModalClose() {
        const closeBtn = document.getElementById('product-modal-close');
        const modal = document.getElementById('product-modal');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }

    function initTabs() {
        document.querySelectorAll('.detail-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                if (!currentProduct) return;

                document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabName = tab.dataset.tab;
                const content = document.getElementById('modal-tab-content');

                const contentMap = {
                    story: currentProduct.fullStory,
                    materials: currentProduct.materials,
                    size: currentProduct.sizeGuide,
                    care: currentProduct.care,
                    shipping: currentProduct.shipping
                };

                if (content) {
                    content.innerHTML = `<p>${contentMap[tabName] || currentProduct.fullStory}</p>`;
                }
            });
        });
    }

    function initModalAddToCart() {
        const btn = document.getElementById('modal-add-to-cart');
        if (btn) {
            btn.addEventListener('click', () => {
                if (currentProduct) {
                    CartManager.addItem(currentProduct.name, currentProduct.price);
                    
                    btn.textContent = '✓ Added to Collection';
                    btn.style.background = '#5A8A6A';
                    setTimeout(() => {
                        btn.textContent = 'Add to Collection';
                        btn.style.background = '';
                        closeModal();
                    }, 1500);
                }
            });
        }
    }

    return { init, openModal, closeModal };
})();

window.ProductModal = ProductModal;
