import {
  MeshNormalMaterial,
  EquirectangularReflectionMapping,
  PCFShadowMap,
  sRGBEncoding,
  ACESFilmicToneMapping,
  LoadingManager,
  Clock,
  Group,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  AnimationMixer,
  PlaneGeometry,
  ShadowMaterial,
  Mesh,
  DirectionalLight,
} from 'three';
import { gsap, ScrollTrigger, TextPlugin, Flip } from 'gsap/all';
import Scrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import Typewriter from 'typewriter-effect/dist/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import tippy from 'tippy.js';

gsap.registerPlugin(ScrollTrigger, TextPlugin, Flip);
class DisableScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'disableScroll';

  static defaultOptions = {
    direction: '',
  };

  transformDelta(delta) {
    if (this.options.direction) {
      delta[this.options.direction] = 0;
    }

    return { ...delta };
  }
}
const pinoverlay = document.getElementById('pin-overlay');
const header = document.getElementById('header');
const containerload = document.getElementById('container-load');
const scrollind = document.querySelector('.scrollenv');
const scroller = document.querySelector('.scroller');
Scrollbar.use(DisableScrollPlugin);
const bodyScrollBar = Scrollbar.init(scroller, {
  damping: 0.1,
  delegateTo: document,
  alwaysShowTracks: false,
  renderByPixels: true,
  continuousScrolling: 'auto',
  plugins: {
    disableScroll: {
      direction: 'x',
    },
  },
});

ScrollTrigger.scrollerProxy('.scroller', {
  scrollTop(value) {
    if (arguments.length) {
      bodyScrollBar.scrollTop = value;
    }
    return bodyScrollBar.scrollTop;
  },
});
bodyScrollBar.addListener(ScrollTrigger.update);
ScrollTrigger.defaults({ scroller });
bodyScrollBar.track.xAxis.element.remove();
let model1;
const manager = new LoadingManager();
const scrollbarthumb = document.querySelector('.scrollbar-thumb-y');
scrollbarthumb.setAttribute('data-cursor', 'hover');

