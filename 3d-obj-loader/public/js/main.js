"use strict"
var canvas;	
var gl;		// WebGL rendering context
var vertices, indices, indicesPOINTS, indicesLINES, indicesTRIANGLES;
var shaderProgram, vbo, ibo;
var xEye, yEye, zEye;
var xTarget, yTarget, zTarget;
var xUp, yUp, zUp;
var xEyeIni, yEyeIni, zEyeIni;
var xTargetIni, yTargetIni, zTargetIni;
var xUpIni, yUpIni, zUpIni;
var autoFocusOffset;
var magnitudOrder;
var drawingMode;
var sceneReady;
// Mouse's parameteres
var dragMode;
var dragging;		// Dragging or not
var xLast;			// Last position
var yLast;			
var rotX;			// Acumlulation
var rotY;

function init(modelData)
{
	// Init Parameters
    magnitudOrder = 1.;
    autoFocusOffset = 0.5;
	drawingMode = "WIREFRAME";
	sceneReady = false;
	xEye = 0.;
	yEye = 0.;
	zEye = 1.;
	xTarget = 0.;
	yTarget = 0.;
	zTarget = 0.;
	xUp = 0.;
	yUp = 1.0;
	zUp = 0.0;
	xEyeIni = xEye;
	yEyeIni = yEye;
	zEyeIni = zEye;
	xTargetIni = xTarget;
	yTargetIni = yTarget;
	zTargetIni = zTarget;
	xUpIni = xUp;
	yUpIni = yUp;
	zUpIni = zUp;
	dragMode = "ROTATE";
	dragging = false;	// Dragging or not
	xLast = 0;			// Last position
	yLast = 0;			
	rotX = 0.;			// Acumlulation
	rotY = 0.;

	var mesh = new OBJ.Mesh(modelData);
	vertices = mesh.vertices;
	indices = mesh.indices;
	indicesPOINTS = indices;
	indicesTRIANGLES = indices;

	// indices for WIREFRAME
	indicesLINES = [];
	for(var i = 0; i < indices.length; i = i + 3)
	{
		indicesLINES.push(indices[i]);
	    indicesLINES.push(indices[i+1]);
	    indicesLINES.push(indices[i+1]);
	    indicesLINES.push(indices[i+2]);
	    indicesLINES.push(indices[i+2]);
	    indicesLINES.push(indices[i]);
	}
	indices = indicesLINES;	// Default
    sceneReady = true;

    autoFocus();
    xEyeIni = xEye;
	yEyeIni = yEye;
	zEyeIni = zEye;
	xTargetIni = xTarget;
	yTargetIni = yTarget;
	zTargetIni = zTarget;
	xUpIni = xUp;
	yUpIni = yUp;
	zUpIni = zUp;

	// Init Buffers
	// VBO
	vbo = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, vbo);				// Bind to a type of buffer
	var data = new Float32Array(vertices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer
	// IBO
	ibo = gl.createBuffer();
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

	requestAnimationFrame(render);
}

function render()
{
	// Clear the Color Buffer now using the current clear color
	gl.clear(gl.COLOR_BUFFER_BIT);
				
	// Draw scene
	var primitiveType = gl.TRIANGLES;
	if(drawingMode == "POINTS")
	{
		primitiveType = gl.POINTS;
	}
	else if(drawingMode == "WIREFRAME")
	{
		primitiveType = gl.LINES;
	}
	// Primitive type to be rendered
	var count = indices.length;			// Number of elements (indices) to be rendered
	var type = gl.UNSIGNED_SHORT; 		// Value type in the element array buffer
	var offset = 0; 					// Bytes offset in the element array buffer
	gl.drawElements(primitiveType, count, type, offset);

	requestAnimationFrame(render);	// call next frame
}

function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);

	} else if (typeof XDomainRequest != "undefined") {
		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}
	return xhr;
}

function readTextFile(file, callback) {
  console.log(file);
	var request = createCORSRequest('GET', file);
	request.onreadystatechange = function() 
								 {
									if (request.readyState === 4 && request.status == "200") 
									{
										callback(request.responseText);
									}
    							};
    request.send(null);
}

function loadModel(fileName, callback)
{
	readTextFile(fileName, callback);
}

function main()
{
	// Init Rendering Context
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");				// Get the WebGL rendering context (WebGL state machine)
	gl.clearColor(0., 0., 0., 1.);					// Set current color to clear buffers to BLACK
	gl.viewport(0, 0, canvas.width, canvas.height);	// Set the Viewport transformation
	// Clear the Color Buffer now using the current clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Init Shaders
	shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
	gl.useProgram(shaderProgram);					// Set the current Shader Program to use

	// Init Events
	initEventHandler();
}
