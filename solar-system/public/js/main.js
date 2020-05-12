"use strict";
var canvas;
var renderer;
var scene, sceneBackground;
var camera, cameraBackground;
var light;
var earthOrbit, moonOrbit;
var deepSpace, sun, earth, moon, apolo;

class Model extends THREE.Mesh {
  constructor() {
    super(new THREE.SphereGeometry(1, 15, 15),
    new THREE.MeshBasicMaterial({
      wireframe: true
    }))
  }
}

class Sun extends Model {
  constructor() {
    super();
    this.ownRotation = .01;
    this.radius = 1;
  }
}

class Earth extends Model {
  constructor() {
    super();
    this.ownRotation = .01;
    this.radius = .5;
    this.distanceToParent = 2.5;
    this.rotationAboutParent = 0.01;
  }
}

class Moon extends Model {
  constructor() {
    super();
    this.ownRotation = .01;
    this.radius = .2;
    this.distanceToParent = 3.5;
    this.rotationAboutParent = 0.01;
  }
}

class Apolo extends Model {
  constructor() {
    super();
    this.ownRotation = .01;
    this.radius = .05;
    this.distanceToParent = 3.8;
    this.rotationAboutParent = 0.01;
  }
}

class EarthOrbit extends THREE.Group {
  constructor() {
    super();

  }
}

class MoonOrbit extends THREE.Group {
  constructor() {
    super();

  }
}

function main() {
  // CANVAS
  canvas = document.getElementById("canvas");
  resizeCanvas(); // Set canvas size for the first time

  // RENDERER
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor("black");

  // MODELS
  deepSpace = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("imgs/" + "deep-outer-space-map.jpg"),
      depthTest: false,
    })
  );
  // FRONT MODELS
  sun = new Sun();
  earth = new Earth();
  moon = new Moon();
  apolo = new Apolo();
  earthOrbit = new EarthOrbit();
  moonOrbit = new MoonOrbit();

  // MATERIALS

  // LOCAL MODEL TRANSFORMS
  // EARTH
  earth.position.x += earth.distanceToParent;
  earth.scale.set(earth.radius, earth.radius, earth.radius);

  // MOON ORBIT

  // MOON
  moon.position.x += moon.distanceToParent;
  moon.scale.set(moon.radius, moon.radius, moon.radius);

  // APOLO ORBIT

  // APOLO
  apolo.position.x += apolo.distanceToParent;
  apolo.scale.set(apolo.radius, apolo.radius, apolo.radius);

  // LIGHTS
  light = new THREE.AmbientLight();

  // CAMERAS

  // FRONT CAMERA
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 0, 6);
  new THREE.OrbitControls(camera, renderer.domElement);

  // SCENE GRAPH

  // BACKGROUND SCENE
  sceneBackground = new THREE.Scene();
  cameraBackground = new THREE.Camera();

  sceneBackground.add(deepSpace);
  sceneBackground.add(cameraBackground);

  // FRONT SCENE
  scene = new THREE.Scene();
  scene.add(sun);
  scene.add(earthOrbit);
  earthOrbit.add(earth);
  earthOrbit.add(moonOrbit);
  moonOrbit.add(moon);
  moonOrbit.add(apolo);

  // EVENT-HANDLERS
  window.addEventListener("resize", windowEventListener, false);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function update() {
  sun.rotation.y += sun.ownRotation;
  earth.rotation.y += earth.ownRotation;
  moon.rotation.y += moon.ownRotation;
  earthOrbit.rotation.y += earth.rotationAboutParent;
}

function renderLoop() {
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(sceneBackground, cameraBackground);
  renderer.render(scene, camera);
  update();
  requestAnimationFrame(renderLoop);
}