manager.onLoad = function load() {
  pinoverlay.style.opacity = 1;
  header.style.opacity = 1;
  scrollind.style.opacity = 1;
  containerload.style.opacity = 0;
  gsap.fromTo(
    model1.position,
    { x: -0.04, y: 0, z: 0 },
    {
      duration: 2,
      x: 0,
      y: 0.2,
      z: 0,
      ease: 'power1.in',
    }
  );
  gsap.fromTo(
    model1.rotation,
    { x: 2, y: 6, z: 0 },
    {
      duration: 2,
      x: 0,
      y: 0,
      z: 0,
      ease: 'power1.in',
    }
  );
  gsap.fromTo(
    model1.scale,
    { x: 0, y: 0, z: 0 },
    {
      duration: 2,
      x: 0.05,
      y: 0.05,
      z: 0.05,
      ease: 'power1.in',
    }
  );
  gsap.fromTo(
    '.scrollenv',
    { scale: 0 },
    {
      duration: 1,
      scale: 1,
      ease: 'power1.in',
      onComplete() {
        containerload.style.display = 'none';
      },
    }
  );
};
manager.onError = function err() {};
let isPlay = false;
let isPlay2 = true;
let cube;
let cylinder;
let torus;
let ico;
let cone;
let directionalLight;
let camera;
let camera2;
let scene;
let scene2;
let renderer;
let renderer2;
let team;
let bob;
let mixer;
let clock;
const maxDPR = 1.2;
const dpr = Math.min(maxDPR, window.devicePixelRatio);
let mouseX = 0;
let mouseY = 0;
let mouseX2 = 0;
let mouseY2 = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const main = new Group();
const conea = new Group();
const icoa = new Group();
const cubea = new Group();
const torusa = new Group();
const cylindera = new Group();
const objects = [];
function init() {
  clock = new Clock();
  bob = document.getElementById('bob');
  renderer = new WebGLRenderer({
    canvas: bob,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.physicallyCorrectLights = false;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMappingExposure = 0.8;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.powerPreference = 'high-performance';
  renderer.setClearColor(0x000000, 0);
  team = document.getElementById('team');
  renderer2 = new WebGLRenderer({
    canvas: team,
    antialias: true,
    alpha: true,
  });
  renderer2.setPixelRatio(dpr);
  // renderer2.setSize(window.innerWidth, window.innerHeight);
  renderer2.physicallyCorrectLights = false;
  renderer2.powerPreference = 'high-performance';
  renderer2.setClearColor(0x000000, 0);
  camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    10
  );
  camera.position.z = 1;
  camera2 = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    10
  );
  camera2.position.z = 1;
  new RGBELoader(manager)
    .setPath('./static/')
    .load('neutral.hdr', (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      scene.environment = texture;
    });
  scene = new Scene();
  scene2 = new Scene();
  const loader = new GLTFLoader(manager).setPath('./static/');
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./static/draco/gltf/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  loader.setDRACOLoader(dracoLoader);
  loader.load('bob.glb', (gltf) => {
    model1 = gltf.scene;
    model1.scale.set(0.05, 0.05, 0.05);
    mixer = new AnimationMixer(model1);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
    model1.position.set(0, 0.2, 0);
    model1.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        main.position.set(0, 0, 0);
        main.add(model1);
        scene.add(main);
      }
    });
  });
  loader.load('geo.glb', (gltf) => {
    cone = gltf.scene.getObjectByName('cone');
    cone.scale.set(0.15, 0.15, 0.15);
    ico = gltf.scene.getObjectByName('ico');
    ico.scale.set(0.11, 0.11, 0.11);
    ico.position.set(0, 0, 0.2);
    cube = gltf.scene.getObjectByName('cube');
    cube.scale.set(0.16, 0.16, 0.16);
    cube.position.set(0, 0, -0.4);
    torus = gltf.scene.getObjectByName('torus');
    torus.scale.set(0.17, 0.17, 0.17);
    torus.position.set(0, 0, -0.6);
    cylinder = gltf.scene.getObjectByName('cylinder');
    cylinder.scale.set(0.09, 0.09, 0.09);
    cylinder.position.set(0, 0, 0.3);
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshNormalMaterial();
      }
    });
    icoa.add(ico);
    conea.add(cone);
    cubea.add(cube);
    torusa.add(torus);
    cylindera.add(cylinder);
    objects.push(cube, torus, cylinder, cone, ico);
    scene2.add(cylindera, torusa, cubea, icoa, conea);
  });
  dracoLoader.dispose();
  const geometry = new PlaneGeometry(500, 500);
  const material = new ShadowMaterial();
  material.opacity = 0.2;
  const plane = new Mesh(geometry, material);
  plane.position.z = -0.3;
  plane.receiveShadow = true;
  scene.add(plane);
  directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 0.1, 0.8);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.left = -0.3;
  directionalLight.shadow.camera.right = 0.3;
  directionalLight.shadow.camera.top = -0.3;
  directionalLight.shadow.camera.bottom = 0.3;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 1.6;
  directionalLight.shadow.bias = -0.01;
  scene.add(directionalLight);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  // ScrollTrigger.refresh();
  // bodyScrollBar.update();
}
window.addEventListener('resize', onWindowResize);
window.addEventListener('orientationchange', onWindowResize);
function onWindowResize2() {
  camera2.aspect = window.innerWidth / window.innerHeight;
  camera2.updateProjectionMatrix();
  renderer2.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove(event) {
  if (isPlay2 === true) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
  } else if (isPlay === true) {
    mouseX2 = (event.clientX - windowHalfX) / 1500;
    mouseY2 = (event.clientY - windowHalfY) / 1500;
  }
}
document.addEventListener('mousemove', onDocumentMouseMove);
function render() {
  if (isPlay2 === true) {
    renderer.render(scene, camera);
  } else if (isPlay === true) {
    renderer2.render(scene2, camera2);
    onWindowResize2();
  }
}
function animate() {
  requestAnimationFrame(animate);
  if (isPlay2 === true) {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    const timer = 0.0001 * Date.now();
    main.position.x = 0.01 * Math.cos(timer * Math.exp(1));
    main.position.y = 0.01 * Math.sin(timer * Math.exp(2));
    main.rotation.z = 0.03 * Math.sin(timer * Math.exp(1));
    main.rotation.x += (mouseY - main.rotation.x) * 0.005;
    main.rotation.y += (mouseX - main.rotation.y) * 0.005;
    render();
  } else if (isPlay === true) {
    const timer = 0.0001 * Date.now();
    for (let i = 0, il = objects.length; i < il; i += 1) {
      const object = objects[i];
      object.position.x = 0.5 * Math.cos(timer + i * 10);
      object.position.y = 0.25 * Math.sin(timer + i * 15);
      object.rotation.y = 6 * Math.sin(timer + i * 10);
      object.rotation.x = 6 * Math.sin(timer + i * 10);
    }
    camera2.position.x += (mouseX2 - camera2.position.x) * 0.05;
    camera2.position.y += (-mouseY2 - camera2.position.y) * 0.05;
    camera2.lookAt(scene2.position);
    render();
  }
}
init();
animate();
tippy('#headerlogo', {
  touch: false,
  theme: 'material',
  animation: 'scale',
  placement: 'bottom',
  content: 'EMAIL US FOR MORE INFO',
});
tippy(document.querySelectorAll('.down'), {
  touch: false,
  showOnCreate: false,
  theme: 'material',
  animation: 'scale',
  placement: 'right',
  content: 'CLICK TO TOGGLE MENU LOCK',
});
tippy(document.querySelectorAll('.scrolltop'), {
  touch: false,
  showOnCreate: false,
  theme: 'material',
  animation: 'scale',
  placement: 'left',
  content: 'SCROLL TO THE TOP',
});
const dot = document.querySelectorAll('.dots');
const quoteText = document.querySelectorAll('.quote h1');
const studiotext = document.querySelectorAll('.studiotext1');
const studiotext2 = document.querySelectorAll('.studiotext2');
const studiobox = document.querySelectorAll('.box');
const studioinfo = document.querySelectorAll('.b1');
const studioswitch = document.querySelectorAll('.switch');
const teamtext = document.querySelectorAll('.teamtext1');
const teamtext2 = document.querySelectorAll('.teamtext2');
const teambox = document.querySelectorAll('.teambox');
const teaminfo = document.querySelectorAll('.b2');
const teamswitch = document.querySelectorAll('.switch2');
const servicestext = document.querySelectorAll('.servicestext1');
const servicestext2 = document.querySelectorAll('.servicestext2');
const servicesbox = document.querySelectorAll('.servicesbox');
const servicesinfo = document.querySelectorAll('.b3');
const servicesswitch = document.querySelectorAll('.switch3');
const projectstext = document.querySelectorAll('.projectstext1');
const projectstext2 = document.querySelectorAll('.projectstext2');
const pmenu = document.querySelector('.pmenu');
const scrolltop = document.querySelector('.scrolltop');
const all = document.querySelectorAll('.all');
gsap.to('#pin-overlay', {
  duration: 2,
  scale: 90,
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: '#container',
    start: 'top top',
    end: '200%',
    anticipatePin: true,
    pin: true,
    scrub: true,
  },
});
gsap.set(scrolltop, { scale: 0, opacity: 0 });
gsap.to(scrolltop, {
  duration: 2,
  scale: 1,
  opacity: 1,
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: '.scroller',
    start: 'top top',
    end: '30%',
    pin: false,
    scrub: true,
  },
});
gsap.to('.scrollenv', {
  duration: 2,
  scale: 0,
  opacity: 0,
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: '.scroller',
    start: 'top top',
    end: '30%',
    pin: false,
    scrub: true,
  },
});
gsap.fromTo(
  quoteText,
  { y: 0, autoAlpha: 0, scale: 0 },
  {
    duration: 3,
    scale: 1,
    y: 100,
    autoAlpha: 1,
    stagger: { amount: 1 },
    ease: 'expo.inOut',
    scrollTrigger: {
      trigger: '.scroller',
      start: 'center top',
      end: '200%',
      scrub: true,
    },
  }
);
gsap.to(camera.position, {
  duration: 3,
  z: 1022.65,
  ease: 'power4.inOut',
  scrollTrigger: {
    trigger: '.scroller',
    start: 'top+=70% top',
    end: '300%',
    scrub: true,
    onEnter() {
      gsap.to(main.rotation, {
        duration: 1,
        y: 0.3,
        ease: 'power2.out',
      });
      gsap.to(main.rotation, {
        duration: 1,
        x: 0,
        ease: 'power2.out',
      });
    },
    onLeave() {
      isPlay = true;
      isPlay2 = false;
    },
    onEnterBack() {
      isPlay = false;
      isPlay2 = true;
    },
  },
});
const tl1 = gsap.timeline({
  scrollTrigger: {
    trigger: '.scroller',
    start: 'bottom+=600 top',
    end: '200%',
    scrub: true,
  },
});
tl1.fromTo(
  dot,
  { y: 0, scale: 0, autoAlpha: 0 },
  {
    duration: 10,
    y: 100,
    scale: 1,
    autoAlpha: 1,
    stagger: { amount: 35 },
    ease: 'power2.inOut',
  }
);
const tlstudio = gsap.timeline({
  scrollTrigger: {
    trigger: '.studio',
    start: 'top center',
    end: 'top center',
    scrub: false,
  },
});
tlstudio
  .addLabel('start')
  .fromTo(
    studiotext,
    { scale: 0, opacity: 0 },
    {
      duration: 0.5,
      opacity: 1,
      scale: 1,
      ease: 'power2.inOut',
    }
  )
  .fromTo(
    studiotext2,
    { opacity: 0, y: -100 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.inOut',
    },
    '-=0.3'
  )
  .fromTo(
    studiobox,
    { opacity: 0, y: -100 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      stagger: { amount: 0.5 },
      ease: 'power1.inOut',
    },
    '-=0.5'
  )
  .fromTo(
    studioinfo,
    { opacity: 0, y: -50 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
    },
    '-=0.5'
  )
  .fromTo(
    studioswitch,
    { opacity: 0, y: -20 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
    },
    '-=0.5'
  );
