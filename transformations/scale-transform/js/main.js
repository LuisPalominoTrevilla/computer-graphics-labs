"use strict"
var canvas;	
var gl;		// WebGL rendering context
var vertices, verticesTriangle, verticesSquare;
var indices, indicesTriangle, indicesSquare;
var shaderProgram;
var vbo, ibo;
var sx;
var sy;
var triangularGeometry;
var scaleAboutOrigin;
var simetricScale;

function loadBuffers() {
	//Load data to VBO
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, vbo);				// Bind to a type of buffer
	var data = new Float32Array(vertices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer
	
	// Load data to IBO
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;	// Buffer type to storage float data
	gl.bindBuffer(bufferType, ibo);				// Bind to a type of buffer
	var data = new Uint16Array(indices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer
}

function geometricCenter() {
	let qx, qy;
	if (triangularGeometry) {
		qx = (vertices[0] + vertices[3] + vertices[6]) / 3.;
		qy = (vertices[1] + vertices[4] + vertices[7]) / 3.;
	} else {
		qx = Math.abs(vertices[0] - vertices[3]) / 2.
		qy = Math.abs(vertices[4] - vertices[7]) / 2.
	}
	return {qx, qy};
}

function init()
{
	// Init Scene
	verticesTriangle = [0., 0., 0.,	// X0, y0, z0
			   			0.5, 0., 0.,
			    		0., 0.5, 0.
			    		];
	verticesSquare = [0., 0., 0.,	// X0, y0, z0
			   		  0.5, 0., 0.,
			   		  0.5, 0.5, 0.,
			    	   0., 0.5, 0.
			    		];

	indicesTriangle =[0, 1, 2];
	indicesSquare = [0, 1, 2, 2, 3, 0];

	// Init Parameters
	vertices = verticesTriangle;
	indices = indicesTriangle;
	sx = 1.;
	sy = 1.;
	triangularGeometry = true;
	scaleAboutOrigin = false;
	simetricScale = true;

	// Init Rendering
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");				// Get the WebGL rendering context (WebGL state machine)
	gl.clearColor(0., 0., 0., 1.);					// Set current color to clear buffers to BLACK
	gl.viewport(0, 0, canvas.width, canvas.height);	// Set the Viewport transformation

	// Init Shaders
	shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
	gl.useProgram(shaderProgram);					// Set the current Shader Program to use

	// Init Buffers
	vbo = gl.createBuffer();
	ibo = gl.createBuffer();
	
	loadBuffers();

	// Init Shaders Data
	// Init Uniform variables
	var uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	var modelMatrix = glMatrix.mat4.create();	// mModel = I
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
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
