"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;
var cube;

class Cube extends THREE.Mesh {
  constructor() {
    super(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
  }
}

function main() {
  //RENDERER
  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor("black");

  scene = new THREE.Scene(); // SCENE

  var geometry = new THREE.BoxGeometry(); // GEOMETRY

  var material = new THREE.MeshBasicMaterial(); // MATERIAL*/

  //var cube = new Cube();

  //mesh = new THREE.Mesh(geometry, material);      // MESH
  cube = new Cube();

  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 0, 5);

  light = new THREE.AmbientLight(); // LIGHTS

  scene.add(cube); // SCENE GRAPH
  scene.add(camera);
  scene.add(light);

  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function renderLoop() {
  renderer.render(scene, camera);
  cube.rotation.x = cube.rotation.x + 0.01;
  cube.rotation.y = cube.rotation.y + 0.01;
  requestAnimationFrame(renderLoop);
}
