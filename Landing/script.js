/* ===================================================
   STRATEGIC CONSULTANT — Interactions & Animations
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar Scroll ──
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');

    const navObserver = new IntersectionObserver(([entry]) => {
        navbar.classList.toggle('scrolled', !entry.isIntersecting);
    }, { threshold: 0.1 });

    navObserver.observe(hero);

    // ── Mobile Menu ──
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // ── Reveal on Scroll ──
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Stat Counter Animation ──
    const statsGrid = document.getElementById('statsGrid');
    let statsCounted = false;

    const statsObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !statsCounted) {
            statsCounted = true;
            const counters = statsGrid.querySelectorAll('.stat-value');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000;
                const startTime = performance.now();

                function easeOutQuart(t) {
                    return 1 - Math.pow(1 - t, 4);
                }

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = easeOutQuart(progress);
                    const current = Math.round(easedProgress * target);

                    counter.textContent = current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
            });
        }
    }, { threshold: 0.3 });

    if (statsGrid) statsObserver.observe(statsGrid);

    // ── Workflow Animation ──
    const workflowCanvas = document.getElementById('workflowCanvas');

    const workflowObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            // Animate connectors
            const connectors = workflowCanvas.querySelectorAll('.wf-connector');
            connectors.forEach(c => c.classList.add('visible'));

            // Animate nodes sequentially
            const nodes = workflowCanvas.querySelectorAll('.wf-node');
            nodes.forEach((node, index) => {
                setTimeout(() => {
                    node.classList.add('visible');
                }, 300 + index * 350);
            });

            workflowObserver.unobserve(entry.target);
        }
    }, { threshold: 0.4 });

    if (workflowCanvas) workflowObserver.observe(workflowCanvas);

    // ── Smooth Scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
