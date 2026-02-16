// Custom cursor - dot (default) and ring (on clickable). Uses CSS vars for zero-lag tracking.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const prefersFinePointer = window.matchMedia('(pointer: fine)').matches;
if (prefersFinePointer && !prefersReducedMotion) {
    document.body.classList.add('has-custom-cursor');
    document.documentElement.style.setProperty('--cursor-x', '-100px');
    document.documentElement.style.setProperty('--cursor-y', '-100px');
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="cursor-dot"></span><span class="cursor-ring"></span>';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    }, { passive: true });

    const clickables = document.querySelectorAll('a, button, [role="button"], input[type="submit"], .tonal-break__card, .showcase__card');
    clickables.forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-over-clickable'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-over-clickable'));
    });

    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
}

// Land on top when loading homepage
const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
if (isHomePage) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
}

// Hero: letter-by-letter hover (spring scale) + cursor glow (direct position, no RAF)
if (isHomePage && prefersFinePointer && !prefersReducedMotion) {
    const heroName = document.getElementById('hero-name');
    const heroGlow = document.getElementById('hero-cursor-glow');
    const letters = heroName ? heroName.querySelectorAll('.hero-letter, .dotted-i') : [];
    let heroRect = null;
    const updateHeroRect = () => {
        const hero = document.querySelector('.hero');
        heroRect = hero ? hero.getBoundingClientRect() : null;
    };
    updateHeroRect();
    window.addEventListener('resize', updateHeroRect);

    if (heroGlow) {
        document.addEventListener('mousemove', (e) => {
            if (!heroRect) return;
            if (e.clientY >= heroRect.top && e.clientY <= heroRect.bottom && e.clientX >= heroRect.left && e.clientX <= heroRect.right) {
                heroGlow.classList.add('is-active');
                heroGlow.style.left = (e.clientX - heroRect.left) + 'px';
                heroGlow.style.top = (e.clientY - heroRect.top) + 'px';
            } else {
                heroGlow.classList.remove('is-active');
            }
        }, { passive: true });
    }

    letters.forEach((letter) => {
        letter.addEventListener('mouseenter', () => letter.classList.add('is-hovered'));
        letter.addEventListener('mouseleave', () => letter.classList.remove('is-hovered'));
    });
}

// Homepage showcase - clip-path reveal + parallax
const showcaseContainer = document.querySelector('[data-showcase-container]');
const showcaseCards = document.querySelectorAll('.showcase__card');
if (showcaseContainer && showcaseCards.length && isHomePage) {
    const yRanges = [[100, -100], [150, -150], [80, -80]];
    const prefReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefReduce && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
        showcaseCards.forEach((c) => io.observe(c));
    } else {
        showcaseCards.forEach((c) => c.classList.add('in-view'));
    }

    if (!prefReduce) {
        let rafId = null;
        function updateShowcaseParallax() {
            const rect = showcaseContainer.getBoundingClientRect();
            const vh = window.innerHeight;
            const sh = rect.height;
            const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + sh)));

            showcaseCards.forEach((card, i) => {
                const [start, end] = yRanges[i] || [0, 0];
                const y = start + (end - start) * progress;
                card.style.transform = `translateY(${y}px)`;
            });
        }
        function onScroll() {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                updateShowcaseParallax();
                rafId = null;
            });
        }
        updateShowcaseParallax();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    }
}

