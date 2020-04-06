"use strict"
var canvas;	
var gl;		// WebGL rendering context
var vertices, indices;
var verticesPyramid, verticesCube, verticesLittleHouse;
var indicesPyramid, indicesCube, indicesLittleHouse;
var shaderProgram, vbo;
var xEye, yEye, zEye;
var xTarget, yTarget, zTarget;
var xUp, yUp, zUp;
var xEyeIni, yEyeIni, zEyeIni;
var xTargetIni, yTargetIni, zTargetIni;
var xUpIni, yUpIni, zUpIni;
var theta, deltaTheta;
var cameraRadius;

function init()
{
	// Init Scene
	// Pyramid Model
	verticesPyramid = [ -1., 0., -1., 	// V0
		         		-1., 0., 1.,	// v1
			    		 1., 0., 1.,	// V2
			     		 1., 0., -1.,	// V3
			     		 0., 1., 0.	// V4
			   		  ];

	indicesPyramid = [0, 1, 2, 3, 0, 4, 3, 2, 4, 1];

	// Cube Mode
	verticesCube = [1., 1., 1., // V0
			   	   -1., 1., 1., // v1
			       -1.,-1., 1.,  // V2
			        1., -1.,1.,
				    1., -1., -1.,
				    1., 1., -1.,
				   -1., 1., -1.,
				   -1., -1., -1.
				  ];

	indicesCube = [0, 1, 2,  0, 2, 3, 	// Front face
				   0, 3, 4,  0, 4, 5,	// Right face
				   0, 5, 6,  0, 6, 1,	// Top face
				   1, 6, 7,  1, 7, 2,	// Left face
				   7, 4, 3,  7, 3, 2,	// Bottom face
				   4, 7, 6,  4, 6, 5	// Back face
				  ];

	// Little House Model
	verticesLittleHouse = [0.0,  1.0,  0.5,
				   -0.5,  0.5,  0.5,
				   -0.5,  0.0,  0.5,
				    0.5,  0.0,  0.5,
				    0.5,  0.5,  0.5,
				    0.0,  1.0, -0.5,
				    -0.5,  0.5, -0.5,
				    -0.5,  0.0, -0.5,
				    0.5,  0.0, -0.5,
				    0.5,  0.5, -0.5,
				    0.0,  1.0,  0.5,
				    -0.5,  0.5,  0.5,
				    0.5,  0.5,  0.5,
				    0.0,  1.0, -0.5,
				    -0.5,  0.5, -0.5,
				    0.5,  0.5, -0.5
				    ];

	indicesLittleHouse = [1,2,3,4,1,6,7,2,3,8,7,6,9,8,7,6,9,5,6,1,0,5,6,5,0,4,9,5];

	// Init Parameters

	vertices = verticesPyramid;
	indices = indicesPyramid;

	// Init Parameters
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
	theta = Math.atan(xEyeIni/zEyeIni);
	deltaTheta = 1. * Math.PI / 180.;
	cameraRadius = Math.sqrt(Math.pow(xEyeIni-xTargetIni,2.) + Math.pow(yEyeIni-yTargetIni,2.) + Math.pow(zEyeIni-zTargetIni,2.));

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
	theta = Math.atan(xEyeIni/zEyeIni);
	cameraRadius = Math.sqrt(Math.pow(xEyeIni-xTargetIni,2.) + Math.pow(yEyeIni-yTargetIni,2.) + Math.pow(zEyeIni-zTargetIni,2.));
	
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
	var primitiveType = gl.LINE_STRIP;		// Primitive type to be rendered
	var count = indices.length;			// Number of elements (indices) to be rendered
	var type = gl.UNSIGNED_SHORT; 		// Value type in the element array buffer
	var offset = 0; 					// Bytes offset in the element array buffer
	gl.drawElements(primitiveType, count, type, offset);

	// update scene
	theta = (theta + deltaTheta) % (2. * Math.PI);
	xEye = cameraRadius * Math.sin(theta);
	zEye = cameraRadius * Math.cos(theta);
	updateCamera();

	requestAnimationFrame(render);
}

function main()
{
	init();
	requestAnimationFrame(render);
}
