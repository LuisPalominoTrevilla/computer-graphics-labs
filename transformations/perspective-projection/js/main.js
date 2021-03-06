"use strict"
var canvas;	
var gl;		// WebGL rendering context
var vertices, indices;

function init()
{
	// Init Scene
	vertices = [0., 50, 0.,	// X0, y0, z0
			   -50, -50, 0.,
			    50, -50, 0.
			    ];

	indices =[0, 1, 2];

	// Init Parameters

	// Init Rendering
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");				// Get the WebGL rendering context (WebGL state machine)
	gl.clearColor(0., 0., 0., 1.);					// Set current color to clear buffers to BLACK
	gl.viewport(0, 0, canvas.width, canvas.height);	// Set the Viewport transformation

	// Init Shaders
	var shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
	gl.useProgram(shaderProgram);					// Set the current Shader Program to use

	// Init Buffers
	// VBO
	var vbo = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, vbo);				// Bind to a type of buffer
	var data = new Float32Array(vertices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer
	// IBO
	var ibo = gl.createBuffer();
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;	// Buffer type to storage float data
	gl.bindBuffer(bufferType, ibo);				// Bind to a type of buffer
	var data = new Uint16Array(indices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer

	// Init Shaders Data
	// Init Uniform variables
	// uModelMatrix
	var uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	var modelMatrix = glMatrix.mat4.create();	// M-model = I
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
	// uCameraMatrix
	var uCameraMatrixLocation = gl.getUniformLocation(shaderProgram, "uCameraMatrix");
	var cameraMatrix = glMatrix.mat4.create();	// M-camera = I
	const xEye = 0.;
	const yEye = 0.;
	const zEye = 500.;
	const eye = [xEye, yEye, zEye];
	const xTarget = 100.;
	const yTarget = 0.;
	const zTarget = 0.;
	const target = [xTarget, yTarget, zTarget];
	const xUp = 0.;
	const yUp = 1.;
	const zUp = 0.;
	const up = [xUp, yUp, zUp];
	glMatrix.mat4.lookAt(cameraMatrix, eye, target, up);
	gl.uniformMatrix4fv(uCameraMatrixLocation, false, cameraMatrix);
	// uProjMatrix
	var uProjMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjMatrix");
	var projMatrix = glMatrix.mat4.create();	// M-proj = I
	const fovy = 60. * Math.PI / 180.;
	const aspect = canvas.width / canvas.height;
	const near = 0.1;
	const far = 1000.;
	glMatrix.mat4.perspective(projMatrix, fovy, aspect, near, far);
	gl.uniformMatrix4fv(uProjMatrixLocation, false, projMatrix);

	// Init Attribute variables	
	// "aPosition" attribute
	gl.useProgram(shaderProgram);				// Set the current Shader Program to use
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, vbo);	// Bind to a type of buffer
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

function render()
{
	// Clear the Color Buffer now using the current clear color
	gl.clear(gl.COLOR_BUFFER_BIT);
				
	// Draw scene
	var primitiveType = gl.TRIANGLES;		// Primitive type to be rendered
	var count = indices.length;			// Number of elements (indices) to be rendered
	var type = gl.UNSIGNED_SHORT; 		// Value type in the element array buffer
	var offset = 0; 					// Bytes offset in the element array buffer
	gl.drawElements(primitiveType, count, type, offset);
}

function main()
{
	init();
	render();
}
