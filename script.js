/* ══════════════════════════════════════════════
   BEKANEWS — script.js
   ══════════════════════════════════════════════ */

'use strict';

/* ─── 1. NAVBAR SCROLL + ACTIVE LINKS ─── */
(function () {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActive();
  }, { passive: true });

  function updateActive() {
    const sections = ['home', 'movies', 'games', 'wc2026', 'about'];
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  updateActive();
})();


/* ─── 2. BURGER MENU ─── */
(function () {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('mainNav');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('mobile-open');
  });

  nav.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      nav.classList.remove('mobile-open');
    });
  });
})();


/* ─── 3. THEME TOGGLE ─── */
(function () {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;
  const key  = 'beka-theme';

  const saved = localStorage.getItem(key) || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(key, next);
  });
})();


/* ─── 4. SEARCH ─── */
(function () {
  const toggle  = document.getElementById('searchToggle');
  const input   = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const wrap    = document.getElementById('searchWrap');

  const articles = Array.from(document.querySelectorAll('[data-search]')).map(el => ({
    el,
    title: el.querySelector('h3')?.textContent || '',
    desc:  el.querySelector('p')?.textContent || '',
    keys:  el.dataset.search,
  }));

  toggle.addEventListener('click', () => {
    input.classList.toggle('open');
    if (input.classList.contains('open')) {
      input.focus();
    } else {
      input.value = '';
      hideResults();
    }
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { hideResults(); return; }

    const hits = articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q)  ||
      a.keys.toLowerCase().includes(q)
    );

    if (hits.length === 0) {
      results.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
    } else {
      results.innerHTML = hits.slice(0, 5).map(a =>
        `<div class="search-result-item" data-title="${a.title}">${highlight(a.title, q)}</div>`
      ).join('');
      results.querySelectorAll('.search-result-item').forEach((item, i) => {
        item.addEventListener('click', () => {
          hits[i].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          hits[i].el.style.outline = '2px solid var(--neon)';
          setTimeout(() => hits[i].el.style.outline = '', 2000);
          hideResults();
          input.classList.remove('open');
          input.value = '';
        });
      });
    }
    results.classList.add('visible');
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target) && !results.contains(e.target)) hideResults();
  });

  function hideResults() { results.classList.remove('visible'); results.innerHTML = ''; }

  function highlight(text, q) {
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    return text.replace(re, '<mark style="background:rgba(14,165,233,.3);color:inherit;border-radius:3px">$1</mark>');
  }
})();


/* ─── 5. SCROLL REVEAL ─── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 55);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => obs.observe(el));
})();


/* ─── 6. HERO COUNTERS ─── */
(function () {
  const targets = { cntMovies: 84, cntGames: 31, cntMatches: 104 };

  function animateCounter(el, target) {
    const dur = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      Object.entries(targets).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) animateCounter(el, val);
      });
      obs.disconnect();
    }
  }, { threshold: 0.5 });

  const hero = document.querySelector('.hero__stats');
  if (hero) obs.observe(hero);
})();


