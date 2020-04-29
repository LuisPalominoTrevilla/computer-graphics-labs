"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;
var mesh;

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
  var material = new THREE.MeshBasicMaterial({
    wireframe: true,
  });
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
  camera.position.set(0, 0, 5);

  // SCENE
  scene = new THREE.Scene();
  scene.add(mesh);
  scene.add(camera);
  scene.add(light);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function renderLoop() {
  renderer.render(scene, camera);
  mesh.rotation.x = mesh.rotation.x + 0.01;
  mesh.rotation.y = mesh.rotation.y + 0.01;
  requestAnimationFrame(renderLoop);
}
