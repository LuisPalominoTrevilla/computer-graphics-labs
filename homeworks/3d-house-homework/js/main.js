"use strict";
var canvas;
var gl; // WebGL rendering context
var vertices, indices;
var orbitCamera;
var theta, deltaTheta;
var xEye, yEye, zEye;
var xTarget, yTarget, zTarget;
var radious;
var shaderProgram;

function init() {
  // Init Scene
  vertices = [
    -2.7, -2, 2,
    2.7, -2, 2,
    2.7, -2, -2,
    -2.7, -2, -2,
    -2.7, 1, 2,
    2.7, 1, 2,
    2.7, 1, -2,
    -2.7, 1, -2,
    // Roof vertices
    0, 3, -2,
    0, 3, 2,
    // Door vertices
    -.3, -2, 2,
    -.3, -1, 2,
    .3, -1, 2,
    .3, -2, 2,
    // Garage vertices
    2.7, -2, 1,
    5.3, -2, 1,
    5.3, -2, -1,
    5.3, 0, -1,
    5.3, 0, 1,
    2.7, 0, 1,
    2.7, 0, -1,
    2.7, -2, -1,
    4, 0.6, -1,
    4, 0.6, 1
  ];

  indices = [0, 1, 10, 11, 12, 13, 1, 2,
    14, 15, 16, 17, 18, 15, 16, 21, 20, 17, 20, 19, 23, 18, 19, 23, 22, 20, 22, 17, 18, 23, 19, 14, 2,
    3, 0, 4, 5, 1, 5, 6, 2, 6, 7, 3, 7, 4, 9, 5, 9, 8, 6, 8, 7];

  // Init Parameters
  orbitCamera = false;
  theta = 0;
  deltaTheta = (3 * Math.PI) / 180;
  xEye = 0;
  yEye = 0;
  zEye = 11;
  xTarget = 0;
  yTarget = 0;
  zTarget = 0;
  radious = zEye;

  // Init Rendering
  canvas = document.getElementById("canvas");
  gl = canvas.getContext("webgl"); // Get the WebGL rendering context (WebGL state machine)
  gl.clearColor(0, 0, 0, 1); // Set current color to clear buffers to BLACK
  gl.viewport(0, 0, canvas.width, canvas.height); // Set the Viewport transformation

  // Init Shaders
  shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
  gl.useProgram(shaderProgram); // Set the current Shader Program to use

  // Init Buffers
  // VBO
  var vbo = gl.createBuffer();
  var bufferType = gl.ARRAY_BUFFER; // Buffer type to storage float data
  gl.bindBuffer(bufferType, vbo); // Bind to a type of buffer
  var data = new Float32Array(vertices); // Data to be storage in a Buffer (a raw device)
  var usage = gl.STATIC_DRAW; // Used for drawing optimization
  gl.bufferData(bufferType, data, usage); // Load data into the Buffer
  // IBO
  var ibo = gl.createBuffer();
  var bufferType = gl.ELEMENT_ARRAY_BUFFER; // Buffer type to storage float data
  gl.bindBuffer(bufferType, ibo); // Bind to a type of buffer
  var data = new Uint16Array(indices); // Data to be storage in a Buffer (a raw device)
  var usage = gl.STATIC_DRAW; // Used for drawing optimization
  gl.bufferData(bufferType, data, usage); // Load data into the Buffer

  // Init Shaders Data
  // Init Uniform variables
  // uModelMatrix
  var uModelMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "uModelMatrix"
  );
  var modelMatrix = glMatrix.mat4.create(); // M-model = I
  gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
  // uCameraMatrix
  var uCameraMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "uCameraMatrix"
  );
  var cameraMatrix = glMatrix.mat4.create(); // M-camera = I
  var eye = [xEye, yEye, zEye];
  var target = [xTarget, yTarget, zTarget];
  var up = [0, 1, 0];
  glMatrix.mat4.lookAt(cameraMatrix, eye, target, up);
  gl.uniformMatrix4fv(uCameraMatrixLocation, false, cameraMatrix);
  // uProjMatrix
  // Perspective projection
  var fovy = (60 * Math.PI) / 180;
  var aspect = canvas.width / canvas.height;
  var near = 0.1;
  var far = 1000;
  var projMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projMatrix, fovy, aspect, near, far);
  var uProjMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjMatrix");
  gl.uniformMatrix4fv(uProjMatrixLocation, false, projMatrix);
  // Init Attribute variables
  // "aPosition" attribute
  gl.useProgram(shaderProgram); // Set the current Shader Program to use
  var bufferType = gl.ARRAY_BUFFER; // Buffer type to storage float data
  gl.bindBuffer(bufferType, vbo); // Bind to a type of buffer
  var aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition"); // Locate attribute position
  var index = aPositionLocation; // index of the attribute location
  var size = 3; // The number of components per attribute
  var type = gl.FLOAT; // The data type of each component
  var normalized = false; // Whether integer values should be normalized
  var stride = 0; // Offset in bytes between consecutive attributes
  var offset = 0; // Offset in bytes of the first attribute
  gl.vertexAttribPointer(index, size, type, normalized, stride, offset); // Tell Vertex Shader how to retrieve data from the Buffer
  gl.enableVertexAttribArray(aPositionLocation); // Enable attribute

  // Init Events
  initEventHandler();
}

function render() {
  // Clear the Color Buffer now using the current clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw scene
  var primitiveType = gl.LINE_STRIP; // Primitive type to be rendered
  var count = indices.length; // Number of elements (indices) to be rendered
  var type = gl.UNSIGNED_SHORT; // Value type in the element array buffer
  var offset = 0; // Bytes offset in the element array buffer
  gl.drawElements(primitiveType, count, type, offset);

  if (orbitCamera) {
    // scene update
    theta += deltaTheta;
    xEye = radious * Math.sin(theta);
    zEye = radious * Math.cos(theta);
  }

  // Update camera values in html
  document.getElementById("label-xEye").innerHTML = xEye.toFixed(1);
  document.getElementById("label-yEye").innerHTML = yEye.toFixed(1);
  document.getElementById("label-zEye").innerHTML = zEye.toFixed(1);

  document.getElementById("label-xTarget").innerHTML = xTarget.toFixed(1);
  document.getElementById("label-yTarget").innerHTML = yTarget.toFixed(1);
  document.getElementById("label-zTarget").innerHTML = zTarget.toFixed(1);

  const eye = [xEye, yEye, zEye];
  const target = [xTarget, yTarget, zTarget];
  const up = [0, 1, 0];
  const uCameraMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "uCameraMatrix"
  );
  const cameraMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(cameraMatrix, eye, target, up);
  gl.uniformMatrix4fv(uCameraMatrixLocation, false, cameraMatrix);

  requestAnimationFrame(render);
}

function main() {
  init();
  requestAnimationFrame(render); // render loop
}