const targets1 = document.querySelector('.switch');
const info1 = document.querySelectorAll('.in1');
const info11 = document.querySelectorAll('.inf1');
const bu1 = document.querySelectorAll('.b1span');
const tlinf1 = gsap.timeline({
  paused: true,
});
tlinf1.to(bu1, {
  duration: 1,
  text: { value: 'CLOSE', delimiter: '' },
  ease: 'none',
});
tlinf1
  .fromTo(
    info1,
    { height: 0, padding: 0 },
    { height: 'auto', padding: 1 },
    '-=0.5'
  )
  .reversed(true);
tlinf1.fromTo(info11, { opacity: 0 }, { opacity: 1 }).reversed(true);
function openinfo1() {
  tlinf1.reversed(!tlinf1.reversed());
  tlinf1.resume();
}
targets1.addEventListener('click', openinfo1);
const tlteam = gsap.timeline({
  scrollTrigger: {
    trigger: '.team',
    start: 'top center',
    end: 'top center',
    scrub: false,
  },
});
ScrollTrigger.create({
  trigger: '.team',
  start: 'top+=800 center',
  end: 'top+=950 center',
  scrub: false,
  toggleActions: 'play pause resume reset',
  onEnter() {
    const button = document.getElementById('switch1');
    if (button.classList.contains('switch-active')) {
      button.click();
    }
  },
});
tlteam
  .fromTo(
    teamtext,
    { scale: 0, opacity: 0 },
    {
      duration: 0.5,
      opacity: 1,
      scale: 1,
      ease: 'power2.inOut',
    }
  )
  .fromTo(
    teamtext2,
    { opacity: 0, y: -100 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.inOut',
    },
    '-=0.3'
  )
  .fromTo(
    teambox,
    { opacity: 0, scale: 0 },
    {
      duration: 0.5,
      opacity: 1,
      scale: 1,
      stagger: { amount: 0.5 },
      ease: 'power1.inOut',
    },
    '-=0.5'
  )
  .fromTo(
    teaminfo,
    { opacity: 0, y: -50 },
    {
      duration: 1,
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
    },
    '-=0.5'
  )
  .fromTo(
    teamswitch,
    { opacity: 0, y: -20 },
    {
      duration: 1,
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
    },
    '-=1.2'
  )
  .fromTo(
    cubea.scale,
    { x: 0, y: 0, z: 0 },
    {
      duration: 0.5,
      x: 1,
      y: 1,
      z: 1,
      ease: 'bounce',
    },
    '-=1.5'
  )
  .fromTo(
    torusa.scale,
    { x: 0, y: 0, z: 0 },
    {
      duration: 0.5,
      x: 1,
      y: 1,
      z: 1,
      ease: 'bounce',
    },
    '-=1.2'
  )
  .fromTo(
    cylindera.scale,
    { x: 0, y: 0, z: 0 },
    {
      duration: 0.5,
      x: 1,
      y: 1,
      z: 1,
      ease: 'bounce',
    },
    '-=0.9'
  )
  .fromTo(
    conea.scale,
    { x: 0, y: 0, z: 0 },
    {
      duration: 0.5,
      x: 1,
      y: 1,
      z: 1,
      ease: 'bounce',
    },
    '-=0.6'
  )
  .fromTo(
    icoa.scale,
    { x: 0, y: 0, z: 0 },
    {
      duration: 0.5,
      x: 1,
      y: 1,
      z: 1,
      ease: 'bounce',
    },
    '-=0.3'
  );
const targets2 = document.querySelector('.switch2');
const info2 = document.querySelectorAll('.in2');
const info22 = document.querySelectorAll('.inf2');
const bu2 = document.querySelectorAll('.b2span');
const tlinf2 = gsap.timeline({ paused: true, onComplete() {} });
tlinf2.to(bu2, {
  duration: 1,
  text: { value: 'CLOSE', delimiter: '' },
  ease: 'none',
});
tlinf2
  .fromTo(
    info2,
    { height: 0, padding: 0 },
    { height: 'auto', padding: 1 },
    '-=0.5'
  )
  .reversed(true);