/* ─── 7. SMOOTH SCROLL FOR NAV LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 100;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});


/* ─── 8. MODAL ─── */
const MODALS = {
  jurassic: {
    title: 'Jurassic World: Rebirth',
    meta:  'Universal Pictures · Выход: 2 июля 2026',
    body: [
      'Новая глава легендарной франшизы о динозаврах. Scarlett Johansson возглавляет тайную экспедицию на остров, где динозавры пять лет эволюционировали без вмешательства человека.',
      'Режиссёр Гарет Эдвардс создаёт масштабное зрелище с акцентом на первобытный ужас и атмосферу оригинального фильма 1993 года.',
      'Бюджет фильма превышает 250 миллионов долларов. Уже вышедший трейлер набрал 180 млн просмотров за первые сутки.',
    ],
    tags: ['Universal', 'Блокбастер', '2026', 'Скарлетт Йоханссон'],
  },
  superman: {
    title: 'Superman (2025)',
    meta:  'Warner Bros. · DC Studios · В прокате с 11 июля 2025',
    body: [
      'Джеймс Ганн лично написал и срежиссировал перезапуск вселенной DC. Дэвид Корренсвет воплощает Кларка Кента — оптимистичного, человечного супергероя.',
      'Фильм фокусируется на личности Кларка, а не на экшене. Критики отметили освежающий подход после тёмного тона эпохи Зака Снайдера.',
      'Рейчел Броснахан в роли Лоис Лейн, Николас Хоулт — Лекс Лютор. Первый фильм новой «главы первой» DC Universe.',
    ],
    tags: ['Warner Bros.', 'DC', 'Супергерой', 'Джеймс Ганн'],
  },
  wicked: {
    title: 'Wicked: For Good',
    meta:  'Universal Pictures · Выход: 22 ноября 2025',
    body: [
      'Вторая и завершающая часть дилогии, основанной на бродвейском мюзикле «Злая». Ариана Гранде (Глинда) и Синтия Эриво (Эльфаба) возвращаются в Страну Оз.',
      'Первая часть собрала более 700 миллионов долларов мирового проката в 2024 году, установив рекорд для музыкальных фильмов.',
      'Режиссёр Джон М. Чу обещает грандиозный финал с новыми вариациями культовых песен и масштабными декорациями.',
    ],
    tags: ['Universal', 'Мюзикл', 'Ариана Гранде', 'Сиквел'],
  },
  harry: {
    title: 'Гарри Поттер: сериал HBO',
    meta:  'HBO Max / Warner Bros. · Дебют: 2026',
    body: [
      'Масштабная адаптация всех семи книг Дж. К. Роулинг. Каждая книга получит собственный сезон, что позволит детально передать все сюжетные линии.',
      'Кастинг проходил по всему миру. Главные роли исполнят новые, малоизвестные актёры — создатели делают ставку на максимальное попадание в образы.',
      'Шоураннер — Francesca Gardiner. Съёмки проходят в Великобритании на тех же локациях, что использовались для оригинальных фильмов.',
    ],
    tags: ['HBO', 'Warner Bros.', 'Сериал', '2026'],
  },
  mario: {
    title: 'The Super Mario Bros. Movie',
    meta:  'Illumination / Nintendo · Кассовые сборы: $1.36 млрд',
    body: [
      'Анимационный блокбастер 2023 года стал вторым по кассовым сборам анимационным фильмом в истории. Братья Марио попадают в Грибное королевство, чтобы спасти принцессу Пич.',
      'Чарли Дэй, Крис Прэтт и Джек Блэк озвучили главных персонажей. Визуальный стиль точно воспроизводит атмосферу игр Nintendo.',
      'Сиквел официально подтверждён. По слухам, во второй части появятся Донки Конг и новые локации из игровой вселенной.',
    ],
    tags: ['Nintendo', 'Illumination', 'Анимация', '$1.36 млрд', 'Сиквел'],
  },
  minecraft: {
    title: 'A Minecraft Movie',
    meta:  'Warner Bros. / Legendary · Апрель 2025',
    body: [
      'Первый полнометражный фильм по одной из самых продаваемых игр в истории. Джейк Блэк, Джейсон Момоа и Эмма Майерс попадают в мир кубов.',
      'Фильм совмещает живых актёров с компьютерным миром Minecraft. Вирусная реакция зрителей в кинотеатрах — «куриное Jockey!» — стала интернет-феноменом.',
      'Рекорды первого уик-энда в нескольких категориях. Microsoft и Warner Bros. уже обсуждают продолжение.',
    ],
    tags: ['Microsoft', 'Warner Bros.', 'Приключение', 'Рекорд'],
  },
  fnaf: {
    title: 'Five Nights at Freddy\'s',
    meta:  'Blumhouse / Universal · 2023 · $297 млн сборов',
    body: [
      'Культовая хоррор-игра Скотта Коутона получила экранизацию от Blumhouse. Джош Хатчерсон в роли охранника, вынужденного работать ночью в заброшенной пиццерии.',
      'Фильм окупился более чем в 10 раз при бюджете 20 миллионов долларов. Фанатская база игры обеспечила фильму мощный старт.',
      'Five Nights at Freddy\'s 2 официально подтверждён. Коутон лично написал сценарий сиквела с новыми персонажами и расширенным лором.',
    ],
    tags: ['Blumhouse', 'Universal', 'Хоррор', 'FNAF 2 подтверждён'],
  },
  future: {
    title: 'Будущие экранизации видеоигр',
    meta:  'В разработке · 2026–2027',
    body: [
      'BioShock (Netflix) — адаптация знаменитой RPG. Фрэнсис Лоуренс («Голодные игры») режиссирует. Фанаты годами ждали экранизацию Rapture.',
      'Mass Effect (Amazon) — сериал по культовой космической RPG. Amazon инвестирует в масштабную научно-фантастическую вселенную.',
      'God of War (Amazon) — сериал о Кратосе уже получил одобрение от Sony. По слухам, бюджет одного эпизода сопоставим с крупным фильмом.',
    ],
    tags: ['BioShock', 'Mass Effect', 'God of War', 'Netflix', 'Amazon'],
  },
};

function openModal(key) {
  const data = MODALS[key];
  if (!data) return;

  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <h2>${data.title}</h2>
    <p class="modal-meta">${data.meta}</p>
    ${data.body.map(p => `<p>${p}</p>`).join('')}
    <div class="modal-tags">${data.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}</div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* expose to inline onclick */
window.openModal = openModal;


/* ─── 9. TICKER PAUSE ON HOVER ─── */
(function () {
  const inner = document.getElementById('tickerInner');
  if (!inner) return;
  inner.parentElement.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
  inner.parentElement.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
})();
