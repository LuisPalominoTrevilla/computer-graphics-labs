"use strict"
let canvas;	
let gl;		// WebGL context
let shaderProgram,
	shaderProgram2;

function init()
{
	// Init WebGL rendering context
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");

	// Init Shader Program

	// Init Shader Program
	//shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
	shaderProgram2 = createShaderProgram("vertexShader", "fragmentShader2");

	// Set the Program Shader to use
	gl.useProgram(shaderProgram2);

	// Get attribute locations
	let aPositionLocation = gl.getAttribLocation(shaderProgram2, "aPosition");
	let aColor = gl.getAttribLocation(shaderProgram2, "aColor");

	// Get uniform locations
	let uPointSizeLocation = gl.getUniformLocation(shaderProgram2, "uPointSize");
	//let uColorLocation = gl.getUniformLocation(shaderProgram2, "uColor");

	// Setting attribute values
	gl.vertexAttrib3f(aPositionLocation, -0.5, 0.2, .3);
	const color2 = [0., 1., 1., 1.];
	gl.vertexAttrib4fv(aColor, color2);

	// Setting uniform values
	gl.uniform1f(uPointSizeLocation, 50.);
	//const purple_color = [1., 0., 1., 1.];
	//gl.uniform4fv(uColorLocation, purple_color);

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
	var primitiveType = gl.POINTS;		// Primitive type to be rendered
	var offset = 0;						// Bytes offset in the array buffer
	var count = 1;						// Number of vertices to be rendered
	gl.drawArrays(primitiveType, offset, count);
}

function main()
{
	init();
	render();
}
