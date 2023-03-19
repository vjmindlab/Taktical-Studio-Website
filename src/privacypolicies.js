import Scrollbar from 'smooth-scrollbar';

const scroller = document.querySelector('.scroller');
Scrollbar.init(scroller, {
  damping: 0.1,
  delegateTo: document,
  alwaysShowTracks: false,
  continuousScrolling: 'auto',
});
