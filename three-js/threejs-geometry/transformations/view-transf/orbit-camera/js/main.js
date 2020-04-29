"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;
var mesh;
var x = 0;
var z = 5;
var theta = 0;
var deltaTheta = 0.01;

function main() {
  // RENDERER
  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor("black");

  // MODEL
  // GEOMETRY
  var geometry = new THREE.BoxGeometry();
  // MATERIAL
  var material = new THREE.MeshNormalMaterial();
  // MESH (GEOMETRY + MATERIAL)
  mesh = new THREE.Mesh(geometry, material);

  // LIGHTS
  light = new THREE.AmbientLight();

  // CAMERAS
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(x, 0, z); // Eye
  camera.lookAt(0, 0, 0); // Target
  camera.up.set(0, 1, 0); // Up

  // SCENE
  scene = new THREE.Scene();
  scene.add(mesh);
  scene.add(camera);
  scene.add(light);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function renderLoop() {
  x = 5 * Math.sin(theta);
  z = 5 * Math.cos(theta);
  theta = theta + deltaTheta;
  camera.position.set(x, 0, z);
  camera.lookAt(0, 0, 0); // Target
  camera.up.set(0, 1, 0); // Up
  renderer.render(scene, camera);
  //mesh.rotation.x = mesh.rotation.x + 0.01;
  //mesh.rotation.y = mesh.rotation.y + 0.01;
  requestAnimationFrame(renderLoop);
}
