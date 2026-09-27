/* ===== 导航栏滚动效果 ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  const scrollY = window.scrollY;

  // 导航栏背景
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // 高亮当前导航链接
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===== 移动端导航 ===== */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

/* ===== 平滑滚动（已有 href） ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    const top = target.offsetTop - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===== 技能进度条动画 ===== */
const skillCards = document.querySelectorAll('.skill-card');

function animateSkillBars() {
  skillCards.forEach((card, index) => {
    const progress = card.querySelector('.skill-progress');
    const width = progress.dataset.width;
    const delay = parseInt(card.dataset.delay) || index * 100;

    setTimeout(() => {
      progress.style.width = width + '%';
      card.classList.add('visible');
    }, delay);
  });
}

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBars();
      skillsObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

/* ===== 项目卡片动画 ===== */
const projectCards = document.querySelectorAll('.project-card');

const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 120);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

projectCards.forEach(card => projectObserver.observe(card));

/* ===== 项目筛选 ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const allProjects = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    allProjects.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
        setTimeout(() => { card.classList.add('visible'); }, 50);
      } else {
        card.classList.remove('visible');
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ===== 统计数字动画 ===== */
const statNums = document.querySelectorAll('.stat-num');

function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // 缓动函数
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(num => statsObserver.observe(num));

/* ===== 联系表单 (API 提交) ===== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>发送中...</span>';
  btn.disabled = true;

  try {
    const formData = new FormData(this);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.code === 0) {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    } else {
      alert(data.message || '提交失败，请稍后重试');
    }
  } catch (err) {
    alert('网络异常，请稍后重试');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});

/* ===== 入场动画（页面加载时） ===== */
function revealOnScroll() {
  const elements = document.querySelectorAll('.section-label, .section-title');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
revealOnScroll();
