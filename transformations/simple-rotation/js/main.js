"use strict"
var canvas;	
var gl;		// WebGL rendering context
var vertices, indices;
var theta;
var deltaTheta;
var shaderProgram;

const { mat4 } = glMatrix;

function init()
{
	// Init Scene
	vertices = [0., 0.5, 0.,	// X0, y0, z0
			   -0.5, -0.5, 0.,
			    0.5, -0.5, 0.];

	indices =[0, 1, 2];

  // Init Parameters
  theta = 0.;
  deltaTheta = .05;

	// Init Rendering
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");				// Get the WebGL rendering context (WebGL state machine)
	gl.clearColor(0., 0., 0., 1.);					// Set current color to clear buffers to BLACK
	gl.viewport(0, 0, canvas.width, canvas.height);	// Set the Viewport transformation

	// Init Shaders
  shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
	gl.useProgram(shaderProgram);					// Set the current Shader Program to use

	// Init Buffers
	// Position Buffer
	var positionBuffer = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, positionBuffer);				// Bind to a type of buffer
	var data = new Float32Array(vertices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer
	// Index Buffer Object (IBO)
	var ibo = gl.createBuffer();
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;	// Buffer type to storage float data
	gl.bindBuffer(bufferType, ibo);				// Bind to a type of buffer
	var data = new Uint16Array(indices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer

  // Init Shaders Data
  // Init Uniform variables
  const modelMatrix = mat4.create(); // Mmodel = I
  // const theta = 90 * Math.PI / 180.;
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const newMat = mat4.create();
  // mat4.set(newMat, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  mat4.rotate(modelMatrix, modelMatrix, theta, [0., 0., 1.]);

	const uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);

	// Init Attribute variables	
	// "aPosition" attribute
	gl.useProgram(shaderProgram);				// Set the current Shader Program to use
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, positionBuffer);	// Bind to a type of buffer
	var aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");	// Locate attribute position
	var index = aPositionLocation;				// index of the attribute location
	var size = 3; 								// The number of components per attribute
	var type = gl.FLOAT; 						// The data type of each component
	var normalized = false; 					// Whether integer values should be normalized
	var stride = 0; 							// Offset in bytes between consecutive attributes
	var offset = 0;								// Offset in bytes of the first attribute
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset); // Tell Vertex Shader how to retrieve data from the Buffer
	gl.enableVertexAttribArray(aPositionLocation);	// Enable attribute
	
	// Init Events
}

function update() {
  theta = theta + deltaTheta;

  const modelMatrix = mat4.create(); // Mmodel = I
  // mat4.set(modelMatrix, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  mat4.rotate(modelMatrix, modelMatrix, theta, [0., 0., 1.]);

	const uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
}

function render()
{
  console.log('Hello');
	// Clear the Color Buffer now using the current clear color
	gl.clear(gl.COLOR_BUFFER_BIT);
				
	// Draw scene
	var primitiveType = gl.TRIANGLES;		// Primitive type to be rendered
	var count = indices.length;			// Number of elements (indices) to be rendered
	var type = gl.UNSIGNED_SHORT; 		// Value type in the element array buffer
	var offset = 0; 					// Bytes offset in the element array buffer
  gl.drawElements(primitiveType, count, type, offset);
  
  update();
  requestAnimationFrame(render); // call next frame
}

function main()
{
  init();
	requestAnimationFrame(render); // render loop
}
