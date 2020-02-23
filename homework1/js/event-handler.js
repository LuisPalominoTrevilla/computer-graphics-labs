function mouseDownEventListener(event)
{
	// Get click coordinates
	const x = event.clientX;
	const y = event.clientY;

	const rect = event.target.getBoundingClientRect();

	const xClipp = 2 * (x - rect.left) / canvas.width - 1;
	const yClipp = 2 * (rect.top - y) / canvas.height + 1;

	// Get selected point size
	const pointSize = parseFloat(document.querySelector('input[name="point-size"]:checked').value);

	// Get selected colors
	const red = document.getElementById("sd-red").value / 255;
	const green = document.getElementById("sd-green").value / 255;
	const blue = document.getElementById("sd-blue").value / 255;
	const definedColor = [red, green, blue, 1.];

	// Scene update

	// Get locations
	const aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
	const uColorLocation = gl.getUniformLocation(shaderProgram, "uColor");
	const uPointSizeLocation = gl.getUniformLocation(shaderProgram, "uPointSize");
	
	// Set values
	gl.vertexAttrib3f(aPositionLocation, xClipp, yClipp, 0); 
	gl.uniform4fv(uColorLocation, definedColor);
	gl.uniform1f(uPointSizeLocation, pointSize);

	renderFlag = true;
	render();
}

function initEventHandler()
{
	canvas.addEventListener("mousedown", mouseDownEventListener, false);
}


