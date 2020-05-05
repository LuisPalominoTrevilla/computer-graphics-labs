"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;

class DiningRoom extends THREE.Group {
  constructor() {
    super();
    // CHILDREN
    this.table = new Bench();
    this.chair1 = new Chair();
    this.chair2 = new Chair();
    this.chair3 = new Chair();
    this.chair4 = new Chair();

    console.log(this.chair1);

    this.table.scale.set(2.2, 1.7, 2.2);
    this.chair1.position.z = -1.2;
    this.chair1.position.y = -.7;

    this.chair2.rotation.y = Math.PI;
    this.chair2.position.z = 1.2;
    this.chair2.position.y = -.7;

    this.chair3.rotation.y = Math.PI/2;
    this.chair3.position.x = -1.2
    this.chair3.position.y = -.7;

    this.chair4.rotation.y = -Math.PI/2;
    this.chair4.position.x = 1.2;
    this.chair4.position.y = -.7;

    // BUILD HIERARCHY
    this.add(this.table);
    this.add(this.chair1);
    this.add(this.chair2);
    this.add(this.chair3);
    this.add(this.chair4);
  }
}

class Leg extends THREE.Mesh {
  constructor() {
    super(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ wireframe: true })
    );
    this.scale.set(0.2, 1, 0.1);
  }
}

class Seat extends THREE.Mesh {
  constructor() {
    super(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ wireframe: true })
    );
    this.scale.set(1, 0.1, 1);
  }
}

class Back extends THREE.Mesh {
  constructor() {
    super(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ wireframe: true })
    );
    this.rotation.x -= Math.PI / 2;
    this.scale.set(1, 0.1, 1);
  }
}

class Bench extends THREE.Group {
  constructor() {
    super();
    // CHILDREN
    this.seat = new Seat();
    this.leftFrontLeg = new Leg();
    this.rightFrontLeg = new Leg();
    this.leftBackLeg = new Leg();
    this.rightBackLeg = new Leg();

    // TRANSFORMATIONS
    this.leftFrontLeg.position.set(-0.5, -0.5, 0.5);
    this.rightFrontLeg.position.set(0.5, -0.5, 0.5);
    this.leftBackLeg.position.set(-0.5, -0.5, -0.5);
    this.rightBackLeg.position.set(0.5, -0.5, -0.5);

    // BUILD HIERARCHY
    this.add(this.seat);
    this.add(this.leftFrontLeg);
    this.add(this.rightFrontLeg);
    this.add(this.leftBackLeg);
    this.add(this.rightBackLeg);
  }
}

class Chair extends THREE.Group {
  constructor() {
    super();
    // CHILDREN
    this.bench = new Bench();
    this.back = new Back();

    this.back.position.set(0, 0.5, -0.5);

    // BUILD HIERARCHY
    this.add(this.bench);
    this.add(this.back);
  }
}

function main() {
  // RENDERER
  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor("black");

  // MODELS
  const axis = new Axes();
  const diningRoom = new DiningRoom();

  // TRANSFORM MODELS

  // LIGHTS
  light = new THREE.AmbientLight();

  // CAMERAS
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 0, 6);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // SCENE
  scene = new THREE.Scene();

  scene.add(camera);
  scene.add(diningRoom);
  scene.add(axis);
  scene.add(light);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function renderLoop() {
  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
}