tlinf2.fromTo(info22, { opacity: 0 }, { opacity: 1 }).reversed(true);
function openinfo2() {
  tlinf2.reversed(!tlinf2.reversed());
  tlinf2.resume();
}
targets2.addEventListener('click', openinfo2);
const tlservices = gsap.timeline({
  scrollTrigger: {
    trigger: '.services',
    start: 'top center',
    end: 'top center',
    scrub: false,
  },
});
tlservices
  .fromTo(
    servicestext,
    { scale: 0, opacity: 0 },
    {
      duration: 0.5,
      opacity: 1,
      scale: 1,
      ease: 'power2.inOut',
    }
  )
  .fromTo(
    servicestext2,
    { opacity: 0, y: -100 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.inOut',
    },
    '-=0.5'
  )
  .fromTo(
    servicesbox,
    { opacity: 0, y: -100 },
    {
      duration: 1,
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
    },
    '-=0.3'
  )
  .fromTo(
    servicesinfo,
    { opacity: 0, y: -50 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
    },
    '-=0.3'
  )
  .fromTo(
    servicesswitch,
    { opacity: 0, y: -20 },
    {
      duration: 1,
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
    },
    '-=1.2'
  );
const targets3 = document.querySelector('.switch3');
const info3 = document.querySelector('.in3');
const info33 = document.querySelector('.inf3');
const bu3 = document.querySelector('.b3span');
const tlinf3 = gsap.timeline({ paused: true, onComplete() {} });
tlinf3.to(bu3, {
  duration: 1,
  text: { value: 'CLOSE', delimiter: '' },
  ease: 'none',
});
tlinf3
  .fromTo(
    info3,
    { height: 0, padding: 0 },
    { height: 'auto', padding: 1 },
    '-=0.5'
  )
  .reversed(true);
tlinf3.fromTo(info33, { opacity: 0 }, { opacity: 1 }).reversed(true);
function openinfo3() {
  tlinf3.reversed(!tlinf3.reversed());
  tlinf3.resume();
}
targets3.addEventListener('click', openinfo3);
const tlprojects = gsap.timeline({
  scrollTrigger: {
    trigger: '.projects',
    start: 'top center',
    end: 'top center',
    scrub: false,
  },
});
tlprojects
  .fromTo(
    projectstext,
    { scale: 0, opacity: 0 },
    {
      duration: 0.5,
      opacity: 1,
      scale: 1,
      ease: 'power2.inOut',
    }
  )
  .fromTo(
    projectstext2,
    { opacity: 0, y: -100 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.inOut',
    },
    '-=0.3'
  )
  .fromTo(
    pmenu,
    { opacity: 0, y: -100 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.inOut',
    },
    '-=0.3'
  )
  .fromTo(
    all,
    { opacity: 0, y: -100 },
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      stagger: { amount: 0.8 },
      ease: 'power1.inOut',
    },
    '-=0.3'
  );
gsap.fromTo(
  projectstext,
  {},
  {
    duration: 3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.studio',
      start: 'bottom top',
      pinSpacing: false,
      end: 'max+=5000',
      scrub: true,
      anticipatePin: true,
      pin: '#team',
    },
  }
);
if (window.matchMedia && window.matchMedia('(any-pointer: fine)').matches) {
  const ball = document.querySelector('.dot');
  const cursor = document.querySelector('.cursor');
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouse = { x: pos.x, y: pos.y };
  const speed = 0.2;
  gsap.set([ball, cursor], { xPercent: -50, yPercent: -50 });
  const xSet = gsap.quickSetter([ball, cursor], 'x', 'px');
  const ySet = gsap.quickSetter([ball, cursor], 'y', 'px');
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  gsap.ticker.add(() => {
    const dt = 1.0 - (1.0 - speed) ** gsap.ticker.deltaRatio();
    pos.x += (mouse.x - pos.x) * dt;
    pos.y += (mouse.y - pos.y) * dt;
    xSet(pos.x);
    ySet(pos.y);
  });
  document.body.addEventListener('mouseenter', () => {
    gsap.to('.cursor', {
      scale: 1,
      duration: 0.1,
      opacity: 0.6,
      ease: 'bounce',
    });
    gsap.to('.dot', {
      scale: 1,
      opacity: 1,
      overwrite: 'auto',
      ease: 'bounce',
    });
  });
  document.body.addEventListener('mouseleave', () => {
    gsap.to('.cursor', {
      scale: 0,
      duration: 0.1,
      opacity: 0,
      ease: 'bounce',
    });
    gsap.to('.dot', {
      scale: 0,
      opacity: 0,
      overwrite: 'auto',
      ease: 'bounce',
    });
  });
  document.body.addEventListener('mouseup', () => {
    gsap.to('.cursor', {
      scale: 1,
      duration: 0.4,
      ease: 'bounce',
    });
  });
  document.body.addEventListener('mousedown', () => {
    gsap.to('.cursor', {
      scale: 2,
      duration: 0.4,
      ease: 'bounce',
    });
  });
  const hoverCursors = document.querySelectorAll('[data-cursor="hover"]');
  hoverCursors.forEach((cursor) => {
    cursor.addEventListener('mouseenter', () => {
      gsap.to('.cursor', {
        opacity: 0.5,
        border: 'solid 1px white',
        backgroundColor: 'transparent',
        ease: 'bounce',
      });
      gsap.to('.dot', {
        scale: 4,
        opacity: 0.5,
        backgroundColor: 'transparent',
        border: 'solid 1px #ed1b33',
        ease: 'bounce',
      });
    });
    cursor.addEventListener('mouseleave', () => {
      gsap.to('.cursor', {
        opacity: 0.6,
        border: 'none',
        backgroundColor: 'white',
        ease: 'bounce',
      });
      gsap.to('.dot', {
        scale: 1,
        backgroundColor: '#ed1b33',
        opacity: 1,
        ease: 'bounce',
      });
    });
  });
  const iframeCursors = document.querySelectorAll('[data-cursor="iframe"]');
  iframeCursors.forEach((cursor) => {
    cursor.addEventListener('mouseenter', () => {
      gsap.to('.cursor', { opacity: 0, ease: 'bounce' });
      gsap.to('.dot', { scale: 0, opacity: 0, ease: 'bounce' });
    });
    cursor.addEventListener('mouseleave', () => {
      gsap.to('.cursor', { opacity: 1, ease: 'bounce' });
      gsap.to('.dot', {
        scale: 1,
        opacity: 1,
        overwrite: 'auto',
        ease: 'bounce',
      });
    });
  });
}
const app = document.getElementById('rotatingtext');
const typewriter = new Typewriter(app, {
  loop: true,
});
typewriter
  .typeString('SUPPORTING')
  .pauseFor(2500)
  .deleteAll()
  .typeString('CREATING')
  .pauseFor(2500)
  .deleteAll()
  .typeString('TRANSFORMING')
  .pauseFor(2500)
  .start();
