import * as THREE from '../node_modules/three/';
import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { FilesetResolver } from '../node_modules/@mediapipe/tasks-vision/';
import { PoseLandmarker } from '../node_modules/@mediapipe/tasks-vision/';

// global variables
let vision;
let poseLandmarker;
let scene;
let camera;
let renderer;
const models = [];
let selectedLeftModel ;
let selectedRightModel;
let videoTexture;
let lastVideoTime = -1;
let planeWidth = 12;
let planeHeight = 16;
const video = document.createElement('video');
const videoConstraints = { video: {facingMode: 'environment'} };
const loadingContainer = document.getElementById('loadingContainer');

// choose model & click event
const scrollDiv = document.getElementById('scrollDiv');
scrollDiv.addEventListener('click', event => {
  if (event.target.classList.contains('imageItem')) {
    const id = event.target.id;
    if (id == "shoe1") {
      models[0].disposeModel();
      models[1].disposeModel();
      models[2].disposeModel();
      models[3].disposeModel();
      models[4].disposeModel();
      models[5].disposeModel(); 
      models[0].loadModel();
    } else 
    if (id == "shoe2") {
      models[0].disposeModel();
      models[1].disposeModel();
      models[2].disposeModel();
      models[3].disposeModel();
      models[4].disposeModel();
      models[5].disposeModel(); 
      models[1].loadModel();
    } else 
    if (id == "shoe3") {
      models[0].disposeModel();
      models[1].disposeModel();
      models[2].disposeModel();
      models[3].disposeModel();
      models[4].disposeModel();
      models[5].disposeModel(); 
      models[2].loadModel();
    } else 
    if (id == "shoe4") {
      models[0].disposeModel();
      models[1].disposeModel();
      models[2].disposeModel();
      models[3].disposeModel();
      models[4].disposeModel();
      models[5].disposeModel(); 
      models[3].loadModel();
    } else 
    if (id == "shoe5") {
      models[0].disposeModel();
      models[1].disposeModel();
      models[2].disposeModel();
      models[3].disposeModel();
      models[4].disposeModel();
      models[5].disposeModel(); 
      models[4].loadModel();
    } else 
    if (id == "shoe6") {
      models[0].disposeModel();
      models[1].disposeModel();
      models[2].disposeModel();
      models[3].disposeModel();
      models[4].disposeModel();
      models[5].disposeModel(); 
      models[5].loadModel();
    }
  }
});

// initialize mediapipe
async function initMediapipe() {
  vision = await FilesetResolver.forVisionTasks(
    "../node_modules/@mediapipe/tasks-vision/wasm"
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "../trainingModel/pose_landmarker_lite.task",
      delegate: "GPU"
    },
    runningMode: "VIDEO",
  });
}

// initialize threejs
function initThreejs() {
  // scene
  scene = new THREE.Scene();
  // camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  // light
  const light = new THREE.AmbientLight(0xFFFFFF, 2);
  scene.add(light);
  // models
  models[0] = new modelLoader('../objModel/shoe1/shoe1L.mtl', '../objModel/shoe1/shoe1L.obj', '../objModel/shoe1/shoe1R.mtl', '../objModel/shoe1/shoe1R.obj');
  models[1] = new modelLoader('../objModel/shoe1/shoe1L.mtl', '../objModel/shoe1/shoe1L.obj', '../objModel/shoe1/shoe1R.mtl', '../objModel/shoe1/shoe1R.obj');
  models[2] = new modelLoader('../objModel/shoe1/shoe1L.mtl', '../objModel/shoe1/shoe1L.obj', '../objModel/shoe1/shoe1R.mtl', '../objModel/shoe1/shoe1R.obj');
  models[3] = new modelLoader('../objModel/shoe1/shoe1L.mtl', '../objModel/shoe1/shoe1L.obj', '../objModel/shoe1/shoe1R.mtl', '../objModel/shoe1/shoe1R.obj');
  models[4] = new modelLoader('../objModel/shoe1/shoe1L.mtl', '../objModel/shoe1/shoe1L.obj', '../objModel/shoe1/shoe1R.mtl', '../objModel/shoe1/shoe1R.obj');
  models[5] = new modelLoader('../objModel/shoe1/shoe1L.mtl', '../objModel/shoe1/shoe1L.obj', '../objModel/shoe1/shoe1R.mtl', '../objModel/shoe1/shoe1R.obj');
  // videoTexture
  videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  // plane
  const material = new THREE.MeshBasicMaterial({ map: videoTexture });
  const geometry = new THREE.PlaneGeometry(planeWidth,planeHeight);
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
}

// initWebcam
function initCamera() {
  // get video stream
  navigator.mediaDevices.getUserMedia(videoConstraints)
  .then((stream) => {
    // set attribute to video element
    video.srcObject = stream;
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '')
    video.play();
  })
  .catch((error) => {``
    console.error('Error accessing webcam:', error);
  });
}