// Features section - cycling animations (Clarity, Voice, Systems)
if (isHomePage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const clarityText = document.getElementById('clarity-text');
    const clarityTexts = ['Click here to continue', 'Continue', 'Next'];
    if (clarityText) {
        let cIdx = 0;
        setInterval(() => {
            cIdx = (cIdx + 1) % clarityTexts.length;
            clarityText.style.opacity = '0';
            clarityText.style.transform = 'scale(0.9)';
            setTimeout(() => {
                clarityText.textContent = clarityTexts[cIdx];
                clarityText.style.opacity = '1';
                clarityText.style.transform = 'scale(1)';
            }, 150);
        }, 2000);
    }

    const voiceText = document.getElementById('voice-text');
    const voiceTone = document.getElementById('voice-tone');
    const voiceMessages = [
        { text: 'Your payment was successful!', tone: 'Friendly' },
        { text: 'Transaction completed.', tone: 'Professional' },
        { text: "Done! You're all set.", tone: 'Casual' }
    ];
    if (voiceText && voiceTone) {
        let vIdx = 0;
        setInterval(() => {
            vIdx = (vIdx + 1) % 3;
            voiceText.style.opacity = '0';
            voiceText.style.transform = 'translateY(10px)';
            setTimeout(() => {
                voiceText.textContent = voiceMessages[vIdx].text;
                voiceTone.textContent = voiceMessages[vIdx].tone;
                voiceText.style.opacity = '1';
                voiceText.style.transform = 'translateY(0)';
            }, 200);
        }, 2500);
    }

    const systemLabel = document.getElementById('system-label');
    const systemDots = document.querySelectorAll('.features__dot-item');
    const systemLabels = ['Button', 'Modal', 'Error', 'Toast'];
    if (systemLabel && systemDots.length === 4) {
        let sIdx = 0;
        systemDots[0].classList.add('active');
        setInterval(() => {
            sIdx = (sIdx + 1) % 4;
            systemDots.forEach((d, i) => d.classList.toggle('active', i === sIdx));
            systemLabel.style.opacity = '0';
            setTimeout(() => {
                systemLabel.textContent = systemLabels[sIdx];
                systemLabel.style.opacity = '1';
            }, 150);
        }, 1500);
    }
}

// Slow fade-ins on scroll (home + about pages)
const isAboutPage = document.body.classList.contains('about-page');
const fadeEls = document.querySelectorAll('.animate-fade');
if (fadeEls.length) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        fadeEls.forEach((el) => el.classList.add('in-view'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    observer.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
        fadeEls.forEach((el) => observer.observe(el));
    }
}

// Square Backup page – quote word-reveal, hero parallax, vision stagger, outcome reveal
if (document.body.classList.contains('router-case-study')) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const quoteEl = document.querySelector('.router-crisis__quote.animate-fade, .router-quote__text.animate-fade');
    if (quoteEl && !prefersReducedMotion) {
        function triggerQuoteReveal() {
            const rect = quoteEl.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && !quoteEl.classList.contains('in-view')) {
                quoteEl.classList.add('in-view');
            }
        }
        requestAnimationFrame(function () { requestAnimationFrame(triggerQuoteReveal); });
        window.addEventListener('load', triggerQuoteReveal);
    }

    // Hero image subtle parallax (y shift)
    const heroParallax = document.querySelector('.router-hero__parallax img');
    if (heroParallax && !prefersReducedMotion) {
        let rafId = null;
        function updateParallax() {
            const section = heroParallax.closest('.om-hero');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = Math.max(0, Math.min(1, (vh * 0.5 - rect.top) / (vh * 0.8)));
            const y = (progress - 0.5) * 24;
            heroParallax.style.transform = `translateY(${y}px)`;
        }
        function onScroll() {
            if (rafId) return;
            rafId = requestAnimationFrame(() => { updateParallax(); rafId = null; });
        }
        updateParallax();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    }

    // Vision collage staggered fade-in
    const visionFigure = document.querySelector('.router-vision__figure--stagger');
    if (visionFigure && !prefersReducedMotion && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view'); });
        }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
        io.observe(visionFigure);
    } else if (visionFigure) {
        visionFigure.classList.add('in-view');
    }

    // Strategic Outcome – slide up Setup Guide when section reaches view
    const outcomeReveal = document.getElementById('router-setup-guide-reveal');
    if (outcomeReveal && !prefersReducedMotion && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-revealed'); });
        }, { rootMargin: '0px 0px -100px 0px', threshold: 0.2 });
        io.observe(outcomeReveal);
    } else if (outcomeReveal) {
        outcomeReveal.classList.add('is-revealed');
    }

    // Scroll-based parallax for context + phase 1 cards (Vercel-style useTransform)
    const parallaxWrappers = document.querySelectorAll('.router-parallax-wrap');
    if (parallaxWrappers.length && !prefersReducedMotion) {
        const ranges = [[100, -100], [150, -150], [80, -80], [120, -120]];
        let rafId = null;
        function updateCardParallax() {
            const scrollY = window.scrollY;
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
            parallaxWrappers.forEach((wrap, i) => {
                const [start, end] = ranges[i % ranges.length];
                const y = start + (end - start) * progress;
                wrap.style.transform = `translateY(${y}px)`;
            });
        }
        function onParallaxScroll() {
            if (rafId) return;
            rafId = requestAnimationFrame(() => { updateCardParallax(); rafId = null; });
        }
        updateCardParallax();
        window.addEventListener('scroll', onParallaxScroll, { passive: true });
        window.addEventListener('resize', onParallaxScroll);
    }
}

