// Radio Buttons
// Radio Button Events
// Radio Button Events
function inputRadioModelPyramidEventListener(event)
{
	vertices = verticesPyramid;
	indices = indicesPyramid;
	updateScene();
	autoFocus();
	updateCamera();
}
function inputRadioModelCubeEventListener(event)
{
	vertices = verticesCube;
	indices = indicesCube;
	updateScene();
	autoFocus();
	updateCamera();
}
function inputRadioModelLittleHouseEventListener(event)
{
	vertices = verticesLittleHouse;
	indices = indicesLittleHouse;
	updateScene();
	updateScene();
	autoFocus();
	updateCamera();
}

function updateScene()
{
	//VBO
	var bufferType = gl.ARRAY_BUFFER;			// Buffer type to storage float data
	gl.bindBuffer(bufferType, vbo);				// Bind to a type of buffer
	var data = new Float32Array(vertices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer

	// IBO
	var ibo = gl.createBuffer();
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;	// Buffer type to storage float data
	gl.bindBuffer(bufferType, ibo);				// Bind to a type of buffer
	var data = new Uint16Array(indices);		// Data to be storage in a Buffer (a raw device)
	var usage = gl.STATIC_DRAW;					// Used for drawing optimization
	gl.bufferData(bufferType, data, usage);		// Load data into the Buffer
}


function mouseDownEventListener(event)
{
	dragging = true;
	var x = event.clientX;
	var y = event.clientY;
	var rect = event.target.getBoundingClientRect();
	x = x - rect.left;
	y = y - rect.top;
	xLast = x;
	yLast = y;
}

function mouseUpEventListener(event)
{
	dragging = false;	// mouse is released
}

function mouseMoveEventListener(event)
{
	if(dragging)
	{	
		var x = event.clientX;
		var y = event.clientY;
		var rect = event.target.getBoundingClientRect();
		x = x - rect.left;
		y = y - rect.top;
		dragMode = document.querySelector("input[name='camera']:checked").value;
		if(dragMode == "ROTATE")
		{
			var factor = 2. / canvas.height; // The rotation ratio
			if(magnitudOrder == 10)
			{
				factor = factor * 2;
			}
			else if(magnitudOrder == 100)
			{
				factor = factor * 3;
			}
			else if(magnitudOrder == 1000)
			{
				factor = factor * 4;
			}
			var dx = factor * (x - xLast);
			var dy = factor * (y - yLast);
			// Limit x-axis rotation angle to [-90, 90] degrees
			rotX = Math.max(Math.min(rotX + dy, 90.), -90.);
			rotY = rotY + dx;

		} else if(dragMode == "PAN")
		{ 				
			// var deltaX = (x - xLast) / 63.0;
			// var deltaY = (y - yLast) / (-63.0);
			//var deltaX = (x - xLast) / (63.0 * (5./resolution));
			//var deltaY = (y - yLast) / (-63.0 * (5./resolution));
			var deltaX = (x - xLast) / (63.0);
			var deltaY = (y - yLast) / (-63.0);
			xEye = xEye + deltaX;
			yEye = yEye + deltaY;
			xTarget = xTarget + deltaX;
			yTarget = yTarget + deltaY;
			//cameraRadius = Math.sqrt(xEye * xEye + yEye * yEye + zEye * zEye);
		} else if(dragMode == "ZOOM")
		{
			var difX = x - xLast;
			var difY = y - yLast;
			if (Math.abs(difX) > Math.abs(difY))
			{
				//zEye = zEye + difX / 10.0;
				//zEye = zEye + difX * resolution / 100.;
				zEye = zEye + difX / 10.;
			}
			else
			{
				//zEye = zEye + difY / 10.0;
				//zEye = zEye + difY * resolution  / 100.;
				zEye = zEye + difY  / 10.;
			}
			//cameraRadius = Math.sqrt(xEye * xEye + yEye * yEye + zEye * zEye);
		}
		xLast = x;
		yLast = y;
	}

	// Update camera transformation
	var eye = [xEye, yEye, zEye];
	var target = [xTarget, yTarget, zTarget];
	var up = [xUp, yUp, zUp];

	var cameraMatrix = glMatrix.mat4.create();	// M-camera = I
	glMatrix.mat4.lookAt(cameraMatrix, eye, target, up);
	glMatrix.mat4.rotate(cameraMatrix, cameraMatrix, rotX, [1., 0., 0.]);
	glMatrix.mat4.rotate(cameraMatrix, cameraMatrix, rotY, [0., 1., 0.]);
	var uCameraMatrixLocation = gl.getUniformLocation(shaderProgram, "uCameraMatrix");
	gl.uniformMatrix4fv(uCameraMatrixLocation, false, cameraMatrix);
}

function setInitCameraValues()
{
	xEyeIni = xEye;
	yEyeIni = yEye;
	zEyeIni = zEye;
	xTargetIni = xTarget;
	yTargetIni = yTarget;
	zTargetIni = zTarget;
	xUpIni = xUp;
	yUpIni = yUp;
	zUpIni = zUp;
}

function getInitCameraValues()
{
	xEye = xEyeIni;
	yEye = yEyeIni;
	zEye = zEyeIni;
	xTarget = xTargetIni;
	yTarget = yTargetIni;
	zTarget = zTargetIni;
	xUp = xUpIni;
	yUp = yUpIni;
	zUp = zUpIni;
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
	xUp = 0.;
	yUp = 1.0;
	zUp = 0.0;
}

function initEventHandler(event)
{
	// Radio Buttons
	document.getElementById("radio-model-pyramid").addEventListener("input", inputRadioModelPyramidEventListener, false);
	document.getElementById("radio-model-cube").addEventListener("input", inputRadioModelCubeEventListener, false);
	document.getElementById("radio-model-little-house").addEventListener("input", inputRadioModelLittleHouseEventListener, false);
	

	// Mouse
	document.addEventListener("mousedown", mouseDownEventListener, false);
	document.addEventListener("mouseup", mouseUpEventListener, false);
	document.addEventListener("mousemove", mouseMoveEventListener, false);
}

