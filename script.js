/**
 * CONFIGURATION VARIABLES
 */
const akkaName = "Akka";
const startDate = "1998-01-01"; // Format: YYYY-MM-DD. Change to the actual birth date.

/**
 * GLOBAL AUDIO & CURSOR
 */
const clickSound = document.getElementById('click-sound');
const playClickSound = () => {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Audio disabled by browser', e));
    }
};

// Custom cursor logic
const cursor = document.getElementById('cursor');
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;
let glowX = mouseX;
let glowY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const lerp = (start, end, factor) => start + (end - start) * factor;

function animateCursor() {
    cursorX = lerp(cursorX, mouseX, 0.2);
    cursorY = lerp(cursorY, mouseY, 0.2);
    glowX = lerp(glowX, mouseX, 0.1);
    glowY = lerp(glowY, mouseY, 0.1);

    cursor.style.transform = `translate(${cursorX - 6}px, ${cursorY - 6}px)`;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Global Click Particle Burst
window.addEventListener('click', (e) => {
    createClickBurst(e.clientX, e.clientY);
});

function createClickBurst(x, y) {
    const explosionParticles = 20;
    for (let i = 0; i < explosionParticles; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '❤️';
        particle.style.position = 'fixed';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.fontSize = `${Math.random() * 10 + 10}px`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 60 + 30;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 50;

        gsap.to(particle, {
            x: tx,
            y: ty,
            opacity: 0,
            rotation: Math.random() * 360,
            duration: 0.8 + Math.random() * 0.5,
            ease: "power2.out",
            onComplete: () => particle.remove()
        });
    }
}

/**
 * UTILS & INTERACTIVE ELEMENTS
 */
// Ripple Effect
document.querySelectorAll('.glass-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        playClickSound();
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
        ripple.style.left = `${e.clientX - rect.left - rect.width/2}px`;
        ripple.style.top = `${e.clientY - rect.top - rect.height/2}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Tilt Cards
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

/**
 * SECTIONS LOGIC
 */

// 1. Cinematic Intro & Typewriter
const introScreen = document.getElementById('cinematic-intro');
const introMsg = introScreen.querySelector('.intro-message');
const heroTypewriter = document.getElementById('hero-typewriter');

setTimeout(() => {
    gsap.to(introMsg, { opacity: 1, duration: 2, ease: "power2.inOut" });
    setTimeout(() => {
        gsap.to(introMsg, { opacity: 0, duration: 1.5 });
        gsap.to(introScreen, { opacity: 0, duration: 2, onComplete: () => {
            introScreen.style.display = 'none';
            typeWriter(`Happy Birthday ${akkaName} ❤️`, heroTypewriter, 100);
        }});
    }, 4000);
}, 500);

function typeWriter(text, element, speed) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('counter-section').scrollIntoView({ behavior: 'smooth' });
});

// 2. Live Time Counter (Disabled as per user request to show static stats)
// function updateCounter() { ... }

// 3. Photo Gallery Lightbox & Upload Logic
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const closeLb = document.querySelector('.close-modal');
const memoryUpload = document.getElementById('memory-upload');
const galleryGrid = document.getElementById('memory-gallery-grid');
const noPhotosMsg = document.getElementById('no-photos-msg');
const clearMemoriesBtn = document.getElementById('clear-memories-btn');

function openLightbox(src) {
    playClickSound();
    lbImg.src = src;
    lightbox.classList.add('active');
    gsap.fromTo(lbImg, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)"});
}

closeLb.addEventListener('click', () => {
    gsap.to(lbImg, {scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => {
        lightbox.classList.remove('active');
    }});
});

// Photo rendering function
function addPhotoToGrid(imgDataUrl) {
    if (noPhotosMsg) noPhotosMsg.style.display = 'none';
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'gallery-item interactive';
    itemDiv.setAttribute('data-src', imgDataUrl);
    
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'img-wrapper';
    
    const imgEl = document.createElement('img');
    imgEl.src = imgDataUrl;
    imgEl.alt = 'Memory';
    
    imgWrapper.appendChild(imgEl);
    itemDiv.appendChild(imgWrapper);
    
    itemDiv.addEventListener('click', () => {
        openLightbox(imgDataUrl);
    });
    
    if (galleryGrid) galleryGrid.appendChild(itemDiv);
    gsap.fromTo(itemDiv, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.5, ease: "power2.out"});
}

// ── IndexedDB Memory Storage ──────────────────────────────────────────────────
const DB_NAME = 'birthdayMemories';
const DB_STORE = 'photos';
let db = null;

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains(DB_STORE)) {
                database.createObjectStore(DB_STORE, { keyPath: 'id', autoIncrement: true });
            }
        };
        req.onsuccess = (e) => { db = e.target.result; resolve(db); };
        req.onerror = (e) => reject(e);
    });
}

function savePhotoDB(dataUrl) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.add({ data: dataUrl });
        req.onsuccess = () => resolve(req.result); // returns generated id
        req.onerror = (e) => reject(e);
    });
}

function getAllPhotosDB() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e);
    });
}

function clearAllPhotosDB() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e);
    });
}

// Image compression
function compressImage(dataUrl, callback) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxRes = 800;

        if (width > height) {
            if (width > maxRes) { height *= maxRes / width; width = maxRes; }
        } else {
            if (height > maxRes) { width *= maxRes / height; height = maxRes; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = dataUrl;
}

// Load saved photos on startup using IndexedDB
openDB().then(() => {
    return getAllPhotosDB();
}).then((photos) => {
    photos.forEach(photo => addPhotoToGrid(photo.data));
}).catch(e => console.warn("Failed to load memories from IndexedDB", e));

// Clear Memories
if (clearMemoriesBtn) {
    clearMemoriesBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to remove all saved photos?")) {
            clearAllPhotosDB().then(() => {
                if (galleryGrid) galleryGrid.innerHTML = '';
                if (noPhotosMsg) {
                    noPhotosMsg.style.display = 'block';
                    if (galleryGrid) galleryGrid.appendChild(noPhotosMsg);
                }
            }).catch(e => console.warn("Failed to clear memories", e));
        }
    });
}

// Dynamic Photo Upload
if (memoryUpload) {
    memoryUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgDataUrl = event.target.result;

                compressImage(imgDataUrl, (compressed) => {
                    addPhotoToGrid(compressed); // Show instantly
                    savePhotoDB(compressed).catch(err => {
                        console.warn("Failed to save photo to IndexedDB", err);
                        alert("Could not save photo permanently. It will disappear on refresh.");
                    });
                });
            };
            reader.readAsDataURL(file);
        });
    });
}

// 7. Cake Section
const cakeBody = document.querySelector('.cake-body');
const numCandles = 3;
let blownCandles = 0;

for (let i = 0; i < numCandles; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.style.left = `${(i+1) * 20 + i * 30}px`;
    const flame = document.createElement('div');
    flame.className = 'flame';
    candle.appendChild(flame);
    cakeBody.appendChild(candle);

    candle.addEventListener('click', () => {
        if (!flame.style.display || flame.style.display !== 'none') {
            playClickSound();
            flame.style.display = 'none';
            blownCandles++;
            
            // Smoke effect
            for(let s=0; s<5; s++) {
                const smoke = document.createElement('div');
                smoke.style.width = '10px'; smoke.style.height = '10px';
                smoke.style.background = 'rgba(255,255,255,0.5)';
                smoke.style.borderRadius = '50%';
                smoke.style.position = 'absolute';
                smoke.style.left = candle.style.left;
                smoke.style.top = '-40px';
                cakeBody.appendChild(smoke);
                gsap.to(smoke, {y: -50 - Math.random()*30, x: (Math.random()-0.5)*30, opacity: 0, duration: 1.5, onComplete: () => smoke.remove()});
            }

            if (blownCandles === numCandles) {
                document.getElementById('cake-msg').innerText = "Make a wish! ✨";
                createClickBurst(window.innerWidth/2, window.innerHeight/2);
            }
        }
    });
}

// 6. & 9. Surprise & Final Section
const surpriseBtn = document.getElementById('surprise-btn');
const surpriseOverlay = document.getElementById('surprise-overlay');
const closeSurprise = document.getElementById('close-surprise-btn');
const finalSection = document.getElementById('final-section');

let animationLoopIds = [];

surpriseBtn.addEventListener('click', () => {
    surpriseOverlay.style.display = 'flex';
    gsap.to(surpriseOverlay, {opacity: 1, duration: 0.5});
    startConfetti();
    
    // Also prepare final section
    setTimeout(() => {
        finalSection.style.display = 'flex';
        gsap.to(finalSection, {opacity: 1, duration: 2});
        startFireworks();
    }, 5000);
});

closeSurprise.addEventListener('click', () => {
    gsap.to(surpriseOverlay, {opacity: 0, duration: 0.5, onComplete: () => {
        surpriseOverlay.style.display = 'none';
    }});
});

// Scroll Reveal Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(entry.target, {opacity: 1, y: 0, duration: 1, ease: "power2.out"});
            if (entry.target.classList.contains('timeline-item')) {
                gsap.to(entry.target, {opacity: 1, x: 0, duration: 1, ease: "back.out(1.5)"});
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section, .msg-line, .pull-quote').forEach(el => observer.observe(el));
document.querySelectorAll('.timeline-item.left').forEach(el => {
    gsap.set(el, {x: -50, opacity: 0});
    observer.observe(el);
});
document.querySelectorAll('.timeline-item.right').forEach(el => {
    gsap.set(el, {x: 50, opacity: 0});
    observer.observe(el);
});

// Story Mode
let storyInterval;
let isPlayingStory = false;
const storyBtn = document.getElementById('play-story-btn');
const sections = document.querySelectorAll('.section');
let currentStorySection = 0;

storyBtn.addEventListener('click', () => {
    playClickSound();
    isPlayingStory = !isPlayingStory;
    if (isPlayingStory) {
        storyBtn.querySelector('.btn-text').innerText = "Stop Story";
        storyInterval = setInterval(() => {
            currentStorySection++;
            if (currentStorySection >= sections.length) {
                clearInterval(storyInterval);
                isPlayingStory = false;
                storyBtn.querySelector('.btn-text').innerText = "Play Story";
                return;
            }
            sections[currentStorySection].scrollIntoView({behavior: 'smooth', block: 'center'});
        }, 4000);
    } else {
        clearInterval(storyInterval);
        storyBtn.querySelector('.btn-text').innerText = "Play Story";
    }
});

/**
 * canvas CONFETTI (Surprise)
 */
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

    for(let i=0; i<150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: Math.random() * 3 + 2,
            vx: Math.random() * 2 - 1,
            rot: Math.random() * 360,
            rotSpeed: Math.random() * 2 - 1
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            p.rot += p.rotSpeed;
            if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
        });
        const id = requestAnimationFrame(render);
        animationLoopIds.push(id);
    }
    render();
}

/**
 * canvas FIREWORKS (Final)
 */
function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    
    function createExplosion(x, y) {
        const colors = ['#ff758c', '#7a28cb', '#ffd700', '#ffffff'];
        for(let i=0; i<60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    }

    function render() {
        ctx.fillStyle = 'rgba(10, 5, 16, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.05) {
            createExplosion(Math.random() * canvas.width, Math.random() * canvas.height * 0.6);
        }

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.life -= p.decay;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fill();
            ctx.globalAlpha = 1;
            if(p.life <= 0) particles.splice(i, 1);
        });

        const id = requestAnimationFrame(render);
        animationLoopIds.push(id);
    }
    render();
}


/**
 * THREE.JS SYSTEMS LOGIC
 */
function initThreeJS() {
    const container = document.getElementById('three-canvas-container');
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Three core groups
    const bgGroup = new THREE.Group();     // Stars, far background
    const midGroup = new THREE.Group();    // Particle morphing heart
    const fgGroup = new THREE.Group();     // Floating balloons/objects
    scene.add(bgGroup);
    scene.add(midGroup);
    scene.add(fgGroup);

    // 4. Depth Env (Stars)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) {
        starPos[i] = (Math.random() - 0.5) * 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.5, transparent: true, opacity: 0.3});
    const stars = new THREE.Points(starGeo, starMat);
    bgGroup.add(stars);

    // 1. & 2. Particle Heart System & Morphing
    const heartGeo = new THREE.BufferGeometry();
    const heartCount = 2000;
    const heartPositions = new Float32Array(heartCount * 3);
    const targetPositions = new Float32Array(heartCount * 3); // for morphing
    const colors = new Float32Array(heartCount * 3);
    
    const color1 = new THREE.Color(0xff758c);
    const color2 = new THREE.Color(0x7a28cb);

    for(let i=0; i<heartCount; i++) {
        // Heart Math Equation
        const t = Math.PI * 2 * Math.random();
        const r = Math.random() * 0.2 + 0.8; 
        const x = 16 * Math.pow(Math.sin(t), 3) * r;
        const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * r;
        const z = (Math.random() - 0.5) * 5;

        // Base state (Scatter)
        heartPositions[i*3] = (Math.random() - 0.5) * 100;
        heartPositions[i*3+1] = (Math.random() - 0.5) * 100;
        heartPositions[i*3+2] = (Math.random() - 0.5) * 100;

        // Target state (Heart)
        targetPositions[i*3] = x;
        targetPositions[i*3+1] = y;
        targetPositions[i*3+2] = z;

        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i*3] = mixedColor.r;
        colors[i*3+1] = mixedColor.g;
        colors[i*3+2] = mixedColor.b;
    }

    heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
    heartGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create a circular texture for particles
    const canvasP = document.createElement('canvas');
    canvasP.width = 16; canvasP.height = 16;
    const ctxP = canvasP.getContext('2d');
    ctxP.beginPath(); ctxP.arc(8, 8, 8, 0, Math.PI*2); ctxP.fillStyle = '#fff'; ctxP.fill();
    const texP = new THREE.CanvasTexture(canvasP);

    const heartMat = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        map: texP,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const particleHeart = new THREE.Points(heartGeo, heartMat);
    midGroup.add(particleHeart);

    // Trigger morph to heart
    let morphTime = 0;
    const morphDuration = 200; // frames
    function animateMorph() {
        if(morphTime < morphDuration) {
            const positions = heartGeo.attributes.position.array;
            for(let i=0; i<heartCount*3; i++) {
                positions[i] += (targetPositions[i] - positions[i]) * 0.02; 
            }
            heartGeo.attributes.position.needsUpdate = true;
            morphTime++;
        }
    }

    // 5. 3D Floating Objects (Simple Spheres simulating balloons)
    const floaters = [];
    const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({color: 0xffd700, wireframe: true, transparent:true, opacity:0.2});
    for(let i=0; i<15; i++) {
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set((Math.random()-0.5)*80, -50 - Math.random()*50, (Math.random()-0.5)*40);
        floaters.push({
            mesh: mesh,
            vy: Math.random() * 0.1 + 0.05,
            rx: Math.random() * 0.02,
            ry: Math.random() * 0.02
        });
        fgGroup.add(mesh);
    }

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    // Interactivity
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    window.addEventListener('mousemove', (e) => {
        targetParallaxX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetParallaxY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Scroll Camera Sync
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    let pulseTime = 0;

    function animate() {
        requestAnimationFrame(animate);

        // Morphing logic
        animateMorph();

        // 1. Heartbeat pulse
        pulseTime += 0.05;
        const scale = 1 + Math.sin(pulseTime) * 0.05;
        particleHeart.scale.set(scale, scale, scale);
        particleHeart.rotation.y += 0.005;

        // 3. Interactive parallax
        midGroup.rotation.x = lerp(midGroup.rotation.x, targetParallaxY * 0.2, 0.05);
        midGroup.rotation.y = lerp(midGroup.rotation.y, targetParallaxX * 0.2, 0.05);
        bgGroup.rotation.x = lerp(bgGroup.rotation.x, targetParallaxY * 0.05, 0.05);
        bgGroup.rotation.y = lerp(bgGroup.rotation.y, targetParallaxX * 0.05, 0.05);

        // 5. Floaters
        floaters.forEach(f => {
            f.mesh.position.y += f.vy;
            f.mesh.rotation.x += f.rx;
            f.mesh.rotation.y += f.ry;
            if(f.mesh.position.y > 50) f.mesh.position.y = -50;
        });

        // 6. Camera Movement synced to scroll
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
        
        // Depth shift zoom out slightly as we scroll down
        camera.position.z = 50 + scrollProgress * 15;
        camera.position.y = -scrollProgress * 20;

        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Init 3D
if (typeof THREE !== 'undefined') {
    initThreeJS();
} else {
    console.warn("Three.js not loaded. 3D features omitted.");
}

