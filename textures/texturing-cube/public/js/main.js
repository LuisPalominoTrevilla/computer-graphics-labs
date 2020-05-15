"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;

function main() {
  // CANVAS
  canvas = document.getElementById("canvas");
  resizeCanvas(); // Set canvas size for the first time

  // RENDERER
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor("black");

  // MODEL
  // GEOMETRY

  var geometry = new THREE.CubeGeometry();
  // MATERIAL
  // load a texture, set wrap mode to repeat
  /**var texture = new THREE.TextureLoader().load("imgs/happy-face.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    //texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);*/

  var cubeMaterials = [
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("imgs/rocks.jpg"),
      side: THREE.BackSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("imgs/happy-face.jpg"),
      side: THREE.FrontSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("imgs/red-brick.jpg"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("imgs/green-grass.jpg"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("imgs/sirewall.jpg"),
      side: THREE.BackSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("imgs/water.jpg"),
      side: THREE.DoubleSide,
    }),
  ];

  //var material = new THREE.MeshFaceMaterial(cubeMaterials);

  // MESH (GEOMETRY + MATERIAL)
  var mesh = new THREE.Mesh(geometry, cubeMaterials);

  // LIGHTS
  light = new THREE.AmbientLight();

  // CAMERAS
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 0, 3);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // SCENE
  scene = new THREE.Scene();
  scene.add(mesh);
  scene.add(light);

  // EVENT-HANDLERS
  window.addEventListener("resize", windowEventListener, false);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function renderLoop() {
  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
}
