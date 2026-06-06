document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Preloader ---
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.loader-progress');
    
    gsap.to(progressBar, {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.to(preloader, {
                yPercent: -100,
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => {
                    preloader.style.display = "none";
                    initHeroAnimations();
                }
            });
        }
    });

    // --- 2. Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate GSAP with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // --- 3. Custom Cursor & Magnetic Effects ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const magneticElements = document.querySelectorAll('.magnetic, a, button, .accordion-header');

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Custom Cursor Render Loop
    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        gsap.set(cursor, { x: cursorX, y: cursorY });
        gsap.set(follower, { x: followerX, y: followerY });
    });

    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            follower.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            follower.classList.remove('hovered');
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
        
        // Magnetic Pull
        if(el.classList.contains('magnetic')) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
            });
        }
    });

    // --- 4. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 5. TypeIt Animation ---
    new TypeIt(".type-it", {
        strings: ["Premium Websites", "Digital Brands", "Lead Generators", "Growth Engines"],
        speed: 100,
        breakLines: false,
        loop: true,
        waitUntilVisible: true,
        deleteSpeed: 50
    }).go();

    // --- 6. Initial Animations (Fired after preloader) ---
    function initHeroAnimations() {
        gsap.from(".fade-up", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        });
        
        gsap.from(".hero-visual", {
            scale: 0.8,
            opacity: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)",
            delay: 0.5
        });

        // Counter Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            gsap.to(counter, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power2.out",
                delay: 0.8
            });
        });
    }

    // --- 7. Scroll Animations (ScrollTrigger) ---
    // Reveal Up
    gsap.utils.toArray('.reveal-up').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Split Layout
    gsap.from(".split-text", {
        scrollTrigger: {
            trigger: ".split-layout",
            start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".split-visual", {
        scrollTrigger: {
            trigger: ".split-layout",
            start: "top 80%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Floating Images Parallax
    gsap.utils.toArray('.floating-img').forEach(img => {
        gsap.to(img, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // --- 8. FAQ Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            accordionItems.forEach(acc => {
                acc.classList.remove('active');
                acc.querySelector('.accordion-content').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

});
