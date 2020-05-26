"use strict";
var canvas;
var renderer;
var scene;
var spring;
var springMesh, ballMesh;
var camera;
var light;
var x0; // initial pos in meters
var y0; // initial velocity in m/s
var t0; // Initial time
var fps; // Frames per second (default 24)
var n; // Resolution for solving an ODE by Euler (default 100)

class Arrow extends THREE.Group {
  constructor(size = 1) {
    super();
    // PARAMS
    this.size = size;
    // MODELS
    var vertices = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)];
    var geometryLine = new THREE.BufferGeometry().setFromPoints(vertices);
    var geometryCone = new THREE.ConeGeometry(0.05, 0.2, 10, 10);
    // MATERIAL
    var material = new THREE.MeshBasicMaterial();
    // MESH (GEOMETRY + MATERIAL)
    var line = new THREE.Line(geometryLine, material);
    var cone = new THREE.Mesh(geometryCone, material);
    // TRANSFORM
    cone.position.x = 1;
    cone.rotation.z = -Math.PI / 2;
    // GROUP
    this.add(line);
    this.add(cone);
  }
  setLength(length) {
    this.length = length;
    this.scale.set(length, 1, 1);
  }
  setColor(r, g, b, a) {
    this.children[1].material.color.setRGB(r, g, b, a);
  }
  setRedColor() {
    this.setColor(1, 0, 0, 1);
  }
  setGreenColor() {
    this.setColor(0, 1, 0, 1);
  }
  setBlueColor() {
    this.setColor(0, 0, 1, 1);
  }
  setWhiteColor() {
    this.setColor(1, 1, 1, 1);
  }
}

class Axes extends THREE.Group {
  constructor(size = 1) {
    super();
    // PARAMS
    this.size = size;
    this.colorX = [1, 0, 0];
    this.colorY = [0, 1, 0];
    this.colorZ = [0, 0, 1];
    // MODELS
    this.axesX = new Arrow();
    this.axesY = new Arrow();
    this.axesZ = new Arrow();
    // TRANSFORM
    this.axesX.rotation.z = Math.PI / 2;
    this.axesZ.rotation.y = -Math.PI / 2;
    // GROUP
    this.add(this.axesX);
    this.add(this.axesY);
    this.add(this.axesZ);
    // DEFAULTS
    this.scale.set(size, size, size);
    this.setColorX(1, 0, 0, 1);
    this.setColorY(0, 1, 0, 1);
    this.setColorZ(0, 0, 1, 1);
  }
  setSize(size) {
    this.size = size;
    this.scale.set(size, size, size);
  }
  setColorX(r = 1, g = 0, b = 0, a = 1) {
    this.axesX.setColor(r, g, b, a);
  }
  setColorY(r = 0, g = 1, b = 0, a = 1) {
    this.axesY.setColor(r, g, b, a);
  }
  setColorZ(r = 0, g = 0, b = 1, a = 1) {
    this.axesZ.setColor(r, g, b, a);
  }
}

class Spring {
  constructor(
    m = 1,
    k = 1,
    length = 5,
    nTwists = 10,
    outerRadius = 1,
    innerRadius = 0.05
  ) {
    this.m = m;
    this.k = k;
    this.length = length;
    this.nTwists = nTwists;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.setGeometry(length, nTwists, outerRadius, innerRadius);
    this.material = new THREE.MeshPhongMaterial({
      color: 0xc0c0c0,
      shininess: 50,
    });
  }
  setGeometry(length = 5, nTwists = 10, outerRadius = 1, innerRadius = 0.05) {
    this.length = length;
    this.nTwists = nTwists;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    var TWO_PI = Math.PI * 2.0;
    var ANGLE_INCR = Math.PI / 6;
    var cylY = 5.5 - length * 0.5;
    var x, z;
    var y = length / 2;
    var n = 0;
    var yIncr = length / ((TWO_PI / ANGLE_INCR) * nTwists);
    var helix = [];
    for (var phi = 0; phi <= TWO_PI * nTwists; phi = phi + ANGLE_INCR) {
      x = Math.cos(phi) * outerRadius;
      y = y - yIncr;
      z = Math.sin(phi) * outerRadius;
      helix.push(new THREE.Vector3(x, y, z));
      n++;
    }
    var curve = new THREE.CatmullRomCurve3(helix);
    this.geometry = new THREE.TubeGeometry(curve, n, innerRadius, 6, false);
  }
  setLength(length) {
    this.setGeometry(length, this.nTwists, this.outerRadius, this.innerRadius);
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
  var axes = new Axes();
  // SPRING
  var m = 1; // kg
  var k = 1;
  var length = 5;
  var nTwists = 6;
  var outerRadius = 1;
  var innerRadius = 0.05;
  spring = new Spring(m, k, length, nTwists, outerRadius, innerRadius);
  springMesh = new THREE.Mesh(spring.geometry, spring.material);
  springMesh.position.y = springMesh.position.y - length / 2;

  // Base
  var baseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.25, 3),
    new THREE.MeshLambertMaterial({ color: 0x888888 })
  );
  // Ball
  ballMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshLambertMaterial({ color: 0xff0000 })
  );
  ballMesh.position.y = -spring.length;

  // LIGHTS
  light = new THREE.AmbientLight();

  // CAMERAS
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 0, 18);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // SCENE
  scene = new THREE.Scene();
  scene.add(baseMesh);
  scene.add(ballMesh);
  scene.add(springMesh);
  scene.add(light);

  // INIT SIMULATION PARAMS
  x0 = 0;
  y0 = 0.1;
  t0 = 0;
  fps = 24;
  n = 100;

  // EVENT-HANDLERS
  window.addEventListener("resize", windowEventListener, false);

  // ACTION
  requestAnimationFrame(renderLoop);
}

function solveODEByEuler(x0, y0, t0, fps, n, m, k) {
  var t1 = t0 + 1 / fps;
  var h = (t1 - t0) / n;
  var x1, y1;
  for (var i = 1; i <= n; i++) {
    x1 = x0 + h * y0;
    y1 = y0 - ((h * k) / m) * x0;
    x0 = x1;
    y0 = y1;
  }
  return { x1: x1, y1: y1, t1: t1 };
}

function update() {
  var solution = solveODEByEuler(x0, y0, t0, fps, n, spring.m, spring.k);
  var springLength = spring.length + solution.x1;
  spring.setLength(springLength);
  scene.remove(springMesh);
  springMesh = new THREE.Mesh(spring.geometry, spring.material);
  springMesh.position.y =
    springMesh.position.y - springLength / 2 + solution.x1;
  scene.add(springMesh);
  ballMesh.position.y = -spring.length;
  x0 = solution.x1;
  y0 = solution.y1;
  t0 = solution.t1;
}

function renderLoop() {
  renderer.render(scene, camera);
  update();
  requestAnimationFrame(renderLoop);
}
