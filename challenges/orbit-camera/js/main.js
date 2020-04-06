"use strict"
var canvas;	
var gl;		// WebGL rendering context
var vertices, indices;
var shaderProgram, vbo;
var xEye, yEye, zEye;
var xTarget, yTarget, zTarget;
var xUp, yUp, zUp;
var xEyeIni, yEyeIni, zEyeIni;
var xTargetIni, yTargetIni, zTargetIni;
var xUpIni, yUpIni, zUpIni;
var radiusCameraIni;
var theta, thetaIni, deltaTheta;
var orbitCamera;

function init()
{
	// Init Scene
	/**vertices = [0., 0.5, 0.,	// X0, y0, z0
			    -0.5, -0.5, 0.,
			     0.5, -0.5, 0.
			    ];

	indices =[0, 1, 2];*/

	vertices = [ -1., 0., -1., 	// V0
		         		-1., 0., 1.,	// v1
			    		 1., 0., 1.,	// V2
			     		 1., 0., -1.,	// V3
			     		 0., 1., 0.	// V4
			   		  ];

	indices = [0, 1, 2, 3, 0, 4, 3, 2, 4, 1];

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
	radiusCameraIni = Math.sqrt(Math.pow(xTargetIni - xEyeIni, 2.) + Math.pow(yTargetIni - yEyeIni, 2.) + Math.pow(zTargetIni - zEyeIni, 2.));
	xEye = xEyeIni;
	yEye = yEyeIni;
	zEye = zEyeIni;
	xTarget = xTargetIni;
	yTarget = yTargetIni;
	zTarget = zTargetIni;
	xUp = xUpIni;
	yUp = yUpIni;
	zUp = zUpIni;
	thetaIni = Math.atan(xEyeIni / zEyeIni);
	theta = thetaIni;
	deltaTheta = 5. * Math.PI / 180.;
	orbitCamera = false;
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
	radiusCameraIni = Math.sqrt(Math.pow(xTargetIni - xEyeIni, 2.) + Math.pow(yTargetIni - yEyeIni, 2.) + Math.pow(zTargetIni - zEyeIni, 2.));
	thetaIni = Math.atan(xEyeIni / zEyeIni);
	theta = thetaIni;
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
	var primitiveType = gl.LINE_STRIP;		// Primitive type to be rendered
	var count = indices.length;			// Number of elements (indices) to be rendered
	var type = gl.UNSIGNED_SHORT; 		// Value type in the element array buffer
	var offset = 0; 					// Bytes offset in the element array buffer
	gl.drawElements(primitiveType, count, type, offset);

	if(orbitCamera)
	{
		theta = (theta + deltaTheta) % (2. * Math.PI);
		xEye = radiusCameraIni * Math.sin(theta);	
		zEye = radiusCameraIni * Math.cos(theta);
		updateCamera();	
		updateGUI();
	}

	requestAnimationFrame(render);	// call next frame
}

function main()
{
	init();
	requestAnimationFrame(render);	// render loop
}
