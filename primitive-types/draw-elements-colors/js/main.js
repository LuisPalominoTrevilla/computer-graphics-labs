"use strict"
var canvas;	
var gl;			// WebGL context
var vertices;	// 3D-model (scene)
var indices;
var colors;

function init()
{
	// Init Scene
	vertices = [
		-0.5, -0.5, 0., // x0, y0, z0
		0, -0.5, 0.,
		0.5, -0.5, 0.,
		0.25, 0., 0.,
		0., 0.5, 0.,
		-0.25, 0., 0.
	];
	colors = [
		1., 0., 0., 1., // r, g, b, a
		0., 1., 0., 1.,
		0., 0., 1., 1.,
		1., 0., 1., 1.,
		1., 1., 0., 1.,
		1., 1., 1., 1.
	];
	indices = [0, 1, 2, 3, 4, 5]; // POINTS
	indices = [0,1 , 1,2, 2,3, 3,4, 4,5, 5,0, 5,3, 5,1, 1,3]; // LINES
	indices = [0,1,5, 1,2,3, 5,3,4, 1,3,5];

	// Init WebGL rendering context
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");

	// Init Shader Program
	var shaderProgram = createShaderProgram("vertexShader", "fragmentShader");

	// Init Buffers

	// Vertex (position) Buffer Object (VBO)
	var positionsBuffer = gl.createBuffer();
	// Bind Buffer to a data type
	var bufferType = gl.ARRAY_BUFFER;	// for float data type (vertices)
	gl.bindBuffer(bufferType, positionsBuffer);
	// Write data into a Buffer
	var bufferType = gl.ARRAY_BUFFER;	// for float data type (vertices)
	var data = new Float32Array(vertices);	// data to write into the buffer
	var usage = gl.STATIC_DRAW;				// How is going to use the data for optimization
	gl.bufferData(bufferType, data, usage);
	// Assign the Buffer to an attribute variable
	// Set Program Shader to use
	gl.useProgram(shaderProgram);

	// Locate attribute variables
	// "aPosition" attribute
	var aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
	// Assignment Layout
	var index = aPositionLocation;	// index of the vertex attribute location
	var size = 3; 					// The number of components per vertex attribute
	var type = gl.FLOAT; 			// The data type of each component in the array
	var normalized = false; 		// Whether integer values should be normalized
	var stride = 0; 		// Offset in bytes between consecutive vertex attributes
	var offset = 0;					// Offset in bytes of the first component
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	// Enable the Assignment
	gl.enableVertexAttribArray(aPositionLocation);

	// Vertex (color) Buffer Object (VBO)
	var colorsBuffer = gl.createBuffer();
	// Bind Buffer to a data type
	var bufferType = gl.ARRAY_BUFFER;	// for float data type (vertices)
	gl.bindBuffer(bufferType, colorsBuffer);
	// Write data into a Buffer
	var bufferType = gl.ARRAY_BUFFER;	// for float data type (vertices)
	var data = new Float32Array(colors);	// data to write into the buffer
	var usage = gl.STATIC_DRAW;				// How is going to use the data for optimization
	gl.bufferData(bufferType, data, usage);

	// "aColor" attribute
	var aColorLocation = gl.getAttribLocation(shaderProgram, "aColor");
	// Assignment Layout
	var index = aColorLocation;		// index of the vertex attribute location
	var size = 4; 					// The number of components per vertex attribute
	var type = gl.FLOAT; 			// The data type of each component in the array
	var normalized = false; 		// Whether integer values should be normalized
	var stride = 0; 			// Offset in bytes between consecutive vertex attributes
	var offset = 0;				// Offset in bytes of the first component
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	// Enable the Assignment
	gl.enableVertexAttribArray(aColorLocation);

	// Index Buffer Object (IBO)
	var ibo = gl.createBuffer();
	// Bind Buffer to a data type
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;	// for uinteger data type (indices)
	gl.bindBuffer(bufferType, ibo);
	// Write data into a Buffer
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;	// for uinteger data type (indices)
	var data = new Uint16Array(indices);		// data to write into the buffer
	var usage = gl.STATIC_DRAW;					// How is going to use the data for optimization
	gl.bufferData(bufferType, data, usage);

	// Set color to clear buffers
	gl.clearColor(0., 0., 0., 1.);	// black

	// Set Viewport transformation
	gl.viewport(0, 0, canvas.width, canvas.height);
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
