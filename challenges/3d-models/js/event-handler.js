// Radio Button Events
function inputRadioModelPyramidEventListener(event)
{
	vertices = verticesPyramid;
	indices = indicesPyramid;
	updateScene();
	autoFocus();
	updateCamera();
	render();
	updateGUI();
}
function inputRadioModelCubeEventListener(event)
{
	vertices = verticesCube;
	indices = indicesCube;
	updateScene();
	autoFocus();
	updateCamera();
	updateGUI();
	render();
}
function inputRadioModelLittleHouseEventListener(event)
{
	vertices = verticesLittleHouse;
	indices = indicesLittleHouse;
	updateScene();
	updateScene();
	autoFocus();
	updateCamera();
	render();
	updateGUI();
}


// Range Events
function inputRangeOrbitSpeedEventListener(event)
{
	var sliderValue = Number(document.getElementById("range-orbit-speed").value);
	document.getElementById("label-range-orbit-speed").value = sliderValue;
	deltaTheta = sliderValue * Math.PI / 180.;
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
	
	xEyeIni = xEye;
	yEyeIni = yEye;
	zEyeIni = zEye;
	xTargetIni = xTarget;
	yTargetIni = yTarget;
	zTargetIni = zTarget;
	console.log(xCentroid, yCentroid,zCentroid);
}

function updateGUI()
{
	
}
function resetGUI()
{
	updateGUI();	
	document.getElementById("range-panX").value = 0;
	document.getElementById("range-panY").value = 0;
	document.getElementById("range-zoom").value = 0;
}
function initEventHandler(event)
{

	// Radio Buttons
	document.getElementById("radio-model-pyramid").addEventListener("input", inputRadioModelPyramidEventListener, false);
	document.getElementById("radio-model-cube").addEventListener("input", inputRadioModelCubeEventListener, false);
	document.getElementById("radio-model-little-house").addEventListener("input", inputRadioModelLittleHouseEventListener, false);

	// Range Sliders
	document.getElementById("range-orbit-speed").addEventListener("input", inputRangeOrbitSpeedEventListener, false);
}

