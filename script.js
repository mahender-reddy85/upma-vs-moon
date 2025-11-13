// Typing effect
const elements = document.querySelectorAll(".typing-effect");
const word = "Upma";
let charIndex = 0;
let typing = true;

function typeEffect() {
    if (typing) {
        if (charIndex < word.length) {
            charIndex++;
            elements.forEach(el => el.textContent = word.substring(0, charIndex));
            setTimeout(typeEffect, 200);
        } else {
            typing = false;
            setTimeout(typeEffect, 2000);
        }
    } else {
        if (charIndex > 1) {
            charIndex--;
            elements.forEach(el => el.textContent = word.substring(0, charIndex));
            setTimeout(typeEffect, 100);
        } else {
            typing = true;
            setTimeout(typeEffect, 500);
        }
    }
}
requestAnimationFrame(typeEffect);


// Quality dropdown
const select = document.getElementById('qualitySelect');
const image = document.getElementById('qualityImage');
const qualityImages = {
    "144": "img/144p.png",
    "240": "img/240p.jpeg",
    "480": "img/480p.jpeg",
    "720": "img/720p.jpeg",
    "1080": "img/1080p.jpg"
};

select.addEventListener('change', () => {
    const quality = select.value;
    if (quality === "") {
        image.style.display = "none";
        image.src = "";
    } else {
        image.style.display = "block";
        image.src = qualityImages[quality];
        image.alt = `${quality} preview`;
        image.className = (quality === "1080") ? "large" : "small";
    }
});

// Active nav highlight
const sections = document.querySelectorAll(".container");
const navLinks = document.querySelectorAll(".nav-link");
let disableScrollActiveUpdate = false;

window.addEventListener("scroll", () => {
    if (disableScrollActiveUpdate) return;
    let current = "";
    sections.forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 100;
        const height = sec.offsetHeight;
        if (top >= offset && top < offset + height) {
            current = sec.getAttribute("id");
        }
    });
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// Add click event to nav links to update active class on tap/click
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        disableScrollActiveUpdate = true;
        navLinks.forEach(l => l.classList.remove("active"));
        e.currentTarget.classList.add("active");
        setTimeout(() => {
            disableScrollActiveUpdate = false;
        }, 1000);
    });
});

// Enhanced 3D Carousel positioning with dynamic effects
const slides = document.querySelectorAll(".slider img");
const totalSlides = slides.length;
const radius = 600; // Increased radius for better 3D effect

// Position images in 3D space with staggered animation
slides.forEach((img, i) => {
    const angle = (i * 360 / totalSlides);
    const translateZ = radius;

    // Set initial position
    img.style.transform = `rotateY(${angle}deg) translateZ(${translateZ}px)`;

    // Add custom properties for dynamic effects
    img.style.setProperty('--rotate-y', `${angle}deg`);
    img.style.setProperty('--index', i);
    img.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s ease, box-shadow 0.5s ease';

    // Add staggered animation delay
    img.style.animationDelay = `${i * 0.1}s`;

    // Add click handler for interactive experience
    img.addEventListener('click', () => {
        // Add pulse effect on click
        img.style.animation = 'pulse 0.6s ease';
        setTimeout(() => {
            img.style.animation = '';
        }, 600);
    });
});

// Add parallax effect on mouse move
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mousemove', (e) => {
    const rect = carousel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 5;
    const rotateY = ((x - centerX) / centerX) * 10;

    carousel.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

carousel.addEventListener('mouseleave', () => {
    carousel.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg)';
});

// Add dynamic lighting effect
function updateCarouselLighting() {
    const time = Date.now() * 0.001;
    slides.forEach((img, i) => {
        const pulse = Math.sin(time + i * 0.5) * 0.1 + 0.9;
        img.style.filter = `brightness(${pulse}) drop-shadow(0 0 ${pulse * 10}px rgba(255, 215, 0, ${pulse * 0.3}))`;
    });
    requestAnimationFrame(updateCarouselLighting);
}

// Start lighting animation
updateCarouselLighting();

