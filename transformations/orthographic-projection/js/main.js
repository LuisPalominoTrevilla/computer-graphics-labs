"use strict"
var canvas;	
var gl;		// WebGL rendering context
var vertices, indices;

function init()
{
	// Init Scene
	vertices = [0.,   0.5, 0.,	// X0, y0, z0
			   -0.5, -0.5, 0.,
			    0.5, -0.5, 0.
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
	//glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [-xCamera, -yCamera, -zCamera]);
	var xEyeCamera = 0.;
	var yEyeCamera = 0.;
	var zEyeCamera = 10.;
	var xTargetCamera = 0.;
	var yTargetCamera = 0.;
	var zTargetCamera = 0.;
	var xUpCamera = 0.;
	var yUpCamera = 1.;
	var zUpCamera = 0.;	
	var eyeCamera = [xEyeCamera, yEyeCamera, zEyeCamera];
	var targetCamera = [xTargetCamera, yTargetCamera, zTargetCamera];
	var upCamera = [xUpCamera, yUpCamera, zUpCamera];
	glMatrix.mat4.lookAt(cameraMatrix, eyeCamera, targetCamera, upCamera);
	gl.uniformMatrix4fv(uCameraMatrixLocation, false, cameraMatrix);
	// uProjMatrix
	// Orthogonal projection
	var left = -1.;
	var right = 1.;
	var bottom = -1.;
	var top = 1.;
	var near = 0.1;
	var far = 1000.;
	var projMatrix = glMatrix.mat4.create();
	glMatrix.mat4.ortho(projMatrix, left, right, bottom, top, near, far);
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