// About page - Hero image entrance
if (document.body.classList.contains('about-page')) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => document.body.classList.add('hero-loaded'));
    });
}

// About page - Philosophy scroll-triggered opacity reveal (Framer Motion-style)
// Offset ["start 0.9", "start 0.3"]: progress 0 when element top at 90% viewport, progress 1 at 30%
// Opacity maps from 0.15 to 1 over scroll progress
const philosophyReveal = document.getElementById('philosophy-reveal');
const philosophyTarget = document.getElementById('philosophy-scroll-target');
if (philosophyReveal && philosophyTarget) {
    const text = "Language is the bridge between technology and people.";
    const parts = text.split(' ');
    const line1 = parts.slice(0, 5).join(' ');
    const line2 = parts.slice(5).join(' ');

    function wrapChars(str) {
        return Array.from(str).map(c => {
            const span = document.createElement('span');
            span.className = 'philosophy-char';
            span.textContent = c;
            span.style.opacity = '0.15';
            return span;
        });
    }

    philosophyReveal.innerHTML = '';
    wrapChars(line1 + ' ').forEach(s => philosophyReveal.appendChild(s));
    philosophyReveal.appendChild(document.createElement('br'));
    wrapChars(line2).forEach(s => philosophyReveal.appendChild(s));

    const chars = philosophyReveal.querySelectorAll('.philosophy-char');
    const stagger = 0.018;
    const windowSize = 0.1;

    const prefReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefReduce) {
        chars.forEach(c => c.style.opacity = '1');
    } else {
        let rafId = null;
        function updatePhilosophyOpacity() {
            const rect = philosophyTarget.getBoundingClientRect();
            const vh = window.innerHeight;
            // start 0.9 -> start 0.3: progress 0 when top at 0.9*vh, progress 1 when top at 0.3*vh
            // useScroll offset ["start 0.9", "start 0.3"]: progress 0 at 90% viewport, 1 at 30%
            const progress = Math.max(0, Math.min(1, (1.0 * vh - rect.top) / (1.0 * vh)));
            // useTransform(scrollYProgress, [0, 1], [0.15, 1])
            chars.forEach((char, i) => {
                const charProgress = Math.max(0, Math.min(1, (progress - i * stagger) / windowSize));
                const opacity = 0.15 + 0.85 * charProgress;
                char.style.opacity = String(opacity);
            });
        }
        function onScroll() {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                updatePhilosophyOpacity();
                rafId = null;
            });
        }
        updatePhilosophyOpacity();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    }
}

