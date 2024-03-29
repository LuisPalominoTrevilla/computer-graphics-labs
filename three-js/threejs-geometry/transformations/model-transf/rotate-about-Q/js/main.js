"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;
var mesh;
var theta = 0;
var deltaTheta = (1 * Math.PI) / 180;

function main() {
  // RENDERER
  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor("black");

  // MODEL
  // GEOMETRY
  var v0 = new THREE.Vector3(0, 0.5, 0);
  var v1 = new THREE.Vector3(-0.5, -0.5, 0);
  var v2 = new THREE.Vector3(0.5, -0.5, 0);
  var geometry = new THREE.Geometry();
  geometry.vertices.push(v0);
  geometry.vertices.push(v1);
  geometry.vertices.push(v2);
  var faces = new THREE.Face3(0, 1, 2);
  geometry.faces.push(faces);
  geometry.computeFaceNormals();
  // MATERIAL
  var material = new THREE.MeshBasicMaterial();
  // MESH (GEOMETRY + MATERIAL)
  mesh = new THREE.Mesh(geometry, material);

  // MODEL TRANSFORM
  // SCALE
  //mesh.rotation.set(0., 0., Math.PI/4.);

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
  console.log((theta * 180) / Math.PI + " deg.");
  var cosTheta = Math.cos(theta);
  var sinTheta = Math.sin(theta);
  var xq = -0.5;
  var yq = -0.5;
  var transformMatrix = new THREE.Matrix4();
  transformMatrix.set(
    cosTheta,
    sinTheta,
    0,
    0,
    -sinTheta,
    cosTheta,
    0,
    0,
    0,
    0,
    1,
    0,
    xq * (1 - cosTheta) + yq * sinTheta,
    yq * (1 - cosTheta) - xq * sinTheta,
    0,
    1
  );
  transformMatrix.transpose();
  mesh.applyMatrix4(transformMatrix);
  //mesh.geometry.verticesNeedUpdate = true;

  theta = (theta + deltaTheta) % (2 * Math.PI);

  //mesh.rotation.x = mesh.rotation.x + 0.01;
  //mesh.rotation.y = mesh.rotation.y + 0.01;
  requestAnimationFrame(renderLoop);
}
