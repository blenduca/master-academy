// ──────────────────────────────────────────────────────
// Smooth scroll com offset da navbar
// ──────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        e.preventDefault();
        var target = document.querySelector(targetId);
        if (target) {
            var offset = document.getElementById('header-nav') ? document.getElementById('header-nav').offsetHeight : 80;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    });
});

// ──────────────────────────────────────────────────────
// Navbar: glassmorphism ao scroll
// ──────────────────────────────────────────────────────
var nav = document.getElementById('header-nav');
window.addEventListener('scroll', function() {
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, { passive: true });