// Experience page - Intro scroll-based opacity
// Maps scroll progress [0, 0.3, 0.7, 1] to opacity [0.15, 1, 1, 0.15]
const expIntroSection = document.getElementById('exp-intro');
const expIntroText = document.getElementById('exp-intro-text');
if (expIntroSection && expIntroText) {
    const prefReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefReduce) {
        expIntroText.style.opacity = '1';
    } else {
        function mapProgressToOpacity(p) {
            if (p <= 0.3) return 0.15 + (0.85 * (p / 0.3));
            if (p <= 0.7) return 1;
            return 1 - (0.85 * ((p - 0.7) / 0.3));
        }
        let rafId = null;
        function updateExpIntroOpacity() {
            const rect = expIntroSection.getBoundingClientRect();
            const vh = window.innerHeight;
            const sh = rect.height;
            const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + sh)));
            expIntroText.style.opacity = String(mapProgressToOpacity(progress));
        }
        function onExpScroll() {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                updateExpIntroOpacity();
                rafId = null;
            });
        }
        updateExpIntroOpacity();
        window.addEventListener('scroll', onExpScroll, { passive: true });
        window.addEventListener('resize', onExpScroll);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Sticky nav: transparent at top, solid when scrolling
const siteHeader = document.querySelector('.site-header--sticky');
if (siteHeader) {
    const scrollThreshold = 60;
    function updateHeaderScroll() {
        if (window.scrollY > scrollThreshold) {
            siteHeader.classList.add('is-scrolled');
        } else {
            siteHeader.classList.remove('is-scrolled');
        }
    }
    updateHeaderScroll();
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
}

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Design Carousel functionality - Carousel 1
const carousel1Track = document.querySelector('.carousel-1-track');
const carousel1Prev = document.querySelector('.carousel-1-prev');
const carousel1Next = document.querySelector('.carousel-1-next');

if (carousel1Track && carousel1Prev && carousel1Next) {
    let currentSlide1 = 0;
    const slides1 = carousel1Track.querySelectorAll('.design-carousel-slide');
    const totalSlides1 = slides1.length;

    function updateCarousel1() {
        const translateX = -currentSlide1 * 100;
        carousel1Track.style.transform = `translateX(${translateX}%)`;
        
        // Update button states
        carousel1Prev.style.opacity = currentSlide1 === 0 ? '0.5' : '1';
        carousel1Prev.style.cursor = currentSlide1 === 0 ? 'not-allowed' : 'pointer';
        carousel1Next.style.opacity = currentSlide1 === totalSlides1 - 1 ? '0.5' : '1';
        carousel1Next.style.cursor = currentSlide1 === totalSlides1 - 1 ? 'not-allowed' : 'pointer';
    }

    carousel1Next.addEventListener('click', function() {
        if (currentSlide1 < totalSlides1 - 1) {
            currentSlide1++;
            updateCarousel1();
        }
    });

    carousel1Prev.addEventListener('click', function() {
        if (currentSlide1 > 0) {
            currentSlide1--;
            updateCarousel1();
        }
    });

    // Initialize carousel 1
    updateCarousel1();
}

// Design Carousel functionality - Carousel 2
const carousel2Track = document.querySelector('.carousel-2-track');
const carousel2Prev = document.querySelector('.carousel-2-prev');
const carousel2Next = document.querySelector('.carousel-2-next');

if (carousel2Track && carousel2Prev && carousel2Next) {
    let currentSlide2 = 0;
    const slides2 = carousel2Track.querySelectorAll('.design-carousel-slide');
    const totalSlides2 = slides2.length;

    function updateCarousel2() {
        const translateX = -currentSlide2 * 100;
        carousel2Track.style.transform = `translateX(${translateX}%)`;
        
        // Update button states
        carousel2Prev.style.opacity = currentSlide2 === 0 ? '0.5' : '1';
        carousel2Prev.style.cursor = currentSlide2 === 0 ? 'not-allowed' : 'pointer';
        carousel2Next.style.opacity = currentSlide2 === totalSlides2 - 1 ? '0.5' : '1';
        carousel2Next.style.cursor = currentSlide2 === totalSlides2 - 1 ? 'not-allowed' : 'pointer';
    }

    carousel2Next.addEventListener('click', function() {
        if (currentSlide2 < totalSlides2 - 1) {
            currentSlide2++;
            updateCarousel2();
        }
    });

    carousel2Prev.addEventListener('click', function() {
        if (currentSlide2 > 0) {
            currentSlide2--;
            updateCarousel2();
        }
    });

    // Initialize carousel 2
    updateCarousel2();
}

