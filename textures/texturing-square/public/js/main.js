"use strict";
var canvas;
var renderer;
var scene;
var camera;
var light;

class SquareGeometry extends THREE.Geometry {
  constructor(
    x0 = -1,
    y0 = 1,
    z0 = 0,
    x1 = -1,
    y1 = -1,
    z1 = 0,
    x2 = 1,
    y2 = -1,
    z2 = 0,
    x3 = 1,
    y3 = 1,
    z3 = 0
  ) {
    super();
    // Vertices
    var p0 = new THREE.Vector3(x0, y0, z0);
    var p1 = new THREE.Vector3(x1, y1, z1);
    var p2 = new THREE.Vector3(x2, y2, z2);
    var p3 = new THREE.Vector3(x3, y3, z3);
    var vertices = [];
    vertices.push(p0);
    vertices.push(p1);
    vertices.push(p2);
    vertices.push(p3);
    this.vertices = vertices;
    // Faces
    var face1 = new THREE.Face3(0, 1, 2);
    var face2 = new THREE.Face3(2, 3, 0);
    this.faces.push(face1);
    this.faces.push(face2);
    // Normals
    this.computeFaceNormals();
    // Texture Coords
    var ct0 = new THREE.Vector3(0, 1);
    var ct1 = new THREE.Vector3(0, 0);
    var ct2 = new THREE.Vector3(1, 0);
    var ct3 = new THREE.Vector3(1, 1);
    this.faceVertexUvs[0].push([ct0, ct1, ct2]);
    this.faceVertexUvs[0].push([ct2, ct3, ct0]);
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

  // MODEL
  // GEOMETRY
  var geometry = new SquareGeometry();
  // MATERIAL
  var texture = new THREE.TextureLoader().load("imgs/happy-face.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(9, 10);

  var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

  // MESH (GEOMETRY + MATERIAL)
  var mesh = new THREE.Mesh(geometry, material);

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
