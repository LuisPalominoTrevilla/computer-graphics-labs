"use strict"
var canvas;	
var gl;		// WebGL context
var shaderProgram;
var vertices = [];

function init()
{
	// Init WebGL rendering context
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");

	// Init Shader Program
	shaderProgram = createShaderProgram("vertexShader", "fragmentShader");


	// Init Buffers
	const vbo = gl.createBuffer();
	const bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vbo);

	// Set Program Shader to use
	gl.useProgram(shaderProgram);

	// Set color to clear buffers
	gl.clearColor(0., 0., 0., 1.);	// black

	// Set Viewport transformation
	gl.viewport(0, 0, canvas.width, canvas.height);

	// Init Event Handler
	initEventHandler();
}

function render(currentTime)
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
