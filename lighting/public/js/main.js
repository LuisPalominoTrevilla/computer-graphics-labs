"use strict";
var canvas;
var renderer;
var scene;
var square, cube1, cube2, cube3, cube4, floor;
var camera;

class SquareGeometry extends THREE.Geometry {
  constructor(
    x0 = -0.5,
    y0 = 0.5,
    z0 = 0,
    x1 = -0.5,
    y1 = -0.5,
    z1 = 0,
    x2 = 0.5,
    y2 = -0.5,
    z2 = 0,
    x3 = 0.5,
    y3 = 0.5,
    z3 = 0
  ) {
    super();
    // Vertices
    var v0 = new THREE.Vector3(x0, y0, z0);
    var v1 = new THREE.Vector3(x1, y1, z1);
    var v2 = new THREE.Vector3(x2, y2, z2);
    var v3 = new THREE.Vector3(x3, y3, z3);
    var vertices = [];
    vertices.push(v0);
    vertices.push(v1);
    vertices.push(v2);
    vertices.push(v3);
    this.vertices = vertices;
    // Faces
    var face1 = new THREE.Face3(0, 1, 2);
    var face2 = new THREE.Face3(2, 3, 0);
    this.faces.push(face1);
    this.faces.push(face2);
    // Normals
    this.computeFaceNormals();
    // Texture Coords
    var tc0 = new THREE.Vector2(0, 1);
    var tc1 = new THREE.Vector2(0, 0);
    var tc2 = new THREE.Vector2(1, 0);
    var tc3 = new THREE.Vector2(1, 1);
    this.faceVertexUvs[0].push([tc0, tc1, tc2]);
    this.faceVertexUvs[0].push([tc2, tc3, tc0]);
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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  // MODELS
  cube1 = new THREE.Mesh(
    new THREE.CubeGeometry(),
    new THREE.MeshBasicMaterial({ color: "green" })
  );
  cube1.position.set(-4, 0.5, 0);

  cube2 = new THREE.Mesh(
    new THREE.CubeGeometry(),
    new THREE.MeshNormalMaterial()
  );
  cube2.position.set(-2, 0.5, 0);

  square = new THREE.Mesh(
    new SquareGeometry(),
    new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("imgs/red-brick.jpg"),
      side: THREE.DoubleSide,
    })
  );
  square.position.set(0, 0.5, 0);

  cube3 = new THREE.Mesh(
    new THREE.CubeGeometry(),
    new THREE.MeshLambertMaterial({ color: "red" })
  );
  cube3.position.set(2, 0.5, 0);
  cube3.receiveShadow = true;
  cube3.castShadow = true;

  cube4 = new THREE.Mesh(
    new THREE.CubeGeometry(),
    new THREE.MeshPhongMaterial({ color: "blue" })
  );
  cube4.position.set(4, 0.5, 0);

  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 10, 10),
    new THREE.MeshStandardMaterial()
  );
  floor.rotation.x = floor.rotation.x - Math.PI / 2;
  floor.receiveShadow = true;

  // LIGHTS
  var ambientLight = new THREE.AmbientLight("white", 0.5);
  var directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(0, 1.8, 5);
  directionalLight.target = square;
  directionalLight.castShadow = true;

  var spotLight = new THREE.SpotLight("white", 1, 0, Math.PI / 14, 0, 1);
  spotLight.position.set(0, 10, 0);
  spotLight.target = square;

  // CAMERAS
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 1.8, 5);
  camera.lookAt(new THREE.Vector3(0, 1.8, 0));

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // SCENE
  scene = new THREE.Scene();
  scene.add(floor);
  scene.add(cube1);
  scene.add(cube2);
  scene.add(square);
  scene.add(cube3);
  scene.add(cube4);
  //scene.add(ambientLight);
  scene.add(directionalLight);
  //scene.add(spotLight);

  // EVENT-HANDLERS
  window.addEventListener("resize", windowEventListener, false);

  // ACTION
  requestAnimationFrame(renderLoop); // RENDER LOOP
}

function update() {
  cube1.rotation.y = cube1.rotation.y + 0.01;
  cube2.rotation.y = cube2.rotation.y + 0.01;
  square.rotation.y = square.rotation.y + 0.01;
  cube3.rotation.y = cube3.rotation.y + 0.01;
  cube4.rotation.y = cube4.rotation.y + 0.01;
}

function renderLoop() {
  renderer.render(scene, camera);
  update();
  requestAnimationFrame(renderLoop);
}
