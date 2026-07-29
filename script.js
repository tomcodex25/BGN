/* ==========================================================================
   WANG INSIGHTS — INTERACTIVE SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lenis Smooth Scroll Integration
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easeOutExpo
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // 2. Custom Cursor Glow Tracking
    const cursorGlow = document.getElementById('js-cursor-glow');
    if (cursorGlow) {
        const setX = gsap.quickSetter(cursorGlow, "x", "px");
        const setY = gsap.quickSetter(cursorGlow, "y", "px");

        window.addEventListener('mousemove', (e) => {
            setX(e.clientX);
            setY(e.clientY);
        });
    }


    // 3. Canvas Cinematic Particle System (Stardust & Floating Stars)
    const canvas = document.getElementById('bg-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.1;
                this.speedY = -Math.random() * 0.15 - 0.05; // slow upward drift
                this.color = Math.random() > 0.4 ? '#14b8a6' : '#f59e0b'; // Teal or Gold
                this.alpha = Math.random() * 0.4 + 0.1;
                this.fadeSpeed = Math.random() * 0.003 + 0.001;
                this.fadingIn = true;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.fadingIn) {
                    this.alpha += this.fadeSpeed;
                    if (this.alpha >= 0.6) this.fadingIn = false;
                } else {
                    this.alpha -= this.fadeSpeed;
                    if (this.alpha <= 0.05) this.reset();
                }

                if (this.x < 0 || this.x > canvas.width || this.y < 0) {
                    this.reset();
                    this.y = canvas.height;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
            }
        }

        function initParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    // 4. Card 3D Tilt & Highlight Sheen Script
    const tiltCards = document.querySelectorAll('[data-tilt]');
    if (tiltCards.length > 0 && window.matchMedia('(hover: hover)').matches) {
        tiltCards.forEach(card => {
            const shine = card.querySelector('.shine-overlay');
            const glow = card.querySelector('.card-glow-element');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Calculate tilt degrees (max 10 degrees)
                const rotateY = ((x / rect.width) - 0.5) * 12;
                const rotateX = -((y / rect.height) - 0.5) * 12;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 800,
                    ease: "power2.out",
                    duration: 0.5
                });

                if (shine) {
                    const shineX = (x / rect.width) * 100;
                    const shineY = (y / rect.height) * 100;
                    shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 60%)`;
                }

                if (glow) {
                    gsap.to(glow, {
                        x: x - glow.offsetWidth / 2,
                        y: y - glow.offsetHeight / 2,
                        opacity: 1,
                        duration: 0.3
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    ease: "power3.out",
                    duration: 0.8
                });

                if (shine) {
                    shine.style.background = 'none';
                }

                if (glow) {
                    gsap.to(glow, {
                        opacity: 0,
                        duration: 0.8
                    });
                }
            });
        });
    }


    // 5. GSAP Reveal & Entrance Animations
    gsap.registerPlugin(ScrollTrigger);

    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTimeline.fromTo('.hero-title span', 
        { y: 55, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 }
    );

    heroTimeline.fromTo('.hero-subtitle', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        "-=0.9"
    );

    heroTimeline.fromTo('.hero-desc', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2 }, 
        "-=0.8"
    );

    heroTimeline.fromTo('.hero-buttons', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        "-=0.8"
    );


    // Timeline & Section Entrance Reveals
    gsap.fromTo('.timeline-node', 
        { y: 60, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.timeline-flow',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        }
    );

    gsap.fromTo('.category-card', 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.categories-grid',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        }
    );


    // 6. Statistics Counters Animators
    const statNumbers = document.querySelectorAll('.metric-value');
    statNumbers.forEach(stat => {
        const targetValue = parseInt(stat.getAttribute('data-target'), 10);
        
        gsap.fromTo(stat, 
            { textContent: 0 },
            {
                textContent: targetValue,
                duration: 2.5,
                ease: "power3.out",
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: function() {
                    const currentVal = Math.round(stat.textContent);
                    if (targetValue === 12) {
                        stat.innerHTML = currentVal + "+";
                    } else if (targetValue === 2450) {
                        stat.innerHTML = currentVal.toLocaleString() + "+";
                    } else if (targetValue === 1500) {
                        stat.innerHTML = currentVal.toLocaleString() + "+";
                    } else {
                        stat.innerHTML = currentVal;
                    }
                }
            }
        );
    });


    // 7. Document Library Real-Time Filtering & Searching
    const searchInput = document.getElementById('js-lib-search');
    const filterSelect = document.getElementById('js-lib-filter');
    const tableBody = document.querySelector('#js-lib-table tbody');

    if (searchInput && filterSelect && tableBody) {
        const rows = tableBody.querySelectorAll('tr');

        function filterTable() {
            const filterValue = filterSelect.value;
            const searchQuery = searchInput.value.toLowerCase().trim();

            rows.forEach(row => {
                const rowType = row.getAttribute('data-type');
                const searchContent = row.getAttribute('data-search');

                const matchesFilter = (filterValue === 'all' || rowType === filterValue);
                const matchesSearch = (searchQuery === '' || searchContent.includes(searchQuery));

                if (matchesFilter && matchesSearch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('input', filterTable);
        filterSelect.addEventListener('change', filterTable);
    }
});
