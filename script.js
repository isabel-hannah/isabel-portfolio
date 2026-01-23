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
