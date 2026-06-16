/* ===========================
   EcoTrack – Smart Carbon Footprint Analyzer
   Main Application JavaScript
   =========================== */

(function () {
    'use strict';

    // ===== Loader =====
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.classList.add('hidden');
            initApp();
        }, 1800);
    });

    // ===== App Initialization =====
    function initApp() {
        initParticles();
        initThemeToggle();
        initNavbar();
        initScrollReveal();
        initSmoothScrolling();
        initHeroCounters();
        initCharts();
        initCalculator();
        loadHistory();
        initFAB();
        initBackToTop();
        initTiltEffect();
    }

    // ===== Particle Background =====
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrameId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.4 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
                ctx.fill();
            }
        }

        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animFrameId = requestAnimationFrame(animate);
        }

        animate();
    }

    // ===== Theme Toggle =====
    function initThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        const icon = document.getElementById('themeIcon');
        const html = document.documentElement;

        const saved = localStorage.getItem('ecotrack-theme');
        if (saved) {
            html.setAttribute('data-theme', saved);
            icon.className = saved === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }

        toggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            icon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('ecotrack-theme', next);
            updateChartsTheme();
        });
    }

    // ===== Navbar =====
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const links = navLinks.querySelectorAll('.nav-link');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Active link detection
            const sections = document.querySelectorAll('section[id]');
            let currentId = '';
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom >= 200) {
                    currentId = section.id;
                }
            });

            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        });

        // Hamburger menu
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== Smooth Scrolling =====
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    }

    // ===== Scroll Reveal =====
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== Hero Counters =====
    function initHeroCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateHeroStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) observer.observe(statsSection);
    }

    function animateHeroStats() {
        const stats = document.querySelectorAll('.hero-stats .stat-number');
        stats.forEach(stat => {
            const target = parseFloat(stat.dataset.count);
            const isDecimal = target % 1 !== 0;
            animateValue(stat, 0, target, 2000, isDecimal);
        });
    }

    function animateValue(el, start, end, duration, decimal = false) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = start + (end - start) * eased;
            el.textContent = decimal ? current.toFixed(1) : Math.floor(current);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // ===== Tilt Effect =====
    function initTiltEffect() {
        if (window.matchMedia('(hover: hover)').matches) {
            document.querySelectorAll('[data-tilt]').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / centerY * -3;
                    const rotateY = (x - centerX) / centerX * 3;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                });
            });
        }
    }

    // ===== FAB =====
    function initFAB() {
        const fab = document.getElementById('fabBtn');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                fab.classList.add('visible');
            } else {
                fab.classList.remove('visible');
            }
        });

        fab.addEventListener('click', () => {
            const calculator = document.getElementById('calculator');
            const offsetTop = calculator.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        });
    }

    // ===== Back to Top =====
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Chart.js Initialization =====
    let pieChart, barChart, doughnutChart;

    const chartColors = {
        transport: { bg: 'rgba(59, 130, 246, 0.8)', border: '#3b82f6' },
        electricity: { bg: 'rgba(245, 158, 11, 0.8)', border: '#f59e0b' },
        water: { bg: 'rgba(6, 182, 212, 0.8)', border: '#06b6d4' },
        food: { bg: 'rgba(16, 185, 129, 0.8)', border: '#10b981' },
        waste: { bg: 'rgba(139, 92, 246, 0.8)', border: '#8b5cf6' }
    };

    function getChartTextColor() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? '#334155' : '#94a3b8';
    }

    function getChartGridColor() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    }

    function initCharts() {
        const defaultData = [0, 0, 0, 0, 0];
        const labels = ['Transport', 'Electricity', 'Water', 'Food', 'Waste'];
        const bgColors = [chartColors.transport.bg, chartColors.electricity.bg, chartColors.water.bg, chartColors.food.bg, chartColors.waste.bg];
        const borderColors = [chartColors.transport.border, chartColors.electricity.border, chartColors.water.border, chartColors.food.border, chartColors.waste.border];

        // Pie Chart
        pieChart = new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data: defaultData,
                    backgroundColor: bgColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: getChartTextColor(), padding: 16, font: { family: 'Inter', size: 12 } }
                    }
                },
                animation: { animateRotate: true, duration: 1500 }
            }
        });

        // Bar Chart
        barChart = new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'CO₂ Emission (kg/year)',
                    data: defaultData,
                    backgroundColor: bgColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: { color: getChartTextColor(), font: { family: 'Inter' } },
                        grid: { color: getChartGridColor() }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: getChartTextColor(), font: { family: 'Inter' } },
                        grid: { color: getChartGridColor() }
                    }
                },
                animation: { duration: 1500, easing: 'easeOutQuart' }
            }
        });

        // Doughnut Chart
        doughnutChart = new Chart(document.getElementById('doughnutChart'), {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: defaultData,
                    backgroundColor: bgColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    hoverOffset: 15,
                    cutout: '65%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: getChartTextColor(), padding: 16, font: { family: 'Inter', size: 12 } }
                    }
                },
                animation: { animateRotate: true, duration: 1800 }
            }
        });
    }

    function updateCharts(data) {
        const values = [data.transport, data.electricity, data.water, data.food, data.waste];

        pieChart.data.datasets[0].data = values;
        pieChart.update();

        barChart.data.datasets[0].data = values;
        barChart.update();

        doughnutChart.data.datasets[0].data = values;
        doughnutChart.update();
    }

    function updateChartsTheme() {
        const textColor = getChartTextColor();
        const gridColor = getChartGridColor();

        [pieChart, doughnutChart].forEach(chart => {
            if (chart) {
                chart.options.plugins.legend.labels.color = textColor;
                chart.update();
            }
        });

        if (barChart) {
            barChart.options.scales.x.ticks.color = textColor;
            barChart.options.scales.y.ticks.color = textColor;
            barChart.options.scales.x.grid.color = gridColor;
            barChart.options.scales.y.grid.color = gridColor;
            barChart.update();
        }
    }

    // ===== Carbon Calculator =====
    function initCalculator() {
        document.getElementById('calculateBtn').addEventListener('click', calculate);
        document.getElementById('resetBtn').addEventListener('click', resetCalculator);
    }

    function calculate() {
        // Gather inputs
        const carKm = parseFloat(document.getElementById('carKm').value) || 0;
        const publicTransport = parseFloat(document.getElementById('publicTransport').value) || 0;
        const flights = parseFloat(document.getElementById('flights').value) || 0;

        const electricityBill = parseFloat(document.getElementById('electricityBill').value) || 0;
        const renewablePercent = parseFloat(document.getElementById('renewablePercent').value) || 0;
        const applianceHours = parseFloat(document.getElementById('applianceHours').value) || 0;

        const showerMinutes = parseFloat(document.getElementById('showerMinutes').value) || 0;
        const laundryLoads = parseFloat(document.getElementById('laundryLoads').value) || 0;
        const waterBill = parseFloat(document.getElementById('waterBill').value) || 0;

        const dietType = document.getElementById('dietType').value;
        const localFood = parseFloat(document.getElementById('localFood').value) || 0;
        const foodWaste = parseFloat(document.getElementById('foodWaste').value) || 0;

        const trashBags = parseFloat(document.getElementById('trashBags').value) || 0;
        const recyclePercent = parseFloat(document.getElementById('recyclePercent').value) || 0;
        const compostPercent = parseFloat(document.getElementById('compostPercent').value) || 0;

        // === Calculate emissions (kg CO₂ / year) ===

        // Transport
        // Car: ~0.21 kg CO₂ per km
        const carEmission = carKm * 52 * 0.21;
        // Public transport: ~0.089 kg per km, avg 30km/hr
        const publicEmission = publicTransport * 52 * 30 * 0.089;
        // Flights: ~250 kg CO₂ per round-trip flight (avg short-haul)
        const flightEmission = flights * 250;
        const transportTotal = carEmission + publicEmission + flightEmission;

        // Electricity
        // $0.12/kWh avg price, ~0.42 kg CO₂ per kWh
        const kWhFromBill = electricityBill / 0.12;
        const renewableFactor = 1 - (renewablePercent / 100) * 0.9;
        const billEmission = kWhFromBill * 12 * 0.42 * renewableFactor;
        // Appliance usage extra: ~0.15 kWh per hour, 365 days
        const applianceEmission = applianceHours * 365 * 0.15 * 0.42 * renewableFactor;
        const electricityTotal = billEmission + applianceEmission;

        // Water
        // Shower: ~8 liters/min, ~0.0006 kg CO₂ per liter (heating + treatment)
        const showerEmission = showerMinutes * 365 * 8 * 0.0006;
        // Laundry: ~0.6 kg CO₂ per load
        const laundryEmission = laundryLoads * 52 * 0.6;
        // Water bill: rough estimate ~0.005 kg CO₂ per dollar
        const waterBillEmission = waterBill * 12 * 0.5;
        const waterTotal = showerEmission + laundryEmission + waterBillEmission;

        // Food
        const dietFactors = {
            'heavy-meat': 3300,
            'moderate-meat': 2500,
            'light-meat': 1900,
            'pescatarian': 1700,
            'vegetarian': 1500,
            'vegan': 1100
        };
        const dietEmission = dietFactors[dietType] || 2500;
        // Local food reduces transport emissions
        const localFactor = 1 - (localFood / 100) * 0.15;
        // Food waste: ~2.5 kg CO₂ per kg of food waste
        const wasteEmission = foodWaste * 52 * 2.5;
        const foodTotal = (dietEmission * localFactor) + wasteEmission;

        // Waste
        // Each bag: ~2.5 kg, ~1.2 kg CO₂ per kg waste
        const trashEmission = trashBags * 52 * 2.5 * 1.2;
        // Recycling reduces by ~0.6 per unit
        const recycleFactor = 1 - (recyclePercent / 100) * 0.6;
        // Composting reduces further
        const compostFactor = 1 - (compostPercent / 100) * 0.3;
        const wasteTotal = trashEmission * recycleFactor * compostFactor;

        const totalEmission = Math.round(transportTotal + electricityTotal + waterTotal + foodTotal + wasteTotal);

        // Eco Score (0–100, where 100 is best)
        // Average is ~8000 kg/year, excellent is <3000
        let ecoScore;
        if (totalEmission <= 0) {
            ecoScore = 100;
        } else if (totalEmission < 2000) {
            ecoScore = 95;
        } else if (totalEmission < 4000) {
            ecoScore = 85;
        } else if (totalEmission < 6000) {
            ecoScore = 70;
        } else if (totalEmission < 8000) {
            ecoScore = 55;
        } else if (totalEmission < 12000) {
            ecoScore = 35;
        } else if (totalEmission < 16000) {
            ecoScore = 20;
        } else {
            ecoScore = Math.max(5, 20 - Math.floor((totalEmission - 16000) / 2000));
        }

        // Sustainability Level
        let sustainabilityLevel, levelClass;
        if (ecoScore >= 80) {
            sustainabilityLevel = 'Excellent';
            levelClass = 'level-excellent';
        } else if (ecoScore >= 60) {
            sustainabilityLevel = 'Good';
            levelClass = 'level-good';
        } else if (ecoScore >= 40) {
            sustainabilityLevel = 'Moderate';
            levelClass = 'level-moderate';
        } else {
            sustainabilityLevel = 'Needs Improvement';
            levelClass = 'level-poor';
        }

        const emissionData = {
            transport: Math.round(transportTotal),
            electricity: Math.round(electricityTotal),
            water: Math.round(waterTotal),
            food: Math.round(foodTotal),
            waste: Math.round(wasteTotal),
            total: totalEmission,
            ecoScore,
            sustainabilityLevel,
            levelClass
        };

        // Update UI
        updateResults(emissionData);
        updateCharts(emissionData);
        generateRecommendations(emissionData);
        saveToHistory(emissionData);

        // Scroll to results
        setTimeout(() => {
            const results = document.getElementById('results');
            window.scrollTo({ top: results.offsetTop - 80, behavior: 'smooth' });
        }, 300);
    }

    function updateResults(data) {
        // Animate total emission counter
        const totalEl = document.getElementById('totalEmission');
        animateValue(totalEl, 0, data.total, 2000);

        // Comparison text
        const comparison = document.getElementById('comparisonText');
        const avgDiff = data.total - 8000;
        if (avgDiff > 0) {
            comparison.innerHTML = `<i class="fas fa-arrow-up" style="color: var(--accent-rose);"></i> ${Math.abs(avgDiff).toLocaleString()} kg above global average`;
        } else {
            comparison.innerHTML = `<i class="fas fa-arrow-down" style="color: var(--accent-green);"></i> ${Math.abs(avgDiff).toLocaleString()} kg below global average`;
        }

        // Eco Score circular progress
        const ecoScoreEl = document.getElementById('ecoScore');
        animateValue(ecoScoreEl, 0, data.ecoScore, 2000);

        const progressBar = document.getElementById('ecoScoreBar');
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (data.ecoScore / 100) * circumference;
        progressBar.style.strokeDasharray = circumference;

        // Create gradient for SVG
        const svg = progressBar.closest('svg');
        let defs = svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', 'progressGradient');
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '100%');

            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', '#10b981');

            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('stop-color', '#3b82f6');

            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            defs.appendChild(gradient);
            svg.insertBefore(defs, svg.firstChild);
        }

        progressBar.setAttribute('stroke', 'url(#progressGradient)');
        setTimeout(() => {
            progressBar.style.strokeDashoffset = offset;
        }, 300);

        // Eco Label
        const ecoLabel = document.getElementById('ecoLabel');
        ecoLabel.textContent = data.sustainabilityLevel;

        // Sustainability gauge
        const gaugeFill = document.getElementById('gaugeFill');
        setTimeout(() => {
            gaugeFill.style.width = data.ecoScore + '%';
        }, 300);

        const sustainabilityText = document.getElementById('sustainabilityLevel');
        sustainabilityText.textContent = data.sustainabilityLevel;

        // Breakdown bars
        const maxVal = Math.max(data.transport, data.electricity, data.water, data.food, data.waste, 1);

        setTimeout(() => {
            document.getElementById('transportFill').style.width = (data.transport / maxVal * 100) + '%';
            document.getElementById('electricityFill').style.width = (data.electricity / maxVal * 100) + '%';
            document.getElementById('waterFill').style.width = (data.water / maxVal * 100) + '%';
            document.getElementById('foodFill').style.width = (data.food / maxVal * 100) + '%';
            document.getElementById('wasteFill').style.width = (data.waste / maxVal * 100) + '%';
        }, 300);

        document.getElementById('transportValue').textContent = data.transport.toLocaleString() + ' kg CO₂';
        document.getElementById('electricityValue').textContent = data.electricity.toLocaleString() + ' kg CO₂';
        document.getElementById('waterValue').textContent = data.water.toLocaleString() + ' kg CO₂';
        document.getElementById('foodValue').textContent = data.food.toLocaleString() + ' kg CO₂';
        document.getElementById('wasteValue').textContent = data.waste.toLocaleString() + ' kg CO₂';
    }

    function resetCalculator() {
        document.querySelectorAll('.calc-card input[type="number"]').forEach(input => {
            input.value = 0;
        });
        document.getElementById('dietType').selectedIndex = 0;
    }

    // ===== Recommendations =====
    function generateRecommendations(data) {
        const grid = document.getElementById('recommendationsGrid');
        grid.innerHTML = '';

        const allRecommendations = [];

        // Transport recommendations
        if (data.transport > 1000) {
            allRecommendations.push({
                icon: 'fas fa-bicycle',
                color: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                title: 'Reduce Vehicle Usage',
                text: 'Consider carpooling, cycling, or using public transit. Your transport emissions are significant at ' + data.transport.toLocaleString() + ' kg CO₂/year.',
                impact: 'Could save up to ' + Math.round(data.transport * 0.4).toLocaleString() + ' kg CO₂'
            });
        }
        if (data.transport > 3000) {
            allRecommendations.push({
                icon: 'fas fa-train',
                color: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                title: 'Switch to Rail Travel',
                text: 'Replace short flights with train journeys. Trains produce up to 90% less CO₂ than flying for equivalent distances.',
                impact: 'Could save up to ' + Math.round(data.transport * 0.3).toLocaleString() + ' kg CO₂'
            });
        }

        // Electricity recommendations
        if (data.electricity > 1500) {
            allRecommendations.push({
                icon: 'fas fa-solar-panel',
                color: 'linear-gradient(135deg, #f59e0b, #f97316)',
                title: 'Save Electricity',
                text: 'Switch to LED bulbs, use smart power strips, and consider solar panels. Your electricity footprint is ' + data.electricity.toLocaleString() + ' kg CO₂/year.',
                impact: 'Could save up to ' + Math.round(data.electricity * 0.35).toLocaleString() + ' kg CO₂'
            });
        }
        if (data.electricity > 500) {
            allRecommendations.push({
                icon: 'fas fa-wind',
                color: 'linear-gradient(135deg, #06b6d4, #10b981)',
                title: 'Go Renewable',
                text: 'Consider switching to a green energy provider. Renewable energy can reduce your electricity carbon footprint by up to 90%.',
                impact: 'Could save up to ' + Math.round(data.electricity * 0.7).toLocaleString() + ' kg CO₂'
            });
        }

        // Water recommendations
        if (data.water > 200) {
            allRecommendations.push({
                icon: 'fas fa-tint-slash',
                color: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                title: 'Conserve Water',
                text: 'Take shorter showers, fix leaks, and use water-efficient appliances. Every liter saved reduces your footprint.',
                impact: 'Could save up to ' + Math.round(data.water * 0.3).toLocaleString() + ' kg CO₂'
            });
        }

        // Food recommendations
        if (data.food > 2000) {
            allRecommendations.push({
                icon: 'fas fa-carrot',
                color: 'linear-gradient(135deg, #10b981, #34d399)',
                title: 'Sustainable Food Choices',
                text: 'Reduce meat consumption and eat more plant-based meals. Consider going meat-free at least 2 days per week.',
                impact: 'Could save up to ' + Math.round(data.food * 0.25).toLocaleString() + ' kg CO₂'
            });
        }
        if (data.food > 1000) {
            allRecommendations.push({
                icon: 'fas fa-store',
                color: 'linear-gradient(135deg, #22c55e, #16a34a)',
                title: 'Buy Local & Seasonal',
                text: 'Locally sourced and seasonal food reduces transport emissions significantly. Visit farmers markets and local stores.',
                impact: 'Could save up to ' + Math.round(data.food * 0.15).toLocaleString() + ' kg CO₂'
            });
        }

        // Waste recommendations
        if (data.waste > 300) {
            allRecommendations.push({
                icon: 'fas fa-recycle',
                color: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                title: 'Waste Management Tips',
                text: 'Increase your recycling and composting rates. Reduce single-use plastics and choose products with minimal packaging.',
                impact: 'Could save up to ' + Math.round(data.waste * 0.45).toLocaleString() + ' kg CO₂'
            });
        }

        // Always add general tips
        allRecommendations.push({
            icon: 'fas fa-tree',
            color: 'linear-gradient(135deg, #059669, #10b981)',
            title: 'Plant Trees & Offset',
            text: 'A single tree absorbs ~22 kg of CO₂ per year. Consider planting trees or supporting reforestation projects to offset your remaining footprint.',
            impact: 'Each tree offsets ~22 kg CO₂/year'
        });

        allRecommendations.push({
            icon: 'fas fa-users',
            color: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            title: 'Spread Awareness',
            text: 'Share your results and encourage friends and family to calculate their carbon footprint. Collective action amplifies individual efforts.',
            impact: 'Multiplied impact through community'
        });

        // Render cards
        allRecommendations.forEach((rec, index) => {
            const card = document.createElement('div');
            card.className = 'rec-card scroll-reveal';
            card.style.animationDelay = (index * 0.1) + 's';
            card.innerHTML = `
                <div class="rec-card-icon" style="background: ${rec.color};">
                    <i class="${rec.icon}"></i>
                </div>
                <h4>${rec.title}</h4>
                <p>${rec.text}</p>
                <div class="rec-impact">
                    <i class="fas fa-leaf"></i>
                    ${rec.impact}
                </div>
            `;
            grid.appendChild(card);

            // Trigger reveal animation
            setTimeout(() => {
                card.classList.add('revealed');
            }, 100 + index * 100);
        });
    }

    // ===== History (Local Storage) =====
    function saveToHistory(data) {
        const history = JSON.parse(localStorage.getItem('ecotrack-history') || '[]');
        const entry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            ecoScore: data.ecoScore,
            totalEmission: data.total,
            level: data.sustainabilityLevel,
            levelClass: data.levelClass,
            breakdown: {
                transport: data.transport,
                electricity: data.electricity,
                water: data.water,
                food: data.food,
                waste: data.waste
            }
        };

        history.unshift(entry);
        // Keep last 50 entries
        if (history.length > 50) history.pop();

        localStorage.setItem('ecotrack-history', JSON.stringify(history));
        renderHistory();
    }

    function loadHistory() {
        renderHistory();
        document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('ecotrack-history') || '[]');
        const tbody = document.getElementById('historyBody');

        if (history.length === 0) {
            tbody.innerHTML = `
                <tr class="history-empty">
                    <td colspan="5">
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>No history yet. Calculate your carbon footprint to start tracking!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = history.map(entry => `
            <tr>
                <td>${entry.date} <span style="color: var(--text-muted); font-size: 0.8rem;">${entry.time}</span></td>
                <td><strong style="color: var(--accent-green);">${entry.ecoScore}</strong>/100</td>
                <td>${entry.totalEmission.toLocaleString()} kg CO₂</td>
                <td><span class="history-level ${entry.levelClass}">${entry.level}</span></td>
                <td>
                    <button class="history-delete-btn" onclick="deleteHistoryEntry(${entry.id})" aria-label="Delete entry">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            localStorage.removeItem('ecotrack-history');
            renderHistory();
        }
    }

    // Make delete function global
    window.deleteHistoryEntry = function (id) {
        let history = JSON.parse(localStorage.getItem('ecotrack-history') || '[]');
        history = history.filter(entry => entry.id !== id);
        localStorage.setItem('ecotrack-history', JSON.stringify(history));
        renderHistory();
    };

})();
