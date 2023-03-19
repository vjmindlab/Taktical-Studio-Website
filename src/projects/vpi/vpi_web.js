/* eslint-disable no-console */
import Scrollbar from 'smooth-scrollbar';
import { gsap, Flip } from 'gsap/all';

const scroller = document.querySelector('.scroller');
const scrollbar = Scrollbar.init(scroller, {
  damping: 0.1,
  delegateTo: document,
  alwaysShowTracks: false,
  continuousScrolling: 'auto',
});
const accordionHeaders = document.querySelectorAll('.accordion-header');
function toggleActiveAccordion(_event, header) {
  const activeAccordion = document.querySelector('.accordion.active');
  const clickedAccordion = header.parentElement;
  const accordionBody = header.nextElementSibling;
  if (activeAccordion && activeAccordion !== clickedAccordion) {
    activeAccordion.querySelector('.accordion-body').style.maxHeight = 0;
    activeAccordion.classList.remove('active');
  }
  clickedAccordion.classList.toggle('active');
  if (clickedAccordion.classList.contains('active')) {
    accordionBody.style.maxHeight = `${accordionBody.scrollHeight}px`;
  } else {
    accordionBody.style.maxHeight = 0;
  }
}
accordionHeaders.forEach((header) => {
  header.addEventListener('click', (event) => {
    toggleActiveAccordion(event, header);
  });
});
function resizeActiveAccordionBody() {
  const activeAccordionBody = document.querySelector(
    '.accordion.active .accordion-body'
  );
  if (activeAccordionBody) {
    activeAccordionBody.style.maxHeight = `${activeAccordionBody.scrollHeight}px`;
  }
}
window.addEventListener('resize', () => {
  resizeActiveAccordionBody();
});
window.onload = () => {
  const button = document.getElementById('open1');
  button.click();
};
gsap.registerPlugin(Flip);
const items1 = document.querySelectorAll('.flipimg img');
const item2 = document.querySelector('.underflip');
items1.forEach((item1) => {
  item1.addEventListener('click', () => {
    const state = Flip.getState(item1, { props: 'transform,left,zIndex' });
    const state2 = Flip.getState(item2);
    item1.classList.toggle('opened');
    item2.classList.toggle('blocked');
    Flip.from(state, {
      absolute: false,
      // absoluteOnLeave: true,
      duration: 1,
      zIndex: 10,
      scale: false,
      ease: 'power2.inOut',
    });
    Flip.from(state2, {
      absolute: true,
      duration: 0.5,
      simple: false,
      ease: 'power2.inOut',
      onEnter: (elements) =>
        gsap.fromTo(elements, { opacity: 0 }, { opacity: 1 }),
    });
  });
});
function calculateVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('orientationchange', calculateVh);
window.addEventListener('resize', calculateVh);
calculateVh();
scrollbar.addListener(({ offset }) => {
  document.documentElement.style.setProperty('--ofy', `${offset.y}px`);
});

function checkratio() {
  items1.forEach((item1) => {
    const sw = window.screen.width;
    const iw = item1.naturalWidth;
    const sh = window.innerHeight;
    const ih = item1.naturalHeight;
    if (sh > ih && sh < sw) {
      document.documentElement.style.setProperty(
        '--hhh',
        `calc(var(--vh) * 100)`
      );
      document.documentElement.style.setProperty('--www', `auto`);
      document.documentElement.style.setProperty('--mmm', `0`);
    } else if (sw > iw && sw < sh) {
      document.documentElement.style.setProperty('--hhh', `auto`);
      document.documentElement.style.setProperty('--www', `100vw`);
      document.documentElement.style.setProperty('--mmm', `50%`);
    }
  });
}
checkratio();
window.addEventListener('resize', checkratio);
const span1 = document.getElementById('close');
span1.addEventListener('click', () => {
  const video = document.getElementById('video');
  video.pause();
  video.currentTime = 0;
  window.parent.window.postMessage('vpi_web', '*');
});
const isInIFrame = window.location !== window.parent.location;
if (isInIFrame === true) {
  const sec9iframe = document.getElementById('close2');
  sec9iframe.style.display = 'none';
  // console.log('iframe');
} else {
  // console.log('Noiframe');
  const sec9 = document.getElementById('close');
  sec9.style.display = 'none';
}
const sec9 = document.getElementById('close2');
sec9.addEventListener('click', () => {
  window.location.href = 'https://takticalstudio.com';
});

function start() {
  const content = document.querySelectorAll('.lazy');
  for (let i = 0; i < content.length; i += 1) {
    if (scrollbar.isVisible(content[i]) === true) {
      // console.log('ya');
      content[i].src = content[i].dataset.src;
      content[i].classList.remove('lazy');
    }
    if (content[i] === 0) {
      scrollbar.removeListener(start);
      // console.log('it is 0');
    }
  }
}

scrollbar.addListener(start);
