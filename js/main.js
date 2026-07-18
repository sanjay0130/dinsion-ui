// Dinson & Co. — ICM-style interactions

document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar-dinson');

  if (navbar) {
    const onScroll = function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Scroll animations
  const animatedSelectors = '.animate-on-scroll, .fade-up, .fade-left, .fade-right, .scale-in, .flip-in, .stagger-children';

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);

            // Trigger counters inside visible stats
            entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll(animatedSelectors).forEach(function (el) {
      if (!el.classList.contains('animate-on-scroll')) {
        el.classList.add('animate-on-scroll');
      }
      observer.observe(el);
    });

    // Stats bar counters
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
      observer.observe(statsBar);
      statsBar.querySelectorAll('[data-count]').forEach(function (el) {
        if (!el.dataset.observed) {
          el.dataset.observed = '1';
        }
      });
    }
  } else {
    document.querySelectorAll(animatedSelectors).forEach(function (el) {
      el.classList.add('visible');
    });
  }

  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';

    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '+';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-dinson .nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Card hover lift
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // Floating WhatsApp button (bottom-right)
  if (!document.querySelector('.whatsapp-float')) {
    var wa = document.createElement('a');
    wa.className = 'whatsapp-float';
    wa.href = 'https://wa.me/447775786123';
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.setAttribute('aria-label', 'Chat with us on WhatsApp');
    wa.innerHTML = '<i class="bi bi-whatsapp" aria-hidden="true"></i>';
    document.body.appendChild(wa);
  }
});