document.querySelector('.down').addEventListener('click', () => {
  document.querySelector('#header').classList.toggle('mobileheader');
  document.querySelector('.down').classList.toggle('ri-arrow-up-circle-fill');
  document.querySelector('.down').classList.toggle('ri-arrow-down-circle-fill');
});
const modal = document.getElementById('modal');
const iframe = document.getElementById('iframe');
const modal2 = document.getElementById('modal2');
const iframe2 = document.getElementById('iframe2');
const modal3 = document.getElementById('modal3');
const iframe3 = document.getElementById('iframe3');
const modal4 = document.getElementById('modal4');
const iframe4 = document.getElementById('iframe4');
const modal5 = document.getElementById('modal5');
const iframe5 = document.getElementById('iframe5');
const modal6 = document.getElementById('modal6');
const iframe6 = document.getElementById('iframe6');
const modal7 = document.getElementById('modal7');
const iframe7 = document.getElementById('iframe7');
const modal8 = document.getElementById('modal8');
const iframe8 = document.getElementById('iframe8');
const modal9 = document.getElementById('modal9');
const iframe9 = document.getElementById('iframe9');
const modal10 = document.getElementById('modal10');
const iframe10 = document.getElementById('iframe10');
const modal11 = document.getElementById('modal11');
const iframe11 = document.getElementById('iframe11');
const modal12 = document.getElementById('modal12');
const iframe12 = document.getElementById('iframe12');
const modal13 = document.getElementById('modal13');
const iframe13 = document.getElementById('iframe13');
const modal14 = document.getElementById('modal14');
const iframe14 = document.getElementById('iframe14');
const modal15 = document.getElementById('modal15');
const iframe15 = document.getElementById('iframe15');
const modal16 = document.getElementById('modal16');
const iframe16 = document.getElementById('iframe16');
function initSwitch() {
  const button = document.querySelector('.switch');
  if (!button) {
    return console.error('Switch button ".switch" not exists!');
  }
  function toggleSwitch() {
    button.classList.toggle('switch-active');
    button.classList.toggle('switch-not-active');
  }
  function toggleSwitchInitial() {
    button.classList.add('switch-active');
    button.removeEventListener('click', toggleSwitchInitial);
    button.addEventListener('click', toggleSwitch);
  }
  button.addEventListener('click', toggleSwitchInitial);
}
initSwitch();
function initSwitch2() {
  const button2 = document.querySelector('.switch2');
  if (!button2) {
    return console.error('Switch2 button ".switch2" not exists!');
  }
  function toggleSwitch2() {
    button2.classList.toggle('switch2-active');
    button2.classList.toggle('switch2-not-active');
  }
  function toggleSwitchInitial2() {
    button2.classList.add('switch2-active');
    button2.removeEventListener('click', toggleSwitchInitial2);
    button2.addEventListener('click', toggleSwitch2);
  }
  button2.addEventListener('click', toggleSwitchInitial2);
}
initSwitch2();
function initSwitch3() {
  const button3 = document.querySelector('.switch3');
  if (!button3) {
    return console.error('Switch3 button ".switch3" not exists!');
  }
  function toggleSwitch3() {
    button3.classList.toggle('switch3-active');
    button3.classList.toggle('switch3-not-active');
  }
  function toggleSwitchInitial3() {
    button3.classList.add('switch3-active');
    button3.removeEventListener('click', toggleSwitchInitial3);
    button3.addEventListener('click', toggleSwitch3);
  }
  button3.addEventListener('click', toggleSwitchInitial3);
}
initSwitch3();
const vpiweb = document.querySelector('.vpiweb');
vpiweb.addEventListener('click', () => {
  const state = Flip.getState(vpiweb, { props: 'borderRadius' });
  vpiweb.classList.toggle('full-screen');
  Flip.from(state, {
    absolute: true,
    scale: false,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span1 = document.getElementById('close1');
span1.addEventListener('click', () => {
  const state = Flip.getState(vpiweb);
  vpiweb.classList.toggle('full-screen');
  Flip.from(state, {
    absolute: true,
    duration: 0.8,
    scale: false,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe, { duration: 0.4, opacity: 0 });
  const video = iframe.contentWindow.document.getElementById('video');
  video.pause();
  video.currentTime = 0;
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const vpideck = document.querySelector('.vpideck');
vpideck.addEventListener('click', () => {
  const state2 = Flip.getState(vpideck, { props: 'borderRadius' });
  vpideck.classList.toggle('full-screen');
  Flip.from(state2, {
    absolute: true,
    scale: false,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal2, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe2, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span2 = document.getElementById('close2');
span2.addEventListener('click', () => {
  const state2 = Flip.getState(vpideck);
  vpideck.classList.toggle('full-screen');
  Flip.from(state2, {
    absolute: true,
    duration: 0.8,
    scale: false,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal2, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe2, { duration: 0.4, opacity: 0 });
  const video = iframe2.contentWindow.document.getElementById('video');
  video.pause();
  video.currentTime = 0;
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const medicomb = document.querySelector('.medicomb');
medicomb.addEventListener('click', () => {
  const state3 = Flip.getState(medicomb, { props: 'borderRadius' });
  medicomb.classList.toggle('full-screen');
  Flip.from(state3, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal3, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe3, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span3 = document.getElementById('close3');
span3.addEventListener('click', () => {
  const state3 = Flip.getState(medicomb);
  medicomb.classList.toggle('full-screen');
  Flip.from(state3, {
    absolute: true,
    duration: 0.8,
    scale: false,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal3, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe3, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const medicomdura = document.querySelector('.medicomdura');
medicomdura.addEventListener('click', () => {
  const state4 = Flip.getState(medicomdura, {
    props: 'borderRadius',
  });
  medicomdura.classList.toggle('full-screen');
  Flip.from(state4, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal4, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe4, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span4 = document.getElementById('close4');
span4.addEventListener('click', () => {
  const state4 = Flip.getState(medicomdura);
  medicomdura.classList.toggle('full-screen');
  Flip.from(state4, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal4, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe4, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const anim1 = document.querySelector('.anim1');
anim1.addEventListener('click', () => {
  const state5 = Flip.getState(anim1, { props: 'borderRadius' });
  anim1.classList.toggle('full-screen');
  Flip.from(state5, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal5, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe5, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span5 = document.getElementById('close5');
span5.addEventListener('click', () => {
  const state5 = Flip.getState(anim1);
  anim1.classList.toggle('full-screen');
  Flip.from(state5, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal5, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe5, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
  iframe5.src = 'https://www.youtube.com/embed/QEcHu3LTGpA';
});
const anim2 = document.querySelector('.anim2');
anim2.addEventListener('click', () => {
  const state6 = Flip.getState(anim2, { props: 'borderRadius' });
  anim2.classList.toggle('full-screen');
  Flip.from(state6, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal6, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe6, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span6 = document.getElementById('close6');
span6.addEventListener('click', () => {
  const state6 = Flip.getState(anim2);
  anim2.classList.toggle('full-screen');
  Flip.from(state6, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal6, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe6, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
  iframe6.src = 'https://www.youtube.com/embed/VHrdgv7k-JM';
});
const anim3 = document.querySelector('.anim3');
anim3.addEventListener('click', () => {
  const state7 = Flip.getState(anim3, { props: 'borderRadius' });
  anim3.classList.toggle('full-screen');
  Flip.from(state7, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal7, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe7, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span7 = document.getElementById('close7');
span7.addEventListener('click', () => {
  const state7 = Flip.getState(anim3);
  anim3.classList.toggle('full-screen');
  Flip.from(state7, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal7, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe7, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
  iframe7.src = 'https://www.youtube.com/embed/Pf-uUpr4Ax4';
});
const anim4 = document.querySelector('.anim4');
anim4.addEventListener('click', () => {
  const state8 = Flip.getState(anim4, { props: 'borderRadius' });
  anim4.classList.toggle('full-screen');
  Flip.from(state8, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal8, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe8, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span8 = document.getElementById('close8');
span8.addEventListener('click', () => {
  const state8 = Flip.getState(anim4);
  anim4.classList.toggle('full-screen');
  Flip.from(state8, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal8, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe8, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
  iframe8.src = 'https://www.youtube.com/embed/rOclbYUpoWI';
});
const medisafe = document.querySelector('.medisafe');
medisafe.addEventListener('click', () => {
  const state9 = Flip.getState(medisafe, {
    props: 'borderRadius',
  });
  medisafe.classList.toggle('full-screen');
  Flip.from(state9, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal9, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe9, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span9 = document.getElementById('close9');
span9.addEventListener('click', () => {
  const state9 = Flip.getState(medisafe);
  medisafe.classList.toggle('full-screen');
  Flip.from(state9, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal9, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe9, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const medibrand = document.querySelector('.medibrand');
medibrand.addEventListener('click', () => {
  const state10 = Flip.getState(medibrand, {
    props: 'borderRadius',
  });
  medibrand.classList.toggle('full-screen');
  Flip.from(state10, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal10, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe10, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span10 = document.getElementById('close10');
span10.addEventListener('click', () => {
  const state10 = Flip.getState(medibrand);
  medibrand.classList.toggle('full-screen');
  Flip.from(state10, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal10, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe10, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const agropod = document.querySelector('.agropod');
agropod.addEventListener('click', () => {
  const state11 = Flip.getState(agropod, {
    props: 'borderRadius',
  });
  agropod.classList.toggle('full-screen');
  Flip.from(state11, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal11, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe11, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span11 = document.getElementById('close11');
span11.addEventListener('click', () => {
  const state11 = Flip.getState(agropod);
  agropod.classList.toggle('full-screen');
  Flip.from(state11, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal11, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe11, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const supply = document.querySelector('.supply');
supply.addEventListener('click', () => {
  const state12 = Flip.getState(supply, {
    props: 'borderRadius',
  });
  supply.classList.toggle('full-screen');
  Flip.from(state12, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal12, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe12, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span12 = document.getElementById('close12');
span12.addEventListener('click', () => {
  const state12 = Flip.getState(supply);
  supply.classList.toggle('full-screen');
  Flip.from(state12, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal12, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe12, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const canada = document.querySelector('.canada');
canada.addEventListener('click', () => {
  const state13 = Flip.getState(canada, {
    props: 'borderRadius',
  });
  canada.classList.toggle('full-screen');
  Flip.from(state13, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal13, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe13, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span13 = document.getElementById('close13');
span13.addEventListener('click', () => {
  const state13 = Flip.getState(canada);
  canada.classList.toggle('full-screen');
  Flip.from(state13, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal13, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe13, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const mika = document.querySelector('.mika');
mika.addEventListener('click', () => {
  const state14 = Flip.getState(mika, {
    props: 'borderRadius',
  });
  mika.classList.toggle('full-screen');
  Flip.from(state14, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal14, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe14, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span14 = document.getElementById('close14');
span14.addEventListener('click', () => {
  const state14 = Flip.getState(mika);
  mika.classList.toggle('full-screen');
  Flip.from(state14, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal14, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe14, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const yhp = document.querySelector('.yhp');
yhp.addEventListener('click', () => {
  const state15 = Flip.getState(yhp, {
    props: 'borderRadius',
  });
  yhp.classList.toggle('full-screen');
  Flip.from(state15, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal15, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe15, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span15 = document.getElementById('close15');
span15.addEventListener('click', () => {
  const state15 = Flip.getState(yhp);
  yhp.classList.toggle('full-screen');
  Flip.from(state15, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal15, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe15, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const vikc = document.querySelector('.vikc');
vikc.addEventListener('click', () => {
  const state16 = Flip.getState(vikc, {
    props: 'borderRadius',
  });
  vikc.classList.toggle('full-screen');
  Flip.from(state16, {
    absolute: true,
    duration: 0.8,
    ease: 'power1.inOut',
  });
  gsap.to(modal16, {
    duration: 1,
    display: 'block',
    opacity: 1,
    delay: 0.8,
  });
  gsap.to(iframe16, { duration: 1, opacity: 1 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
const span16 = document.getElementById('close16');
span16.addEventListener('click', () => {
  const state16 = Flip.getState(vikc);
  vikc.classList.toggle('full-screen');
  Flip.from(state16, {
    absolute: true,
    zIndex: 8,
    ease: 'power1.inOut',
  });
  gsap.to(modal16, { duration: 0.4, display: 'none', opacity: 0 });
  gsap.to(iframe16, { duration: 0.4, opacity: 0 });
  if (isPlay === false) {
    isPlay = true;
  } else if (isPlay === true) {
    isPlay = false;
  }
});
bodyScrollBar.addListener(({ offset }) => {
  document.documentElement.style.setProperty('--ofy', `${offset.y}px`);
});
function start() {
  const content = document.querySelectorAll('.lazy');
  for (let i = 0; i < content.length; i += 1) {
    if (bodyScrollBar.isVisible(content[i]) === true) {
      content[i].src = content[i].dataset.src;
      content[i].classList.remove('lazy');
    }
    if (content[i] === 0) {
      bodyScrollBar.removeListener(start);
    }
  }
}
bodyScrollBar.addListener(start);
const filters = gsap.utils.toArray('.filter');
const items = gsap.utils.toArray('.all');
const parents = gsap.utils.toArray('.placeholder');
const copy = document.querySelector('.copy');
function updateFilters(filterClass) {
  gsap.to(copy, { duration: 0.5, opacity: 0 });
  const state = Flip.getState(items, parents);
  items.forEach((item) => {
    item.style.display =
      item.classList.contains(filterClass) === false ? 'none' : 'inline-flex';
    item.parentElement.style.display =
      item.classList.contains(filterClass) === false ? 'none' : 'inline-flex';
  });
  Flip.from(state, {
    duration: 0.5,
    scale: true,
    fade: true,
    spin: true,
    ease: 'power1.inOut',
    stagger: 0.08,
    absolute: true,
    onEnter: (elements) =>
      gsap.fromTo(
        elements,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          rotation: 360,
          duration: 0.5,
          delay: 0.5,
        }
      ),
    onLeave: (elements) =>
      gsap.to(elements, {
        stagger: 0.08,
        rotation: 360,
        opacity: 0,
        duration: 0.5,
      }),
    onComplete: () => {
      start();
      gsap.to(copy, { duration: 0.5, opacity: 1 });
      gsap.set('.projectcon', { height: 'fit-content' });
      gsap.set('.projects', { height: 'fit-content' });
    },
  });
}
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    updateFilters(filter.getAttribute('data-filter'));
    gsap.set('.projectcon', { height: 'calc(var(--vh) * 150)' });
    gsap.set('.projects', { height: 'calc(var(--vh) * 150)' });
    bodyScrollBar.update();
    bodyScrollBar.scrollIntoView(document.querySelector('#scrview'), {
      offsetBottom: 0,
      offsetTop: 99,
      offsetLeft: 1000,
      alignToTop: true,
      onlyScrollIfNeeded: false,
    });
  });
});
const ppmenu = document.getElementById('ppmenu');
const btns = ppmenu.getElementsByClassName('filter');
for (let i = 0; i < btns.length; i += 1) {
  btns[i].addEventListener('click', function btns1() {
    const current = document.getElementsByClassName('factive');
    current[0].className = current[0].className.replace('factive', '');
    this.className += ' factive';
  });
}
const totop = document.querySelector('.scrolltop');
totop.addEventListener('click', () => {
  bodyScrollBar.scrollTo(0, 0, 1600);
});
window.addEventListener('message', (event) => {
  if (event.origin !== '*') {
    switch (event.data) {
      case 'vpi_web':
        updateFilters('vpi');
        gsap.set('.projectcon', { height: 'calc(var(--vh) * 150)' });
        gsap.set('.projects', { height: 'calc(var(--vh) * 150)' });
        const state = Flip.getState(vpiweb);
        vpiweb.classList.toggle('full-screen');
        Flip.from(state, {
          absolute: true,
          zIndex: 8,
          ease: 'power1.inOut',
        });
        gsap.to(modal, { duration: 1, display: 'none', opacity: 0 });
        if (isPlay === false) {
          isPlay = true;
        } else if (isPlay === true) {
          isPlay = false;
        }
        bodyScrollBar.update();
        bodyScrollBar.scrollIntoView(document.querySelector('#scrview'), {
          offsetBottom: 0,
          offsetTop: 99,
          offsetLeft: 1000,
          alignToTop: true,
          onlyScrollIfNeeded: false,
        });
        break;

      case 'vpi_deck':
        updateFilters('vpi');
        gsap.set('.projectcon', { height: 'calc(var(--vh) * 150)' });
        gsap.set('.projects', { height: 'calc(var(--vh) * 150)' });
        const state2 = Flip.getState(vpideck);
        vpideck.classList.toggle('full-screen');
        Flip.from(state2, {
          absolute: true,
          zIndex: 8,
          ease: 'power1.inOut',
        });
        gsap.to(modal2, { duration: 1, display: 'none', opacity: 0 });
        gsap.to(iframe2, { duration: 1, opacity: 0 });
        if (isPlay === false) {
          isPlay = true;
        } else if (isPlay === true) {
          isPlay = false;
        }
        bodyScrollBar.update();
        bodyScrollBar.scrollIntoView(document.querySelector('#scrview'), {
          offsetBottom: 0,
          offsetTop: 99,
          offsetLeft: 1000,
          alignToTop: true,
          onlyScrollIfNeeded: false,
        });
        break;

      case 'medi1':
        updateFilters('medi');
        gsap.set('.projectcon', { height: 'calc(var(--vh) * 150)' });
        gsap.set('.projects', { height: 'calc(var(--vh) * 150)' });
        const state3 = Flip.getState(medicomb);
        medicomb.classList.toggle('full-screen');
        Flip.from(state3, {
          absolute: true,
          zIndex: 8,
          ease: 'power1.inOut',
        });
        gsap.to(modal3, { duration: 1, display: 'none', opacity: 0 });
        gsap.to(iframe3, { duration: 1, opacity: 0 });
        if (isPlay === false) {
          isPlay = true;
        } else if (isPlay === true) {
          isPlay = false;
        }
        bodyScrollBar.update();
        bodyScrollBar.scrollIntoView(document.querySelector('#scrview'), {
          offsetBottom: 0,
          offsetTop: 99,
          offsetLeft: 1000,
          alignToTop: true,
          onlyScrollIfNeeded: false,
        });
        break;

      case 'medi2':
        updateFilters('medi');
        gsap.set('.projectcon', { height: 'calc(var(--vh) * 150)' });
        gsap.set('.projects', { height: 'calc(var(--vh) * 150)' });
        const state4 = Flip.getState(medicomdura);
        medicomdura.classList.toggle('full-screen');
        Flip.from(state4, {
          absolute: true,
          zIndex: 8,
          ease: 'power1.inOut',
        });
        gsap.to(modal4, { duration: 1, display: 'none', opacity: 0 });
        gsap.to(iframe4, { duration: 1, opacity: 0 });
        if (isPlay === false) {
          isPlay = true;
        } else if (isPlay === true) {
          isPlay = false;
        }
        bodyScrollBar.update();
        bodyScrollBar.scrollIntoView(document.querySelector('#scrview'), {
          offsetBottom: 0,
          offsetTop: 99,
          offsetLeft: 1000,
          alignToTop: true,
          onlyScrollIfNeeded: false,
        });
        break;

      case 'medisafe':
        updateFilters('medi');
        gsap.set('.projectcon', { height: 'calc(var(--vh) * 150)' });
        gsap.set('.projects', { height: 'calc(var(--vh) * 150)' });
        const state9 = Flip.getState(medisafe);
        medisafe.classList.toggle('full-screen');
        Flip.from(state9, {
          absolute: true,
          zIndex: 8,
          ease: 'power1.inOut',
        });
        gsap.to(modal9, { duration: 1, display: 'none', opacity: 0 });
        gsap.to(iframe9, { duration: 1, opacity: 0 });
        if (isPlay === false) {
          isPlay = true;
        } else if (isPlay === true) {
          isPlay = false;
        }
        bodyScrollBar.update();
        bodyScrollBar.scrollIntoView(document.querySelector('#scrview'), {
          offsetBottom: 0,
          offsetTop: 99,
          offsetLeft: 1000,
          alignToTop: true,
          onlyScrollIfNeeded: false,
        });
        break;

      case 'medibrand':
        updateFilters('medi');
        gsap.set('.projectcon', { height: 'calc(var(--vh) * 150)' });
        gsap.set('.projects', { height: 'calc(var(--vh) * 150)' });
        const state10 = Flip.getState(medibrand);
        medibrand.classList.toggle('full-screen');
        Flip.from(state10, {
          absolute: true,
          zIndex: 8,
          ease: 'power1.inOut',
        });
        gsap.to(modal10, {
          duration: 1,
          display: 'none',
          opacity: 0,
        });
        gsap.to(iframe10, { duration: 1, opacity: 0 });
        if (isPlay === false) {
          isPlay = true;
        } else if (isPlay === true) {
          isPlay = false;
        }
        bodyScrollBar.update();
        bodyScrollBar.scrollIntoView(document.querySelector('#scrview'), {
          offsetBottom: 0,
          offsetTop: 99,
          offsetLeft: 1000,
          alignToTop: true,
          onlyScrollIfNeeded: false,
        });
        break;

      default:
    }
  }
});
const modallogin = document.getElementById('modallogin');
const modallog = document.getElementById('modallog');
const modalcontentlog = document.querySelector('.modal-contentlog');
const closelog = document.getElementById('closelogin');
const h = window.innerHeight / 2;
modallog.onclick = function mod() {
  const tlml = gsap.timeline({});
  gsap.set(modalcontentlog, {
    xPercent: -50,
    left: '50%',
    yPercent: -50,
    top: '0',
    position: 'absolute',
  });
  tlml
    .to(modallogin, { duration: 0.4, display: 'block', opacity: 1 })
    .fromTo(
      modalcontentlog,
      { opacity: 0, y: 1080 },
      { duration: 1, opacity: 1, y: h, ease: 'bounce' }
    );
  // modallogin.style.display = 'block';
  if (window.matchMedia && window.matchMedia('(max-width: 950px)').matches) {
    document.querySelector('#header').classList.toggle('mobileheader');
  }
};
closelog.onclick = function closelog() {
  const tlmlc = gsap.timeline({});
  tlmlc
    .to(modalcontentlog, { duration: 0.6, opacity: 0, y: 1080 })
    .to(modallogin, { duration: 0.4, display: 'none', opacity: 0 }); // modallogin.style.display = 'none';
};
window.onclick = function clolog(event) {
  if (event.target === modallogin) {
    const tlmlc = gsap.timeline({});
    tlmlc
      .to(modalcontentlog, { duration: 0.6, opacity: 0, y: 1080 })
      .to(modallogin, { duration: 0.4, display: 'none', opacity: 0 });
  }
};
