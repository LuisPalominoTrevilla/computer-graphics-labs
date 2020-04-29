"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;
var cube, sphere, plane;

function main() {
  // RENDERER
  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor("black");

  // MODELS
  // CUBE
  var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  var cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.x = -2;
  cube.position.y = 0.5;
  // SPHERE
  var sphereGeometry = new THREE.SphereGeometry(1, 10, 10);
  var sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: true,
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // PLANE
  var planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: "grey",
    wireframe: true,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);

  // MODEL TRANSFORM
  // CUBE
  cube.position.set(-1, 0.5, 0);
  cube.scale.set(2, 2, 2);
  // SPHERE
  sphere.position.set(1, 1, 2);
  // PLANE
  plane.rotation.x = -0.5 * Math.PI;

  // LIGHTS
  light = new THREE.AmbientLight();

  // CAMERAS
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(-3, 3, 10);
  camera.up = new THREE.Vector3(0, 1, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // SCENE
  scene = new THREE.Scene();
  scene.add(cube);
  scene.add(sphere);
  scene.add(plane);
  scene.add(camera);
  scene.add(light);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function renderLoop() {
  renderer.render(scene, camera);
  //mesh.rotation.x = mesh.rotation.x + 0.01;
  //mesh.rotation.y = mesh.rotation.y + 0.01;
  requestAnimationFrame(renderLoop);
}