// encapsulation about model loader
class modelLoader {
  constructor(mtlPathL, objPathL, mtlPathR, objPathR) {
    this.modelL = null;
    this.modelR = null;
    this.mtlLoaderL = new MTLLoader();
    this.objLoaderL = new OBJLoader();
    this.mtlLoaderR = new MTLLoader();
    this.objLoaderR = new OBJLoader();
    this.mtlPathL = mtlPathL;
    this.objPathL = objPathL;
    this.mtlPathR = mtlPathR;
    this.objPathR = objPathR;
  }
  loadModel () {
    loadingContainer.style.display = 'block';
    this.mtlLoaderL.load(this.mtlPathL, (material) => {
      material.preload();
      for (const mtl of Object.values(material.materials)) {
        mtl.side = THREE.DoubleSide;
      }
      this.objLoaderL.setMaterials(material);
      this.objLoaderL.load(this.objPathL, (obj) => {
        selectedLeftModel = obj;
        this.modelL = obj;
        scene.add(obj);
      });
    });
    this.mtlLoaderR.load(this.mtlPathR, (material) => {
      material.preload();
      for (const mtl of Object.values(material.materials)) {
        mtl.side = THREE.DoubleSide;
      }
      this.objLoaderR.setMaterials(material);
      this.objLoaderR.load(this.objPathR, (obj) => {
        selectedRightModel = obj;
        this.modelR = obj;
        scene.add(obj);
      });
    });
  }
  disposeModel () {
    if (this.modelL && this.modelR) {
      scene.remove(this.modelL, this.modelR);
      this.modelL = null;
      this.modelR = null;
      selectedLeftModel = null;
      selectedRightModel = null;
    }
  }
}

// encapsulation about binding shoes with feet
class shoeBinding {
  constructor(model) {
    this.model = model;
    this.shoesHeightRatio = 5;
    this.shoesWidthRatio = 5;
    this.shoesLengthRatio = 1.5;
  }
  updateShoe (shoe, heel2d, footIndex2d, heel3d, footIndex3d, ankle3d, knee3d) {
    // position
    heel2d.x = (heel2d.x - 0.5) * planeWidth;
    heel2d.y = (0.5 - heel2d.y) * planeHeight;
    footIndex2d.x = (footIndex2d.x - 0.5) * planeWidth;
    footIndex2d.y = (0.5 - footIndex2d.y) * planeHeight;
    const locationX = (heel2d.x + footIndex2d.x) / 2.0;
    const locationY = (heel2d.y + footIndex2d.y) / 2.0;
    shoe.position.set(locationX,locationY,0.5);
    // scale
    const shoeLength = Math.sqrt((heel3d.x - footIndex3d.x) ** 2 + (heel3d.y - footIndex3d.y) ** 2 + (heel3d.z - footIndex3d.z) ** 2);
    const shoeHeight = Math.sqrt((heel3d.x - ankle3d.x) ** 2 + (heel3d.y - ankle3d.y) ** 2 + (heel3d.z - ankle3d.z) ** 2);
    shoe.scale.set(this.shoesWidthRatio * shoeHeight, this.shoesHeightRatio * shoeHeight, shoeLength * this.shoesLengthRatio);
    // rotation
    heel3d.y = -heel3d.y;
    heel3d.z = -heel3d.z;
    footIndex3d.y = -footIndex3d.y;
    footIndex3d.z = -footIndex3d.z;
    ankle3d.y = -ankle3d.y;
    ankle3d.z = -ankle3d.z;
    knee3d.y = -knee3d.y;
    knee3d.z = -knee3d.z;
    const footY = new THREE.Vector3().subVectors(knee3d, ankle3d).normalize();
    const footZ = new THREE.Vector3().subVectors(heel3d, footIndex3d).normalize();
    const footX = new THREE.Vector3().crossVectors(footY, footZ).normalize();
    const shoeDirection = new THREE.Vector3(-1, 0, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(shoeDirection, footX);
    shoe.setRotationFromQuaternion(quaternion);
  }
}

// update the video / refresh frames
function updateVideoTexture() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      videoTexture.needsUpdate = true;
    }
}

// binding shoes with feet
function shoeFitting() {
  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    if (poseLandmarker) {
      poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
        const landmarks = result.landmarks;
        const worldLandmarks = result.worldLandmarks;
        if(selectedLeftModel && selectedRightModel){
          const leftShoe = new shoeBinding(selectedLeftModel);
          const rightShoe = new shoeBinding(selectedRightModel);
          if (landmarks[0]) {
            leftShoe.updateShoe(selectedLeftModel, landmarks[0][29], landmarks[0][31], worldLandmarks[0][29], worldLandmarks[0][31], worldLandmarks[0][27], worldLandmarks[0][25]);
            rightShoe.updateShoe(selectedRightModel, landmarks[0][30], landmarks[0][32], worldLandmarks[0][30], worldLandmarks[0][32],worldLandmarks[0][28], worldLandmarks[0][26]);
            console.log(leftShoe);
            console.log(rightShoe);
          }
        }
      });
    }
  }
}

// render loop
function updateVideo() {
  if (scene.children.length == 4) {
    loadingContainer.style.display = 'none';
  }
  console.log(scene.children.length);
  updateVideoTexture();
  shoeFitting();
  renderer.render(scene, camera);
  requestAnimationFrame(updateVideo);
}

// initialization
function init() {
  initMediapipe();
  initThreejs();
  initCamera();
}

// entrance function
function main() {
  init();
  requestAnimationFrame(updateVideo);
}

main();



