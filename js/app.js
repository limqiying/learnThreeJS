// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x8FBCD4 );

  createCamera();
  createControls();
  createLights();
  createRenderer();
  loadModels();

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 100 );
  camera.position.set( -1.5, 1.5, 6.5 );

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}

function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );

}

function loadModels() {

  const loader = new THREE.GLTFLoader();
  const parrot = '/models/Parrot.glb';
  const flamingo = '/models/Flamingo.glb';
  const stork = '/models/Stork.glb';

  const onLoad = (gltf, position) => {

    const model = gltf.scene.children[0];
    model.position.copy(position);

    const animation = gltf.animations[0];
    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    scene.add(model);

  }

  const parrotPosition = new THREE.Vector3(0, 0, 2.5);
  loader.load(parrot, gltf => onLoad(gltf, parrotPosition));

  const flamingoPosition = new THREE.Vector3(7.5, 0, -10);
  loader.load(flamingo, gltf => onLoad(gltf, flamingoPosition));

  const storkPosition = new THREE.Vector3(0, -2.5, -10);
  loader.load(stork, gltf => onLoad(gltf, storkPosition));

}

function createRenderer() {

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.vr.enabled = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
  document.body.appendChild(THREE.WEBVR.createButton(renderer));

}

function update() {

  const delta = clock.getDelta();

  for ( const mixer of mixers ) {
    mixer.update( delta );
  }
}

function render() {

  renderer.render( scene, camera );

}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
