/* eslint-disable no-console */
import Scrollbar from 'smooth-scrollbar';

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
const span1 = document.getElementById('close');
span1.addEventListener('click', () => {
  const video = document.getElementById('video');
  video.pause();
  video.currentTime = 0;
  window.parent.window.postMessage('vpi_deck', '*');
});
const isInIFrame = window.location !== window.parent.location;
if (isInIFrame === true) {
  const sec7iframe = document.getElementById('close2');
  sec7iframe.style.display = 'none';
  // console.log('iframe');
} else {
  // console.log('Noiframe');
  const sec7 = document.getElementById('close');
  sec7.style.display = 'none';
}
const sec7 = document.getElementById('close2');
sec7.addEventListener('click', () => {
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
