import jump from 'jump.js';
import 'styles';
import '../node_modules/waypoints/lib/noframework.waypoints';

function hideItem(item) {
  item.classList.add('reveal-item');
  item.classList.remove('reveal-item--visible');
}

function revealItem(item) {
  item.classList.add('reveal-item--visible');
}

function hide(items) {
  if (items.toString() === '[object NodeList]') {
    items.forEach((el) => { hideItem(el); });
  } else {
    hideItem(items);
  }
}

function reveal(items, delay) {
  if (items.toString() === '[object NodeList]') {
    items.forEach((el, i) => {
      if (delay) {
        setTimeout(() => { revealItem(el); }, i * delay);
      } else {
        revealItem(el);
      }
    });
  } else {
    revealItem(items);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.querySelector('.back-to-top');
  const cards = document.querySelectorAll('.card');
  const hero = document.querySelectorAll('.hero__description h1, .slogan, .hero__description .btn-cta, .hero__bot, #about .page__title');

  // hide them on page load
  hide(backToTop);
  hide(cards);
  hide(hero);

  setTimeout(() => { reveal(hero, 300); }, 750);

  // eslint-disable-next-line no-new, no-undef
  new Waypoint({
    element: document.getElementById('about'),
    handler: (direction) => {
      if (direction === 'down') {
        reveal(backToTop);
      } else if (direction === 'up') {
        hide(backToTop);
      }
    },
  });

  // eslint-disable-next-line no-new, no-undef
  new Waypoint({
    element: document.getElementById('features'),
    offset: '50%',
    handler: function handle() {
      reveal(cards, 300);
      this.destroy();
    },
  });

  document.querySelectorAll('a[href^="#"]')
    .forEach((link) => {
      link.addEventListener('click', (e) => {
        jump(document.querySelector(e.target.hash), { duration: 500 });
      });
    });

  document.querySelector('.back-to-top')
    .addEventListener('click', function onClick() {
      this.blur();
      jump('body', { duration: 500 });
    });
});
