import jump from 'jump.js';
import 'styles';

document.querySelectorAll('a[href^="#"]')
  .forEach((link) => {
    link.addEventListener('click', (e) => {
      jump(document.querySelector(e.target.hash), {
        duration: 500,
      });
    });
  });

document.querySelector('.back-to-top')
  .addEventListener('click', () => {
    jump('body', { duration: 500 });
  });
