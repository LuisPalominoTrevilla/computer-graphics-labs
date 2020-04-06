// Button Events
function clickButtonOrbitEventListener(event)
{
	orbitCamera = true;
}
function clickButtonPauseEventListener(event)
{
	orbitCamera = false;
}
function clickButtonHomeEventListener(event)
{
	orbitCamera = false;
	getInitCameraValues();
	updateCamera();
	resetGUI();
	render();
}

// Range Events
function inputRangeSpeedEventListener(event)
{
	var sliderValue = Number(document.getElementById("range-speed").value);
	document.getElementById("label-range-speed").innerHTML = sliderValue;
	deltaTheta = sliderValue * Math.PI / 180.;
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
}

function updateGUI()
{
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
	document.getElementById("label-xEye").innerHTML = xEye.toFixed(1);
	document.getElementById("label-yEye").innerHTML = yEye.toFixed(1);
	document.getElementById("label-zEye").innerHTML = zEye.toFixed(1);
	document.getElementById("label-xTarget").innerHTML = xTarget.toFixed(1);
	document.getElementById("label-yTarget").innerHTML = yTarget.toFixed(1);
	document.getElementById("label-zTarget").innerHTML = zTarget.toFixed(1);
	document.getElementById("label-xUp").innerHTML = xUp.toFixed(1);
	document.getElementById("label-yUp").innerHTML = yUp.toFixed(1);
	document.getElementById("label-zUp").innerHTML = zUp.toFixed(1);

	document.getElementById("range-speed").value = 5;
	document.getElementById("label-range-speed").innerHTML = 5;
}

function initEventHandler(event)
{
	// Buttons
	document.getElementById("button-orbit").addEventListener("click", clickButtonOrbitEventListener, false);
	document.getElementById("button-pause").addEventListener("click", clickButtonPauseEventListener, false);
	document.getElementById("button-home").addEventListener("click", clickButtonHomeEventListener, false);

	// Range Sliders
	document.getElementById("range-speed").addEventListener("input", inputRangeSpeedEventListener, false);
}

