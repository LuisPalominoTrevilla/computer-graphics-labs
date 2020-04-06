// Button Events
function clickButtonHomeEventListener(event)
{
	autoFocus();
	getInitCameraValues();
	updateCamera();
	resetGUI();
	render();
}

// Radio Button Events
function inputRadioMagnitudOrder01XEventListener(event)
{
	magnitudOrder = 0.1;
	stepFactor = 0.1;
	vertices = vertices1x;
	updateScene();
	autoFocus();
	updateCamera();
	render();
	updateGUI();
}
function inputRadioMagnitudOrder1XEventListener(event)
{
	magnitudOrder  = 1.;
	stepFactor = 1.;
	vertices = vertices10x;
	updateScene();
	autoFocus();
	updateCamera();
	updateGUI();
	render();
}
function inputRadioMagnitudOrder10XEventListener(event)
{
	magnitudOrder  = 10.;
	stepFactor = 10.;
	vertices = vertices100x;
	updateScene();
	updateScene();
	autoFocus();
	updateCamera();
	render();
	updateGUI();
}
function inputRadioMagnitudOrder100XEventListener(event)
{
	magnitudOrder = 100.;
	stepFactor = 100.;
	vertices = vertices1000x;
	updateScene();
	updateScene();
	autoFocus();
	updateCamera();
	render();
	updateGUI();
}
function inputRadioStepFactor01XEventListener(event)
{
	stepFactor = 0.1;
	setInitCameraValues();
}
function inputRadioStepFactor1XEventListener(event)
{
	stepFactor = 1.;
	setInitCameraValues();
}
function inputRadioStepFactor10XEventListener(event)
{
	stepFactor = 10.;
	setInitCameraValues();
}
function inputRadioStepFactor100XEventListener(event)
{
	stepFactor = 100.;
	setInitCameraValues();
}

// Range Events
function inputRangePanXEventListener(event)
{
	var sliderValue = Number(document.getElementById("range-panX").value);
	var panX = sliderValue * stepFactor;
	// Update Camera's eye
	xEye = xEyeIni + panX;
	xTarget = xTargetIni + panX;
	updateCamera();
	render();
	updateGUI();
}
function inputRangePanYEventListener(event)
{
	var sliderValue = Number(document.getElementById("range-panY").value);
	var panY = sliderValue * stepFactor;	
	// Update Camera's eye
	yEye = yEyeIni + panY;
	yTarget = yTargetIni + panY;
	updateCamera();
	render();
	updateGUI();
}
function inputRangeZoomEventListener(event)
{
	var sliderValue = Number(document.getElementById("range-zoom").value);
	var zoom = sliderValue * stepFactor;
	zEye = zEyeIni + zoom;
	updateCamera();
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

function updateGUI()
{
	if(magnitudOrder == 0.1)
	{
		document.getElementById("radio-magnitud-order-01x").checked = true;
	}
	else if(magnitudOrder == 1.)
	{
		document.getElementById("radio-magnitud-order-1x").checked = true;
	}
	else if(magnitudOrder == 10.)
	{
		document.getElementById("radio-magnitud-order-10x").checked = true;
	}
	else if(magnitudOrder == 100.)
	{
		document.getElementById("radio-magnitud-order-100x").checked = true;
	}
	if(stepFactor == 0.1)
	{
		document.getElementById("radio-step-factor-01x").checked = true;
	}
	if(stepFactor == 1.)
	{
		document.getElementById("radio-step-factor-1x").checked = true;
	}
	else if(stepFactor == 10.)
	{
		document.getElementById("radio-step-factor-10x").checked = true;
	}
	else if(stepFactor == 100.)
	{
		document.getElementById("radio-step-factor-100x").checked = true;
	}
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
function resetGUI()
{
	updateGUI();	
	document.getElementById("range-panX").value = 0;
	document.getElementById("range-panY").value = 0;
	document.getElementById("range-zoom").value = 0;
}
function initEventHandler(event)
{
	// Buttons
	document.getElementById("button-home").addEventListener("click", clickButtonHomeEventListener, false);

	// Radio Buttons
	document.getElementById("radio-magnitud-order-01x").addEventListener("input", inputRadioMagnitudOrder01XEventListener, false);
	document.getElementById("radio-magnitud-order-1x").addEventListener("input", inputRadioMagnitudOrder1XEventListener, false);
	document.getElementById("radio-magnitud-order-10x").addEventListener("input", inputRadioMagnitudOrder10XEventListener, false);
	document.getElementById("radio-magnitud-order-100x").addEventListener("input", inputRadioMagnitudOrder100XEventListener, false);
	document.getElementById("radio-step-factor-01x").addEventListener("input", inputRadioStepFactor01XEventListener, false);
	document.getElementById("radio-step-factor-1x").addEventListener("input", inputRadioStepFactor1XEventListener, false);
	document.getElementById("radio-step-factor-10x").addEventListener("input", inputRadioStepFactor10XEventListener, false);
	document.getElementById("radio-step-factor-100x").addEventListener("input", inputRadioStepFactor100XEventListener, false);

	// Range Sliders
	document.getElementById("range-panX").addEventListener("input", inputRangePanXEventListener, false);
	document.getElementById("range-panY").addEventListener("input", inputRangePanYEventListener, false);
	document.getElementById("range-zoom").addEventListener("input", inputRangeZoomEventListener, false);
}

