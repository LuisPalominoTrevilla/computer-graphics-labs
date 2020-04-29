"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;
var snowMan, plane;

function main() {
  // RENDERER
  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor("black");

  // MODELS
  // BIG SPHERE
  var bigSphereGeometry = new THREE.SphereGeometry(1, 10, 10);
  var bigSphereMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
  var bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
  // LITTLE SPHERE
  var littleSphereGeometry = new THREE.SphereGeometry(1, 10, 10);
  var littleSphereMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
  var littleSphere = new THREE.Mesh(littleSphereGeometry, littleSphereMaterial);
  // PLANE
  var planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: "grey",
    wireframe: true,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);

  // MODEL TRANSFORM
  bigSphere.position.set(0, 0, 0);
  // LITTLE SPHERE
  littleSphere.position.set(0, 1.5, 0);
  littleSphere.scale.set(0.5, 0.5, 0.5);

  // GROUP
  snowMan = new THREE.Group();
  snowMan.add(bigSphere);
  snowMan.add(littleSphere);

  // GROUP TRANSFORM
  snowMan.position.set(1, 0, 1);
  snowMan.scale.set(2, 2, 2);

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
  scene.add(snowMan);
  scene.add(plane);
  scene.add(camera);
  scene.add(light);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function renderLoop() {
  renderer.render(scene, camera);
  snowMan.rotation.y = snowMan.rotation.y + 0.01;
  //mesh.rotation.y = mesh.rotation.y + 0.01;
  requestAnimationFrame(renderLoop);
}
