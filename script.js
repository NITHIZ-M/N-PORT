document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        const icon = menuToggle.querySelector('i');
        if(navLinks.classList.contains('nav-active')){
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('nav-active')){
                navLinks.classList.remove('nav-active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation using Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // 4. Active Nav Link on Scroll
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // 5. Contact Form Handler (FormSubmit.co Seamless AJAX integration)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusMsg = document.getElementById('form-status');
            statusMsg.style.color = 'var(--primary)';
            statusMsg.textContent = 'Sending message...';

            const formData = new FormData(contactForm);

            fetch("https://formsubmit.co/ajax/nithiyabaskarr@gmail.com", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.success || data.success === "true") {
                    statusMsg.style.color = '#10b981'; // Green success
                    statusMsg.textContent = 'Message sent successfully!';
                    contactForm.reset();
                } else {
                    statusMsg.style.color = '#ef4444'; // Red error
                    statusMsg.textContent = 'Something went wrong. Please try again.';
                }
                setTimeout(() => { statusMsg.textContent = ''; }, 4000);
            })
            .catch(error => {
                statusMsg.style.color = '#ef4444';
                statusMsg.textContent = 'Error connecting to server. Attempting fallback...';
                setTimeout(() => { 
                    contactForm.submit(); // fallback to standard submit
                }, 2000);
            });
        });
    }

    // 6. Robust Custom Mouse Cursor & Parallax Background (Linear Interpolation)
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const purpleBlob = document.querySelector('.blob-purple');
    const orangeBlob = document.querySelector('.blob-orange');

    // State Variables for Lerp
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    // Parallax background variables
    let scrollY = 0;
    let targetBlobX = 0, targetBlobY = 0;
    let currentBlobX = 0, currentBlobY = 0;

    const isDesktop = window.matchMedia("(hover: hover)").matches;

    if(isDesktop) {
        // Track the mouse coordinates instantly
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly snap the dot
            if(cursorDot) cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            
            // Calculate mouse proportion for background blobs mapped from -1 to 1
            targetBlobX = (mouseX / window.innerWidth) * 2 - 1;
            targetBlobY = (mouseY / window.innerHeight) * 2 - 1;
        });

        // Hover expansions
        const hoverables = document.querySelectorAll('a, button, input, textarea, .glass-panel, .menu-toggle');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    } else {
        if(cursorDot) cursorDot.style.display = 'none';
        if(cursorOutline) cursorOutline.style.display = 'none';
    }

    window.addEventListener('scroll', () => {
         scrollY = window.scrollY;
    });

    // Universal Fluid Loop for Parallax and Auto-Animation
    const animateBlobs = () => {
        const time = performance.now() * 0.001; // Time in seconds
        
        // Fluid organic floating math (Sine/Cosine Waves)
        const fluidX1 = Math.sin(time * 0.6) * 120;
        const fluidY1 = Math.cos(time * 0.4) * 100;
        
        const fluidX2 = Math.sin(time * 0.5 + 2) * -110;
        const fluidY2 = Math.cos(time * 0.7 + 1) * -90;

        if(isDesktop) {
            // Outline trailing (Lerp factor 0.15 for smooth drag)
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            if(cursorOutline) cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            
            // Smooth Blob Parallax
            currentBlobX += (targetBlobX - currentBlobX) * 0.05;
            currentBlobY += (targetBlobY - currentBlobY) * 0.05;
        }

        // Combine scroll physics with mouse physics and fluid automatic movement
        const bgOffsetY = scrollY * 0.2; 
        
        if(purpleBlob && orangeBlob) {
            purpleBlob.style.transform = `translate(${currentBlobX * 60 + fluidX1}px, ${currentBlobY * 60 - bgOffsetY + fluidY1}px) scale(${1 + Math.sin(time * 0.3) * 0.1})`;
            orangeBlob.style.transform = `translate(${currentBlobX * -80 + fluidX2}px, ${currentBlobY * -80 - bgOffsetY * 1.5 + fluidY2}px) scale(${1 + Math.cos(time * 0.4) * 0.15})`;
        }

        requestAnimationFrame(animateBlobs);
    };
    requestAnimationFrame(animateBlobs);

    // 7. Scroll Progress Bar
    const scrollBar = document.getElementById('scroll-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const MathPercentage = Math.max(0, Math.min(100, (scrollTop / scrollHeight) * 100));
        scrollBar.style.width = MathPercentage + '%';
    });

    // 8. Typing Effect
    const texts = ["Software Development Engineer.", "Data Analyst Intern.", "Full Stack Developer.", "AI & DS Student."];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;
    const typingElement = document.querySelector('.typing-text');

    function type() {
        if (!typingElement) return;

        if(count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if(isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        typingElement.textContent = letter;

        let typeSpeed = 100 - Math.random() * 50;

        if(isDeleting) {
            typeSpeed /= 2;
        }

        if(!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if(isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // 9. Robust 3D Tilt Effect on Glass Panels
    const panels = document.querySelectorAll('.glass-panel:not(.no-tilt)');
    if(window.matchMedia("(hover: hover)").matches) {
        panels.forEach(panel => {
            panel.addEventListener('mousemove', (e) => {
                const rect = panel.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                // Tilt intensity limits
                const degX = deltaY * -8; 
                const degY = deltaX * 8;
                
                panel.style.transform = `perspective(1000px) rotateX(${degX}deg) rotateY(${degY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Inject for CSS spotlight effect
                panel.style.setProperty('--mouse-x', `${x}px`);
                panel.style.setProperty('--mouse-y', `${y}px`);
            });
            
            panel.addEventListener('mouseleave', () => {
                panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // 10. Magnetic effect for buttons
    const magneticBtns = document.querySelectorAll('.btn:not([type="submit"])');
    if(window.matchMedia("(hover: hover)").matches) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', function(e) {
                const position = btn.getBoundingClientRect();
                const x = e.clientX - position.left - position.width / 2;
                const y = e.clientY - position.top - position.height / 2;
                
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            btn.addEventListener('mouseout', function() {
                btn.style.transform = '';
            });
        });
    }

    // 11. Project Filtering System (Optimized for robust lag-free expanding)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.classList.contains('active')) return;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            
            // Fade out all elements currently visible
            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(10px)';
            });

            // Wait specifically for the shrink transition, then swap Grid layout instantly and fade in seamlessly
            setTimeout(() => {
                projectCards.forEach(card => {
                    if(filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        void card.offsetWidth; // Force CSS reflow to ensure transition registers
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }, 300); // 300ms matches the quick visual exit perfectly
        });
    });

    // 12. Skill Bar Animation using Intersection Observer
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-width');
            } else {
                entry.target.style.width = '0%'; // Reset out of view for endless interaction
            }
        });
    }, { threshold: 0.5 });

    skillFills.forEach(fill => skillObserver.observe(fill));

    // 13. Experience Accordion Toggle
    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const details = btn.nextElementSibling;
            btn.classList.toggle('active');
            details.classList.toggle('open');
            
            if(details.classList.contains('open')) {
                btn.innerHTML = `Hide Responsibilities <i class="fas fa-chevron-up"></i>`;
            } else {
                btn.innerHTML = `View Responsibilities <i class="fas fa-chevron-down"></i>`;
            }
        });
    });

    // 14. Timeline Scroll Progress Interactive Bar
    const expTimeline = document.getElementById('exp-timeline');
    const timelineProgress = document.getElementById('timeline-progress');
    
    if(expTimeline && timelineProgress) {
        window.addEventListener('scroll', () => {
            // Get bounding box of the timeline relatively to screen
            const rect = expTimeline.getBoundingClientRect();
            // Start filling when the timeline's top meets the screen middle
            const windowCenter = window.innerHeight / 2;
            
            if (rect.top < windowCenter && rect.bottom > windowCenter) {
                // Calculate percentage based on how much past the center the timeline has scrolled
                const scrolledDistance = windowCenter - rect.top;
                const totalScrollable = rect.height;
                const percentage = Math.max(0, Math.min(100, (scrolledDistance / totalScrollable) * 100));
                
                timelineProgress.style.height = `${percentage}%`;
            } else if (rect.top >= windowCenter) {
                timelineProgress.style.height = '0%';
            } else if (rect.bottom <= windowCenter) {
                timelineProgress.style.height = '100%';
            }
        });
    }

    // 15. Responsive Grab-to-Scroll Horizontal Containers
    const sliders = document.querySelectorAll('.projects-grid');
    
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false; 
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // Connect new interactables to custom cursor
    const newHoverables = document.querySelectorAll('.filter-btn, .scroll-indicator, .expand-btn, .project-action, .hover-popup');
    if(window.matchMedia("(hover: hover)").matches) {
        newHoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }
});
