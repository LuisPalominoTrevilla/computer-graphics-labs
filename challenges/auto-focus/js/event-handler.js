// Button Events
function clickButtonOkEventListener(event)
{
	var x0 = Number(document.getElementById("text-x0").value);
	var y0 = Number(document.getElementById("text-y0").value);
	var z0 = Number(document.getElementById("text-z0").value);
	var x1 = Number(document.getElementById("text-x1").value);
	var y1 = Number(document.getElementById("text-y1").value);
	var z1 = Number(document.getElementById("text-z1").value);
	var x2 = Number(document.getElementById("text-x2").value);
	var y2 = Number(document.getElementById("text-y2").value);
	var z2 = Number(document.getElementById("text-z2").value);

	vertices = [x0, y0, z0, x1, y1, z1, x2, y2, z2];
	// Load vertices into VBO
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, vbo);				// Bind to a type of buffer
	var data = new Float32Array(vertices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer
	render();
}
function clickButtonAutoFocusEventListener(event)
{
	autoFocus();
	// Load CameraMatrix
	updateCamera();

	render();
	updateGUI();
}
function inputRadio1XEventListener(event)
{
	vertices = vertices1x;
	updateScene();
	render();
	updateGUI();
}
function inputRadio10XEventListener(event)
{
	vertices = vertices10x;
	updateScene();
	render();
	updateGUI();
}
function inputRadio100XEventListener(event)
{
	vertices = vertices100x;
	updateScene();
	render();
	updateGUI();
}
function inputRadio1000XEventListener(event)
{
	vertices = vertices1000x;
	updateScene();
	render();
	updateGUI();
}

function updateScene()
{
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, vbo);				// Bind to a type of buffer
	var data = new Float32Array(vertices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer
}

function updateCamera()
{
	var eye = [xEye, yEye, zEye];
	var target = [xTarget, yTarget, zTarget];
	var up = [xUp, yUp, zUp];
	var cameraMatrix = glMatrix.mat4.create();
	glMatrix.mat4.lookAt(cameraMatrix, eye, target, up);
	var uCameraMatrixLocation = gl.getUniformLocation(shaderProgram, "uCameraMatrix");
	gl.uniformMatrix4fv(uCameraMatrixLocation, false, cameraMatrix);
}

function autoFocus()
{
	// Get BBox
	var fovy = 60. * Math.PI / 180.;
	var xMin = vertices[0];
	var xMax = vertices[0];
	var i;
	for(i = 3; i < vertices.length; i = i + 3)
	{
		if(vertices[i] < xMin)
		{
			xMin = vertices[i];
		}
		else if(vertices[i] > xMax)
		{
			xMax = vertices[i];
		}
	}
	var yMin = vertices[1];
	var yMax = vertices[1];
	for(i = 4; i < vertices.length; i = i + 3)
	{
		if(vertices[i] < yMin)
		{
			yMin = vertices[i];
		}
		else if(vertices[i] > yMax)
		{
			yMax = vertices[i];
		}
	}
	var zMin = vertices[2];
	var zMax = vertices[2];
	for(i = 5; i < vertices.length; i = i + 3)
	{
		if(vertices[i] < zMin)
		{
			zMin = vertices[i];
		}
		else if(vertices[i] > zMax)
		{
			zMax = vertices[i];
		}
	}
	// BBox's Centroid
	var xCentroid = (xMin + xMax) / 2.;
	var yCentroid = (yMin + yMax) / 2.;
	var zCentroid = (zMin + zMax) / 2.;
	// eyeCamera
	xEye = xCentroid;
	yEye = yCentroid;
	var z1 = Math.abs(yMax - yEye) / Math.tan(fovy / 2.) + zMax;
	var z2 = Math.abs(xMax - xEye) / Math.tan(fovy / 2.) + zMax;
	zEye = z1;
	if(z2 > zEye)
	{
		zEye = z2;
	}
	zEye = 2. * zEye;
	// targetCamera
	xTarget = xCentroid;
	yTarget = yCentroid;
	zTarget = zCentroid;
}

function updateGUI()
{
	// Update GUI
	document.getElementById("text-x0").value = vertices[0];
	document.getElementById("text-y0").value = vertices[1];
	document.getElementById("text-z0").value = vertices[2];
	document.getElementById("text-x1").value = vertices[3];
	document.getElementById("text-y1").value = vertices[4];
	document.getElementById("text-z1").value = vertices[5];
	document.getElementById("text-x2").value = vertices[6];
	document.getElementById("text-y2").value = vertices[7];
	document.getElementById("text-z2").value = vertices[8];

	document.getElementById("label-xEye").innerHTML = xEye.toFixed(1);
	document.getElementById("label-yEye").innerHTML = yEye.toFixed(1);
	document.getElementById("label-zEye").innerHTML = zEye.toFixed(1);
	document.getElementById("label-xTarget").innerHTML = xTarget.toFixed(1);
	document.getElementById("label-yTarget").innerHTML = yTarget.toFixed(1);
	document.getElementById("label-zTarget").innerHTML = zTarget.toFixed(1);
	document.getElementById("label-xUp").innerHTML = xUp.toFixed(1);
	document.getElementById("label-yUp").innerHTML = yUp.toFixed(1);
	document.getElementById("label-zUp").innerHTML = zUp.toFixed(1);
}

function initEventHandler(event)
{
	// Buttons
	document.getElementById("button-ok").addEventListener("click", clickButtonOkEventListener, false);
	document.getElementById("button-auto-focus").addEventListener("click", clickButtonAutoFocusEventListener, false);

	// Radio Buttons
	document.getElementById("radio-1x").addEventListener("input", inputRadio1XEventListener, false);
	document.getElementById("radio-10x").addEventListener("input", inputRadio10XEventListener, false);
	document.getElementById("radio-100x").addEventListener("input", inputRadio100XEventListener, false);
	document.getElementById("radio-1000x").addEventListener("input", inputRadio1000XEventListener, false);
}

