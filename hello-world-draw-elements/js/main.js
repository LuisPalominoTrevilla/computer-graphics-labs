"use strict"
var canvas;	
var gl;			// WebGL context
var vertices;	// 3D-model (scene)
var indices;

function init()
{
	// Init Scene
	vertices = [1., 0.5, 0.,	// x0, y0, z0
			   -0.5, -0.5, 0.,	// x1, y1, z1
			    0.5, -0.5, 0.	// x2, y2, z2
				];
	indices = [0, 1, 2];

	// Init WebGL rendering context
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");

	// Init Shader Program
	var shaderProgram = createShaderProgram("vertexShader", "fragmentShader");

	// Init Buffers

	// Vertex Buffer Object (VBO)
	var vbo = gl.createBuffer();
	// Bind Buffer to a data type
	var bufferType = gl.ARRAY_BUFFER;	// for float data type (vertices)
	gl.bindBuffer(bufferType, vbo);
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
	var stride = 0; 				// Offset in bytes between consecutive vertex attributes
	var offset = 0;					// Offset in bytes of the first component
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	// Enable the Assignment
	gl.enableVertexAttribArray(aPositionLocation);

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
