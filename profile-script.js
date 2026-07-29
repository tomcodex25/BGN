/* ==========================================================================
   BGN / KOMACHI PREMIUM LANDING PAGE — INTERACTIVE SCRIPTS
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
        // QuickSetter creates high-performance GSAP setters for coordinates
        const setX = gsap.quickSetter(cursorGlow, "x", "px");
        const setY = gsap.quickSetter(cursorGlow, "y", "px");

        window.addEventListener('mousemove', (e) => {
            // Apply coordinates with offset to center the glow element
            setX(e.clientX - 225);
            setY(e.clientY - 225);
        });
    }


    // 3. Canvas Cinematic Particle System (Stardust & Floating Stars)
    const canvas = document.getElementById('bg-particles');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 85;

    // Responsive Canvas resizing
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
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.speedY = -Math.random() * 0.25 - 0.05; // upward drift
            this.color = Math.random() > 0.3 ? '#56B6FF' : '#F6D36B'; // Cyan or Champagne Gold
            this.alpha = Math.random() * 0.5 + 0.15;
            this.fadeSpeed = Math.random() * 0.005 + 0.001;
            this.fadingIn = true;
            this.parallaxFactor = Math.random() * 0.6 + 0.2; // depth levels
        }

        update() {
            // Horizontal and vertical drift
            this.x += this.speedX;
            this.y += this.speedY;

            // Fade dynamics
            if (this.fadingIn) {
                this.alpha += this.fadeSpeed;
                if (this.alpha >= 0.75) this.fadingIn = false;
            } else {
                this.alpha -= this.fadeSpeed;
                if (this.alpha <= 0.05) this.reset();
            }

            // Recenter coordinates when boundary breached
            if (this.x < 0 || this.x > canvas.width || this.y < 0) {
                this.reset();
                this.y = canvas.height;
            }
        }

        draw() {
            // Parallax offset calculated from scroll position
            const scrollOffset = window.scrollY * this.parallaxFactor;
            let drawY = this.y - scrollOffset;

            // Wrap vertical coordinate so particles loop infinitely on screen scroll
            if (drawY < 0) {
                drawY = canvas.height + (drawY % canvas.height);
            } else if (drawY > canvas.height) {
                drawY = drawY % canvas.height;
            }

            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, drawY, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles array
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Rain Particle class (Mazhai)
    class RainDrop {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -100;
            this.length = Math.random() * 25 + 15;
            this.speedY = Math.random() * 10 + 12; // Fast vertical fall
            this.speedX = -1.8; // Slant to the left
            this.alpha = Math.random() * 0.18 + 0.05;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y > canvas.height || this.x < 0) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.speedX, this.y + this.length);
            ctx.strokeStyle = '#A7E0FF';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
    }

    let rainDrops = [];
    const rainDropCount = 120;
    for (let i = 0; i < rainDropCount; i++) {
        rainDrops.push(new RainDrop());
    }

    // Canvas animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw stardust
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw rain (Mazhai)
        rainDrops.forEach(r => {
            r.update();
            r.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // 4. Hero Section Interactive 3D Parallax Logo (Replaced by generic [data-tilt] on showcase poster)


    // 5. Card 3D Tilt & Highlight Sheen Script
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    if (!isTouchDevice) {
        tiltCards.forEach(card => {
            const glow = card.querySelector('.card-glow-element');
            const sheen = card.querySelector('.shine-overlay');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Normalize coordinate offsets from -0.5 to 0.5
                const normX = (mouseX / rect.width) - 0.5;
                const normY = (mouseY / rect.height) - 0.5;

                // Dynamic rotation values
                const rotateY = normX * 14; 
                const rotateX = -normY * 14;

                // High performance transform modifications
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

                // Align local glow element coordinates
                if (glow) {
                    glow.style.left = `${mouseX}px`;
                    glow.style.top = `${mouseY}px`;
                }

                // Slide structural sheen reflection
                if (sheen) {
                    const shiftPercentX = normX * 45;
                    const shiftPercentY = normY * 45;
                    sheen.style.transform = `rotate(25deg) translate(${shiftPercentX}%, ${shiftPercentY}%)`;
                }
            });

            // Smooth reset when hover ends
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
                if (sheen) {
                    sheen.style.transform = `rotate(25deg) translate(0%, 0%)`;
                }
            });
        });
    }


    // 6. GSAP Reveal & Entrance Animations
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Entrance Timeline
    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTimeline.fromTo('.hero-poster-showcase', 
        { scale: 0.8, opacity: 0, rotateX: 15 }, 
        { scale: 1, opacity: 1, rotateX: 0, duration: 1.8 }
    );

    heroTimeline.fromTo('.portfolio-tag span', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        "-=1.2"
    );

    heroTimeline.fromTo('.hero-title span', 
        { y: 55, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 }, 
        "-=1.0"
    );

    heroTimeline.fromTo('.hero-subtitle span', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, 
        "-=0.9"
    );

    heroTimeline.fromTo('.reveal-fade', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        "-=0.7"
    );

    heroTimeline.fromTo('.scroll-indicator', 
        { opacity: 0 }, 
        { opacity: 0.7, duration: 1.5 }, 
        "-=0.5"
    );


    // Legacy Section Scroll Triggers
    gsap.fromTo('.legacy-card', 
        { y: 100, opacity: 0, scale: 0.95 },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.legacy-section',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        }
    );


    // Values Grid Scroll Triggers
    gsap.fromTo('.value-card',
        { y: 80, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.values-section',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        }
    );


    // Statistics Counters Animators
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const targetValue = parseInt(stat.getAttribute('data-target'), 10);
        
        gsap.fromTo(stat, 
            { textContent: 0 },
            {
                textContent: targetValue,
                duration: 2.8,
                ease: "power3.out",
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: function() {
                    const currentVal = Math.round(stat.textContent);
                    if (targetValue === 1908) {
                        stat.innerHTML = currentVal;
                    } else {
                        stat.innerHTML = currentVal + "+";
                    }
                }
            }
        );
    });


    // Signature Section Text Animation
    const signatureTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.signature-section',
            start: 'top 80%',
            end: 'bottom top',
            scrub: true // ties animation progress to scroll speed
        }
    });

    signatureTL.fromTo('.text-bgn', 
        { scale: 0.8, x: -100 }, 
        { scale: 1.1, x: 50, ease: "none" }
    );

    signatureTL.fromTo('.text-owner', 
        { scale: 1.1, x: 100 }, 
        { scale: 0.9, x: -50, ease: "none" }, 
        0 // run parallel to the BGN backdrop offset
    );

    // Subtle fading reveal for Signature Section subtext
    gsap.fromTo('.signature-subtext', 
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.signature-section',
                start: 'top 60%',
                toggleActions: 'play none none none'
            }
        }
    );


    // Success Stories Section Scroll Triggers
    gsap.fromTo('.story-image-wrapper',
        { x: -60, opacity: 0, scale: 0.98 },
        {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.stories-section',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        }
    );

    gsap.fromTo('.story-content-card',
        { x: 60, opacity: 0, scale: 0.98 },
        {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.stories-section',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        }
    );

    gsap.fromTo('.story-timeline-item',
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.25,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.stories-section',
                start: 'top 65%',
                toggleActions: 'play none none none'
            }
        }
    );


    // 7. Atmospheric Storm System (Mazhai, Minnal, Iddi Audio/Flash controls)
    let audioPlaying = false;
    const rainAudio = new Audio('https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/rain.mp3');
    rainAudio.loop = true;
    rainAudio.volume = 0.45;

    const thunderTracks = [
        new Audio('https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/thunder.mp3')
    ];

    const soundToggle = document.getElementById('js-sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            audioPlaying = !audioPlaying;
            soundToggle.classList.toggle('active', audioPlaying);
            
            if (audioPlaying) {
                rainAudio.play().catch(e => console.log('Autoplay check:', e));
                // Instantly trigger a flash and thunder clap on activation
                setTimeout(triggerLightning, 600);
            } else {
                rainAudio.pause();
                // Immediately stop and reset any active thunder sounds
                thunderTracks.forEach(track => {
                    track.pause();
                    track.currentTime = 0;
                });
            }
        });
    }

    const flashElement = document.getElementById('js-lightning-flash');

    function triggerLightning() {
        if (!flashElement) return;

        // Play thunder sound (Iddi) if active
        if (audioPlaying) {
            const randThunder = thunderTracks[Math.floor(Math.random() * thunderTracks.length)];
            randThunder.volume = 0.55;
            randThunder.play().catch(e => console.log(e));
        }

        // Select elements for the thunderstorm rumble screen shake
        const shakeElements = document.querySelectorAll(
            '.hero-title, .hero-poster-showcase, .legacy-card, .legacy-graphic-card, .value-card, .stat-item'
        );

        // GSAP double-flash timeline (Minnal)
        const flashTL = gsap.timeline();
        flashTL.to(flashElement, { opacity: 0.85, duration: 0.05, ease: "power4.out" })
               .to(flashElement, { opacity: 0.1, duration: 0.08, ease: "power4.in" })
               .to(flashElement, { opacity: 0.95, duration: 0.06, ease: "power4.out" })
               .to(flashElement, { opacity: 0, duration: 1.5, ease: "power3.inOut" });

        // Thunder rumble screen shake
        gsap.fromTo(shakeElements, 
            { x: () => (Math.random() - 0.5) * 6 }, 
            { x: 0, duration: 0.06, repeat: 8, yoyo: true, ease: "rough" }
        );
    }

    // Loop lightning strikes at random intervals (every 12 to 25 seconds)
    function startLightningLoop() {
        const nextClap = Math.random() * 13000 + 12000;
        setTimeout(() => {
            triggerLightning();
            startLightningLoop();
        }, nextClap);
    }
    startLightningLoop();

});
