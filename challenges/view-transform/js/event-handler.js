// Button Events
function clickButtonPlayModelEventListener(event)
{
	playModel = true;
}
function clickButtonPauseModelEventListener(event)
{
	playModel = false;
}
function clickButtonHomeModelEventListener(event)
{
	playModel = false;
	ccwModel = true;
	document.getElementById("radio-ccw-model").checked = true;

	thetaModel = 0.;
	deltaThetaModel = 5. * Math.PI / 180.;
	document.getElementById("range-rot-speed-model").value = 5;
	document.getElementById("label-range-rot-speed-model").innerHTML = 5;
	var uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	var modelMatrix = glMatrix.mat4.create();	// mModel = I
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
}
function clickButtonPlayCameraEventListener(event)
{
	playCamera = true;
}
function clickButtonPauseCameraEventListener(event)
{
	playCamera = false;
}
function clickButtonHomeCameraEventListener(event)
{
	document.getElementById("label-msg").innerHTML = "HOME Button Camera clicked!";
}

// Range Events
function inputRangeRotSpeedModelEventListener(event)
{
	var sliderValue = document.getElementById("range-rot-speed-model").value;
	document.getElementById("label-range-rot-speed-model").innerHTML = sliderValue;
	deltaThetaModel = sliderValue * Math.PI / 180.;
}
function inputRangeRotSpeedCameraEventListener(event)
{
	var sliderValue = document.getElementById("range-rot-speed-camera").value;
	document.getElementById("label-range-rot-speed-camera").innerHTML = sliderValue;
}
function inputRangePanXEventListener(event)
{
	var sliderValue = document.getElementById("range-panX").value / 10.;
	document.getElementById("label-panX").innerHTML = sliderValue;
	panX = sliderValue;
}
function inputRangePanYEventListener(event)
{
	var sliderValue = document.getElementById("range-panY").value / 10.;
	document.getElementById("label-panY").innerHTML = sliderValue;
	panY = sliderValue;
}

// Radio Button Events
function inputRadioCCWModelEventListener(event)
{
	ccwModel = true;
}
function inputRadioCWModelEventListener(event)
{
	ccwModel = false;
}
function inputRadioCCWCameraEventListener(event)
{
	ccwCamera = true;
}
function inputRadioCWCameraEventListener(event)
{
	ccwCamera = false;
}

function initEventHandler(event)
{
	// Buttons
	document.getElementById("button-play-model").addEventListener("click", clickButtonPlayModelEventListener, false);
	document.getElementById("button-pause-model").addEventListener("click", clickButtonPauseModelEventListener, false);
	document.getElementById("button-home-model").addEventListener("click", clickButtonHomeModelEventListener, false);
	document.getElementById("button-play-camera").addEventListener("click", clickButtonPlayCameraEventListener, false);
	document.getElementById("button-pause-camera").addEventListener("click", clickButtonPauseCameraEventListener, false);
	document.getElementById("button-home-camera").addEventListener("click", clickButtonHomeCameraEventListener, false);

	// Range Sliders
	document.getElementById("range-rot-speed-model").addEventListener("input", inputRangeRotSpeedModelEventListener, false);
	document.getElementById("range-rot-speed-camera").addEventListener("input", inputRangeRotSpeedCameraEventListener, false);
	document.getElementById("range-panX").addEventListener("input", inputRangePanXEventListener, false);
	document.getElementById("range-panY").addEventListener("input", inputRangePanYEventListener, false);

	// Radio Buttons
	document.getElementById("radio-ccw-model").addEventListener("input", inputRadioCCWModelEventListener, false);
	document.getElementById("radio-cw-model").addEventListener("input", inputRadioCWModelEventListener, false);
	document.getElementById("radio-ccw-camera").addEventListener("input", inputRadioCCWCameraEventListener, false);
	document.getElementById("radio-cw-camera").addEventListener("input", inputRadioCWCameraEventListener, false);
}

