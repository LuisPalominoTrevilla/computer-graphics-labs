"use strict"
var canvas;	
var gl;		// WebGL rendering context
var vertices, indices, vertices1x, vertices10x, vertices100x, vertices1000x;
var shaderProgram, vbo;
var xEye, yEye, zEye;
var xTarget, yTarget, zTarget;
var xUp, yUp, zUp;
var xEyeIni, yEyeIni, zEyeIni;
var xTargetIni, yTargetIni, zTargetIni;
var xUpIni, yUpIni, zUpIni;
var panX, panY, zoom;	// current values
var magnitudOrder;
var stepFactor;

function init()
{
	// Init Scene
	vertices1x = [0., 0.5, 0.,	// X0, y0, z0
			    -0.5, -0.5, 0.,
			     0.5, -0.5, 0.
			    ];
	vertices10x = [0., 5., 0.,	// X0, y0, z0
			    -5., -5., 0.,
			     5., -5., 0.
			    ];
	vertices100x = [0., 50., 0.,	// X0, y0, z0
			    -50., -50., 0.,
			     50., -50, 0.
			    ];
	vertices1000x = [0., 500., 0.,	// X0, y0, z0
			    -500., -500., 0.,
			     500., -500., 0.
			    ];
	vertices = vertices1x;

	indices =[0, 1, 2];

	// Init Parameters
    magnitudOrder = 0.1;
    stepFactor = 0.1;
	xEyeIni = 0.;
	yEyeIni = 0.;
	zEyeIni = 1.;
	xTargetIni = 0.;
	yTargetIni = 0.;
	zTargetIni = 0.;
	xUpIni = 0.;
	yUpIni = 1.0;
	zUpIni = 0.0;
	xEye = xEyeIni;
	yEye = yEyeIni;
	zEye = zEyeIni;
	xTarget = xTargetIni;
	yTarget = yTargetIni;
	zTarget = zTargetIni;
	xUp = xUpIni;
	yUp = yUpIni;
	zUp = zUpIni;
	panX = 0.;
	panY = 0.;
	zoom = 0.;
	// Init Rendering
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");				// Get the WebGL rendering context (WebGL state machine)
	gl.clearColor(0., 0., 0., 1.);					// Set current color to clear buffers to BLACK
	gl.viewport(0, 0, canvas.width, canvas.height);	// Set the Viewport transformation

	// Init Shaders
	shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
	gl.useProgram(shaderProgram);					// Set the current Shader Program to use

	// Init Buffers
	// VBO
	vbo = gl.createBuffer();
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
	autoFocus();
	updateCamera();
	
	// uProjMatrix
	// Perspective projection
	var fovy = 60. * Math.PI / 180.;
	var aspect = canvas.width / canvas.height;
	var near = 0.1;
	var far = 10000.;
	var projMatrix = glMatrix.mat4.create();
	glMatrix.mat4.perspective(projMatrix, fovy, aspect, near, far);
	var uProjMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjMatrix");
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
	
	updateGUI();

	// Init Events
	initEventHandler();
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
