// ===== THREE.JS BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Data Nodes (Particles)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

camera.position.z = 5;

// Mouse Interaction for Background
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    // Subtle wave effect
    const positions = particlesMesh.geometry.attributes.position.array;
    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        positions[i3 + 1] += Math.sin(elapsedTime + x) * 0.002;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ===== HERO CARD 3D TILT =====
const heroCard = document.querySelector('.hero-card');
document.addEventListener('mousemove', (e) => {
    if(window.scrollY > window.innerHeight / 2) return;
    
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    gsap.to(heroCard, {
        rotationY: xAxis,
        rotationX: yAxis,
        ease: "power1.out",
        duration: 0.5
    });
});

// ===== SMOOTH SCROLL =====
document.getElementById('scroll-to-hub').addEventListener('click', () => {
    gsap.to(window, {duration: 1, scrollTo: "#hub", ease: "power2.inOut"});
});

// ===== PROJECT DETAILS DATA =====
const projectDetails = {
    1: {
        title: "Executive Overview",
        img: "images/Hospital 1.PNG",
        problem: "Hospital executives lacked a centralized, real-time view of overall facility performance, leading to delayed decision-making and fragmented strategies.",
        solution: [
            "Aggregated data from multiple departments into a unified Power BI dashboard.",
            "Created high-level KPI cards for total admissions, discharge rates, and overall revenue.",
            "Implemented role-level security (RLS) to ensure data privacy."
        ],
        statValue: "100%",
        statLabel: "Data Visibility"
    },
    2: {
        title: "Patient Demographics",
        img: "images/hoapital 2.PNG",
        problem: "Inability to effectively segment patient populations resulted in generalized care approaches and inefficient targeted community outreach.",
        solution: [
            "Built demographic segmentation models using Python and Pandas.",
            "Visualized age, gender, and geographical distribution via interactive maps.",
            "Enabled drill-down features to analyze specific demographic cohorts."
        ],
        statValue: "3x",
        statLabel: "Better Targeting"
    },
    3: {
        title: "Operational Efficiency",
        img: "images/hospital 3.PNG",
        problem: "High patient wait times and inconsistent bed turnover rates were degrading the quality of care and frustrating staff.",
        solution: [
            "Analyzed timestamp data via SQL CTEs to identify process bottlenecks.",
            "Designed a real-time 'Bed Availability' tracking matrix.",
            "Calculated average wait times per department using DAX."
        ],
        statValue: "25%",
        statLabel: "Wait Time Reduction"
    },
    4: {
        title: "Financial Metrics",
        img: "images/hosptal 4.PNG",
        problem: "Revenue cycles were opaque, making it difficult to track claims, billing efficiency, and departmental profitability.",
        solution: [
            "Integrated billing databases with Power BI using direct query.",
            "Developed waterfall charts to track revenue leakage and claim denials.",
            "Created forecasting models for next-quarter revenue."
        ],
        statValue: "15%",
        statLabel: "Revenue Increase"
    },
    5: {
        title: "Resource Allocation",
        img: "images/hospitl 5.PNG",
        problem: "Staffing shortages during peak hours and overstaffing during off-hours led to financial strain and staff burnout.",
        solution: [
            "Mapped historical admission volumes against staffing schedules.",
            "Built a predictive heat-map showing anticipated peak times.",
            "Optimized shift distributions based on data-driven recommendations."
        ],
        statValue: "20%",
        statLabel: "Cost Savings"
    },
    6: {
        title: "Quality of Care",
        img: "images/hospital 6.PNG",
        problem: "Patient satisfaction scores were difficult to correlate with specific treatments, staff, or facility conditions.",
        solution: [
            "Combined survey data with clinical outcomes using complex SQL joins.",
            "Used sentiment analysis on patient feedback via Python.",
            "Visualized correlation matrices to pinpoint areas needing immediate improvement."
        ],
        statValue: "4.8/5",
        statLabel: "Avg Satisfaction"
    }
};

// ===== MODAL LOGIC =====
const modal = document.getElementById('detail-modal');
const closeModalBtn = document.getElementById('close-modal');
const hubCards = document.querySelectorAll('.hub-card');

const dTitle = document.getElementById('detail-title');
const dImg = document.getElementById('detail-img');
const dProblem = document.getElementById('detail-problem');
const dSolution = document.getElementById('detail-solution');
const dStat = document.getElementById('detail-stat');
const dLabel = document.querySelector('.stat-label');

hubCards.forEach(card => {
    card.addEventListener('click', () => {
        const index = card.getAttribute('data-index');
        const data = projectDetails[index];
        
        // Populate Data
        dTitle.textContent = data.title;
        dImg.src = data.img;
        dProblem.textContent = data.problem;
        
        dSolution.innerHTML = '';
        data.solution.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            dSolution.appendChild(li);
        });
        
        dStat.textContent = data.statValue;
        dLabel.textContent = data.statLabel;
        
        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close on background click
modal.querySelector('.modal-bg').addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// ===== THEME TOGGLE LOGIC =====
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeBtn.querySelector('i');
        const isLight = document.body.classList.contains('light-theme');
        
        if (isLight) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeBtn.style.color = '#0f172a';
            themeBtn.style.borderColor = 'rgba(0,0,0,0.2)';
            // Change particle color for light mode
            material.color.setHex(0x0ea5e9);
            scene.fog.color.setHex(0xf8fafc);
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeBtn.style.color = 'white';
            themeBtn.style.borderColor = 'rgba(255,255,255,0.2)';
            // Revert particle color
            material.color.setHex(0x00f3ff);
            scene.fog.color.setHex(0x050505);
        }
    });
}