// MVP Designs Carousel functionality
const carouselMvpTrack = document.querySelector('.carousel-mvp-track');
const carouselMvpPrev = document.querySelector('.carousel-mvp-prev');
const carouselMvpNext = document.querySelector('.carousel-mvp-next');

if (carouselMvpTrack && carouselMvpPrev && carouselMvpNext) {
    let currentSlideMvp = 0;
    const slidesMvp = carouselMvpTrack.querySelectorAll('.design-carousel-slide');
    const totalSlidesMvp = slidesMvp.length;

    function updateCarouselMvp() {
        const translateX = -currentSlideMvp * 100;
        carouselMvpTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update button states
        carouselMvpPrev.style.opacity = currentSlideMvp === 0 ? '0.5' : '1';
        carouselMvpPrev.style.cursor = currentSlideMvp === 0 ? 'not-allowed' : 'pointer';
        carouselMvpNext.style.opacity = currentSlideMvp === totalSlidesMvp - 1 ? '0.5' : '1';
        carouselMvpNext.style.cursor = currentSlideMvp === totalSlidesMvp - 1 ? 'not-allowed' : 'pointer';
    }

    carouselMvpNext.addEventListener('click', function() {
        if (currentSlideMvp < totalSlidesMvp - 1) {
            currentSlideMvp++;
            updateCarouselMvp();
        }
    });

    carouselMvpPrev.addEventListener('click', function() {
        if (currentSlideMvp > 0) {
            currentSlideMvp--;
            updateCarouselMvp();
        }
    });

    // Initialize MVP carousel
    updateCarouselMvp();
}

// AI Item Library Carousel functionality
const carouselLibraryTrack = document.querySelector('.carousel-library-track');
const carouselLibraryPrev = document.querySelector('.carousel-library-prev');
const carouselLibraryNext = document.querySelector('.carousel-library-next');

if (carouselLibraryTrack && carouselLibraryPrev && carouselLibraryNext) {
    let currentSlideLibrary = 0;
    const slidesLibrary = carouselLibraryTrack.querySelectorAll('.design-carousel-slide');
    const totalSlidesLibrary = slidesLibrary.length;

    function updateCarouselLibrary() {
        const translateX = -currentSlideLibrary * 100;
        carouselLibraryTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update button states
        carouselLibraryPrev.style.opacity = currentSlideLibrary === 0 ? '0.5' : '1';
        carouselLibraryPrev.style.cursor = currentSlideLibrary === 0 ? 'not-allowed' : 'pointer';
        carouselLibraryNext.style.opacity = currentSlideLibrary === totalSlidesLibrary - 1 ? '0.5' : '1';
        carouselLibraryNext.style.cursor = currentSlideLibrary === totalSlidesLibrary - 1 ? 'not-allowed' : 'pointer';
    }

    carouselLibraryNext.addEventListener('click', function() {
        if (currentSlideLibrary < totalSlidesLibrary - 1) {
            currentSlideLibrary++;
            updateCarouselLibrary();
        }
    });

    carouselLibraryPrev.addEventListener('click', function() {
        if (currentSlideLibrary > 0) {
            currentSlideLibrary--;
            updateCarouselLibrary();
        }
    });

    // Initialize Library carousel
    updateCarouselLibrary();
}

// Add any interactive features here
// For example, work item click handlers, animations, etc.
