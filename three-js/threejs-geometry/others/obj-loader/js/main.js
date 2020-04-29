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
  var geometry = new THREE.SphereGeometry(1, 100, 100);
  // JSON MODEL
  var loader = new OBJ2Loader();
  // load a resource
  loader.load(
    "models/utah-teapot.obj",
    function (obj) {
      // called when resource is loaded

      scene.add(obj);
    },
    function (xhr) {
      // called when loading is in progresses

      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (err) {
      // called when loading has errors

      console.log("An error happened");
    }
  );

  // MATERIAL
  var material = new THREE.MeshBasicMaterial();
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
  //scene.add(mesh);
  scene.add(camera);
  scene.add(light);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function handledload(geometry, materials) {
  mesh = new THREE.Mesh(geometry, material);

  // SCENE GRAPH
  scene.add(light);
  scene.add(mesh);
}

function renderLoop() {
  renderer.render(scene, camera);
  mesh.rotation.x = mesh.rotation.x + 0.01;
  mesh.rotation.y = mesh.rotation.y + 0.01;
  requestAnimationFrame(renderLoop);
}
