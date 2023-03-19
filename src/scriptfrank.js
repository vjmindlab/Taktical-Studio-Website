import {
  EquirectangularReflectionMapping,
  PCFShadowMap,
  TextureLoader,
  sRGBEncoding,
  ACESFilmicToneMapping,
  LoadingManager,
  Group,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  DirectionalLight,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const containerload = document.getElementById('container-load');
const progressBar = document.getElementById('loader-progress-progress');
const progresspercent = document.getElementById('progresspercent');

const manager = new LoadingManager();
manager.onStart = function start() {};
manager.onLoad = function load() {
  containerload.style.opacity = 0;
};
manager.onProgress = function progress(url, itemsLoaded, itemsTotal) {
  progressBar.style.width = (itemsLoaded / itemsTotal) * 100 + '%';
  progresspercent.innerHTML =
    Math.floor((itemsLoaded / itemsTotal) * 100) + '%';
};
manager.onError = function error(url) {
  console.log('There was an error loading ' + url);
};

const main = new Group();
let controls;
let directionalLight;
let directionalLight2;
let textureEquirec;
let container;
let camera;
let scene;
let renderer;
let model1;
let mouseX = 0;
let mouseY = 0;
let mouseX2 = 0;
let mouseY2 = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  renderer = new WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMappingExposure = 0.4;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.powerPreference = 'high-performance';
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 6;

  // controls for mobile
  if ('ontouchstart' in document.documentElement) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.autoRotate = true;
    controls.enableZoom = false;
    controls.minDistance = 5.5;
    controls.maxDistance = 5.5;
  } else {
    /* empty */
  }

  const textureLoader = new TextureLoader(manager);
  textureEquirec = textureLoader.load('./static/nebula.jpg');
  textureEquirec.mapping = EquirectangularReflectionMapping;

  scene = new Scene();
  scene.environment = textureEquirec;
  scene.background = textureEquirec;
  const loader = new GLTFLoader(manager).setPath('./static/');
  const dracoLoader = new DRACOLoader(manager);
  dracoLoader.setDecoderPath('./static/draco/gltf/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  loader.setDRACOLoader(dracoLoader);
  loader.load('frank2.glb', (gltf) => {
    model1 = gltf.scene;
    model1.scale.set(1, 1, 1);
    model1.position.set(0, 0, 0);
    model1.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    main.add(model1);
    scene.add(main);
  });

  dracoLoader.dispose();

  directionalLight = new DirectionalLight(0x8589ff, 1.3);
  directionalLight.position.set(-2.418, 1.448, 7.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.left = -5;
  directionalLight.shadow.camera.right = 5;
  directionalLight.shadow.camera.top = 5;
  directionalLight.shadow.camera.bottom = -5;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.bias = -0.0001;
  scene.add(directionalLight);

  directionalLight2 = new DirectionalLight(0xff5cdc, 1);
  directionalLight2.position.set(2.418, 1.448, 7.5);
  directionalLight2.castShadow = true;
  directionalLight2.shadow.mapSize.width = 1024;
  directionalLight2.shadow.mapSize.height = 1024;
  directionalLight2.shadow.camera.left = -5;
  directionalLight2.shadow.camera.right = 5;
  directionalLight2.shadow.camera.top = 5;
  directionalLight2.shadow.camera.bottom = -5;
  directionalLight2.shadow.camera.near = 0.5;
  directionalLight2.shadow.camera.far = 500;
  directionalLight2.shadow.bias = -0.0001;
  scene.add(directionalLight2);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 1000;
  mouseY = (event.clientY - windowHalfY) / 1000;
  mouseX2 = (event.clientX - windowHalfX) / 500;
  mouseY2 = (event.clientY - windowHalfY) / 500;
}
document.addEventListener('mousemove', onDocumentMouseMove);
window.addEventListener('resize', onWindowResize);
function render() {}
function animate() {
  requestAnimationFrame(animate);

  render();
  if ('ontouchstart' in document.documentElement) {
    controls.update(); // content for touch-screen (mobile) devices
  } else {
    main.rotation.x += (mouseY - main.rotation.x) * 0.05;
    main.rotation.y += (mouseX - main.rotation.y) * 0.05;
    camera.position.x += (mouseX2 - camera.position.x) * 0.05;
    camera.position.y += (mouseY2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  }
  renderer.render(scene, camera);
}
init();
animate();
