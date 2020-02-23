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
	const definedVertex = [xClipp, yClipp, 0.0, red, green, blue, 1.];

	for (let value of definedVertex) {
		vertices.push(value);
	}

	// Scene update
	writeIntoBuffer(vertices);
	positionAssignment("aPosition");
	colorAssignment("aColor");

	// Get locations
	const uPointSizeLocation = gl.getUniformLocation(shaderProgram, "uPointSize");
	
	// Set values
	gl.uniform1f(uPointSizeLocation, pointSize);

	render();
}

function clearEventListener() {
	vertices = [];

	writeIntoBuffer(vertices);
	positionAssignment("aPosition");
	colorAssignment("aColor");

	render();
}

function initEventHandler()
{
	canvas.addEventListener("mousedown", mouseDownEventListener, false);
	document.getElementById("clearBtn").addEventListener("click", clearEventListener);
}