/********* Heart animation (canvas) *********/
(function initHeart() {
    const canvas = document.getElementById("c");
    if (!canvas) return; // no canvas in DOM
    const ctx = canvas.getContext("2d");

    // size & resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const M = Math;
    const R = M.random;
    const Cos = M.cos;
    const Sin = M.sin;
    const TWO_PI = M.PI * 2;

    const W = () => canvas.width;
    const Ht = () => canvas.height;

    // heart path nodes
    const nodes = [];
    for (let t = 0; t < TWO_PI; t += 0.2) {
        nodes.push([
            W() / 2 + 180 * M.pow(Sin(t), 3),
            Ht() / 2 +
            10 *
            (-(15 * Cos(t) - 5 * Cos(2 * t) - 2 * Cos(3 * t) - Cos(4 * t))),
        ]);
    }

    const TRAIL_LEN = 32;      // particles per trail
    const NUM_TRAILS = 32;     // number of trails
    const trails = [];

    // create trails
    for (let i = 0; i < NUM_TRAILS; i++) {
        const startX = R() * W();
        const startY = R() * Ht();

        const hue = (i / NUM_TRAILS) * 80 + 280; // 280..360
        const sat = R() * 40 + 60;               // 60..100
        const light = R() * 80 + 60;             // 20..80

        const trail = [];
        for (let k = 0; k < TRAIL_LEN; k++) {
            trail[k] = {
                x: startX,
                y: startY,
                vx: 0,
                vy: 0,
                r: (1 - k / TRAIL_LEN) + 1,
                accel: R() + 1,
                node: ~~(R() * nodes.length),
                dir: i % 2 ? 1 : -1,
                fric: R() * 0.2 + 0.7,
                fill: `hsla(${hue % 360}, ${sat}%, ${light}%, 0.1)`,
            };
        }
        trails.push(trail);
    }

    function dot(p) {
        ctx.fillStyle = p.fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TWO_PI);
        ctx.closePath();
        ctx.fill();
    }

    function frame() {
        // translucent clear for trails
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.fillRect(0, 0, W(), Ht());

        for (let i = 0; i < NUM_TRAILS; i++) {
            const trail = trails[i];
            const head = trail[0];
            const target = nodes[head.node];

            // distance to target
            const dx = head.x - target[0];
            const dy = head.y - target[1];
            const dist = M.hypot(dx, dy) || 1; // avoid divide-by-zero

            // switch node when close
            if (dist < 10) {
                if (R() > 0.95) {
                    head.node = ~~(R() * nodes.length);
                } else {
                    if (R() > 0.99) head.dir *= -1;
                    head.node = (head.node + head.dir + nodes.length) % nodes.length;
                }
            }

            // accelerate toward target
            head.vx += (-dx / dist) * head.accel;
            head.vy += (-dy / dist) * head.accel;

            // integrate
            head.x += head.vx;
            head.y += head.vy;

            // draw head
            dot(head);

            // friction
            head.vx *= head.fric;
            head.vy *= head.fric;

            // follow chain (Zeno)
            for (let k = 1; k < TRAIL_LEN; k++) {
                const prev = trail[k - 1];
                const curr = trail[k];
                curr.x -= (curr.x - prev.x) * 0.7;
                curr.y -= (curr.y - prev.y) * 0.7;
                dot(curr);
            }
        }

        requestAnimationFrame(frame);
    }
    frame();
})();

// GSAP and Draggable required
// Make sure to include GSAP and Draggable scripts in your index.html:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Draggable.min.js"></script>
const cardsInner = document.querySelector('.cards_inner');
const cards = gsap.utils.toArray('.card');
const totalCards = cards.length;

function updateCardsRotation(x) {
    const center = window.innerWidth / 2;
    cards.forEach((card) => {
        const rect = card.getBoundingClientRect(); // live position
        const cardCenter = rect.left + rect.width / 2;
        const offset = (cardCenter - center) / center;
        const rotationY = offset * 45; // max 45deg rotation
        gsap.to(card, { rotationY, duration: 0.3, ease: "power3.out" });
    });
}

window.addEventListener("load", () => {
    const container = document.querySelector(".slider-container");
    const maxScroll = container.offsetWidth - cardsInner.scrollWidth;

    Draggable.create(cardsInner, {
        type: "x",
        edgeResistance: 0.65,
        bounds: { minX: maxScroll, maxX: 0 },
        inertia: true,
        onDrag() { updateCardsRotation(this.x); },
        onThrowUpdate() { updateCardsRotation(this.x); }
    });

    // initial rotation (after layout)
    updateCardsRotation(0);

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Slideshow for Upmi - Mahyu section
const slideshowImages = [
    'img/upma_mahi_1.jpg',
    'img/upma_mahi_2.jpg',
    'img/upma_mahi_3.jpg',
    'img/upma_mahi_4.jpg',
    'img/upma_mahi_5.jpg',
    'img/upma_mahi_6.jpg',
    'img/upma_mahi_7.jpg',
    'img/upma_mahi_8.jpg',
    'img/upma_mahi_9.jpg',
    'img/upma_mahi_10.jpg',
    'img/upma_mahi_11.jpg',
    'img/upma_mahi_12.jpg',
    'img/upma_mahi_13.jpg',
    'img/upma_mahi_14.jpg',
    'img/upma_mahi_15.jpg',
    'img/upma_mahi_16.jpg',
    'img/upma_mahi_17.jpg',
    'img/upma_mahi_18.jpg',
    'img/upma_mahi_19.jpg'
];
let currentIndex = 0;
const slideshowImg1 = document.getElementById('slideshow-img1');
const slideshowImg2 = document.getElementById('slideshow-img2');
const slideshowImg3 = document.getElementById('slideshow-img3');
const slideshowImg4 = document.getElementById('slideshow-img4');
const slideshowImg5 = document.getElementById('slideshow-img5');
const slideshowImg6 = document.getElementById('slideshow-img6');
const slideshowImg7 = document.getElementById('slideshow-img7');
const slideshowImg8 = document.getElementById('slideshow-img8');

function changeImage() {
    [slideshowImg1, slideshowImg2, slideshowImg3, slideshowImg4, slideshowImg5, slideshowImg6, slideshowImg7, slideshowImg8].forEach((img, i) => {
        img.style.opacity = 0;
        setTimeout(() => {
            const idx = (currentIndex + i) % slideshowImages.length;
            img.src = slideshowImages[idx];
            img.style.opacity = 1;
        }, 500); // Half of the transition time
    });
    currentIndex = (currentIndex + 8) % slideshowImages.length;
}

setInterval(changeImage, 3000); // Change images every 3 seconds

// Set initial active nav link to UPMA vs MOON and scroll to top
const navLinkElements = document.querySelectorAll(".nav-link");
navLinkElements.forEach(link => link.classList.remove("active"));
const initialLink = document.querySelector('a[href="#upmaVSmoon"]');
if (initialLink) {
    initialLink.classList.add("active");
}
window.scrollTo(0, 0);
});
