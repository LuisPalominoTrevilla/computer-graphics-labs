"use strict"
var canvas;	
var gl;			// WebGL context
var vertices;	// 3D-model (scene)

function init()
{
	// Init Scene
	vertices = [0., 0.5, 0., 1., 0., 0., 1., 		// x0, y0, z0, R0, G0, B0, A0
			   -0.5, -0.5, 0., 0., 1., 0., 1.,		// x1, y1, z1
			    0.5, -0.5, 0., 0., 0., 1., 1.		// x2, y2, z2
				];

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
	var stride = (3 + 4) * 4; 				// Offset in bytes between consecutive vertex attributes
	var offset = 0;					// Offset in bytes of the first component
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	// Enable the Assignment
	gl.enableVertexAttribArray(aPositionLocation);

	// "aColor" attribute
	var aColorLocation = gl.getAttribLocation(shaderProgram, "aColor");
	// Assignment Layout
	var index = aColorLocation;	// index of the vertex attribute location
	var size = 4; 					// The number of components per vertex attribute
	var type = gl.FLOAT; 			// The data type of each component in the array
	var normalized = false; 		// Whether integer values should be normalized
	var stride = (3 + 4) * 4; 				// Offset in bytes between consecutive vertex attributes
	var offset = 3 * 4;					// Offset in bytes of the first component
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	// Enable the Assignment
	gl.enableVertexAttribArray(aColorLocation);

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
	var primitiveType = gl.POINTS;			// Primitive type to be rendered
	var offset = 0;							// Bytes offset in the array buffer
	var count = vertices.length / (3 + 4);	// Number of vertices to be rendered
	gl.drawArrays(primitiveType, offset, count);
}

function main()
{
	init();
	render();
}
