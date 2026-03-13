document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Animation (IntersectionObserver) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));


    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- Dynamic Projects Loader ---
    const loadProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const projects = await res.json();
            const container = document.getElementById('projects-container');

            if (!container) return;

            if (projects.length === 0) {
                container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; opacity:0.7;">No projects yet.</p>';
                return;
            }

            container.innerHTML = projects.map((p, index) => `
                <a href="${p.link}" target="_blank" style="text-decoration: none; color: inherit;">
                    <div class="glass-panel project-card fade-in-up" style="transition-delay: ${index * 0.1}s">
                        ${p.image ? `<img src="${p.image}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;" alt="${p.title}">` : ''}
                        <h3>${p.title}</h3>
                        <p>${p.description}</p>
                        <div class="project-tags">
                            ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>
                </a>
            `).join('');

            // Re-observe new elements
            document.querySelectorAll('.project-card.fade-in-up').forEach(el => observer.observe(el));
        } catch (error) {
            console.error("Failed to load projects:", error);
        }
    };

    // --- Dynamic Experience Loader ---
    const loadExperience = async () => {
        try {
            const res = await fetch('/api/experience');
            const jobs = await res.json();
            const container = document.getElementById('experience-container');

            if (!container) return;

            if (jobs.length === 0) {
                container.innerHTML = '<p style="text-align:center; opacity:0.7;">No experience listed yet.</p>';
                return;
            }

            container.innerHTML = jobs.map((j, index) => `
                <div class="glass-panel fade-in-up" style="padding: 32px; text-align: left; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; transition-delay: ${index * 0.1}s">
                    <div>
                        <h3 style="font-size: 1.5rem; color: var(--accent);">${j.role}</h3>
                        <p style="font-weight: 600;">${j.company}</p>
                    </div>
                    <span style="opacity: 0.7; font-weight: 600;">${j.period}</span>
                </div>
            `).join('');

            // Re-observe new elements
            document.querySelectorAll('#experience-container .fade-in-up').forEach(el => observer.observe(el));
        } catch (error) {
            console.error("Failed to load experience:", error);
        }
    };

    // --- Contact Form Handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Sending...";

            const data = {
                name: document.getElementById('cName').value,
                email: document.getElementById('cEmail').value,
                message: document.getElementById('cMessage').value
            };

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    btn.innerText = "Message Sent!";
                    contactForm.reset();
                } else {
                    btn.innerText = "Error! Try Again";
                }
            } catch (err) {
                console.error("Contact error:", err);
                btn.innerText = "Error! Try Again";
            }

            setTimeout(() => btn.innerText = originalText, 3000);
        });
    }

    // --- 3D Tilt Effect for Hero Card ---
    const card = document.getElementById('tilt-card');
    const heroCardContainer = document.querySelector('.hero-card-container');

    if (card && heroCardContainer) {
        heroCardContainer.addEventListener('mousemove', (e) => {
            const rect = heroCardContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position relative to center
            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;

            // Rotate limits (degrees)
            const rotateX = yPct * -20; // Invert Y for X tilt
            const rotateY = xPct * 20;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset on mouse leave
        heroCardContainer.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize data
    loadProjects();
    loadExperience();

});
