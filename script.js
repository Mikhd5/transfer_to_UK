(() => {
  const preloader = document.getElementById('preloader');
  let loaderDismissed = false;
  const hideLoader = () => {
    if (loaderDismissed || !preloader) return;
    loaderDismissed = true;
    window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      window.setTimeout(() => preloader.remove(), 520);
    }, 180);
  };
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });
  window.setTimeout(hideLoader, 2200);

  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu?.classList.toggle('is-open', isOpen);
    mobileMenu?.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localToday;
  }

  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const fields = [
      'Доброго дня! Хочу залишити заявку на TRANSFER TO UK.',
      '',
      `Послуга: ${data.get('service')}`,
      `Звідки: ${data.get('from')}`,
      `Куди: ${data.get('to')}`,
      `Бажана дата: ${data.get('date') || 'Не вказана'}`,
      `Ім'я: ${data.get('name')}`,
      `Телефон: ${data.get('phone')}`,
      `Додаткова інформація: ${data.get('details') || 'Немає'}`
    ];
    const whatsappUrl = `https://wa.me/380988536842?text=${encodeURIComponent(fields.join('\n'))}`;
    status.textContent = 'Відкриваємо WhatsApp із підготовленою заявкою…';
    const opened = window.open(whatsappUrl, '_blank');
    if (opened) opened.opener = null;
    else window.location.href = whatsappUrl;
  });

  // Interactive parcel request: destination + parcel type are carried into WhatsApp.
  const parcelConfig = document.getElementById('parcelConfig');
  if (parcelConfig) {
    const destinations = [...parcelConfig.querySelectorAll('[data-destination]')];
    const types = [...parcelConfig.querySelectorAll('[data-kind]')];
    const parcelArt = document.getElementById('parcelArt');
    const visualDestination = document.getElementById('parcelVisualDestination');
    const parcelChoice = document.getElementById('parcelChoice');
    const parcelRouteLabel = document.getElementById('parcelRouteLabel');
    const parcelSubmit = document.getElementById('parcelSubmit');
    let selectedDestination = 'Лондон';
    let selectedKind = 'box';
    let selectedKindLabel = 'Коробка / посилка';

    const syncParcelSelection = () => {
      destinations.forEach(button => {
        const active = button.dataset.destination === selectedDestination;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      types.forEach(button => {
        const active = button.dataset.kind === selectedKind;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      if (parcelArt) parcelArt.dataset.kind = selectedKind;
      if (visualDestination) visualDestination.textContent = `TO ${selectedDestination}`.toLocaleUpperCase('uk-UA');
      if (parcelChoice) parcelChoice.textContent = `${selectedKindLabel} · ${selectedDestination}`;
      if (parcelRouteLabel) parcelRouteLabel.textContent = `Долина → ${selectedDestination}`;
    };

    destinations.forEach(button => button.addEventListener('click', () => {
      selectedDestination = button.dataset.destination;
      syncParcelSelection();
    }));
    types.forEach(button => button.addEventListener('click', () => {
      selectedKind = button.dataset.kind;
      selectedKindLabel = button.dataset.label;
      syncParcelSelection();
    }));
    parcelSubmit?.addEventListener('click', () => {
      const message = [
        'Доброго дня! Хочу уточнити відправлення посилки через TRANSFER TO UK.',
        '',
        'Місто відправлення: Долина.',
        'Відділення: Нова пошта №1.',
        `Місто прибуття: ${selectedDestination}.`,
        `Тип відправлення: ${selectedKindLabel}.`,
        '',
        'Підкажіть, будь ласка, чи можлива доставка, а також умови та вартість.'
      ].join('\\n');
      const url = `https://wa.me/380988536842?text=${encodeURIComponent(message)}`;
      const opened = window.open(url, '_blank');
      if (opened) opened.opener = null;
      else window.location.href = url;
    });
    syncParcelSelection();
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Some mobile browsers delay autoplay until the video receives an explicit play request.
  const video = document.querySelector('.hero__video');
  if (video) {
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && window.matchMedia('(max-width: 800px)').matches) tryPlay();
    });
  }
})();
