// Ok Button Event
function okButtonClickEventListener(event)
{
	setVertexValues();

	var data = new Float32Array(vertices);
	var usage = gl.STATIC_DRAW;
	var bufferType = gl.ARRAY_BUFFER;
	gl.bufferData(bufferType, data, usage);
}

// Play Button Event
function playButtonClickEventListener(event)
{
	play = true;
}

// pause Button Event
function pauseButtonClickEventListener(event)
{
	play = false;
}

//  home Button Event
function homeButtonClickEventListener(event)
{
	theta = 0;
	document.getElementById("lab-theta-msg").innerHTML = 0;
	const uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	const modelMatrix = glMatrix.mat4.create();
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
}

//  reset Button Event
function resetButtonClickEventListener(event)
{
	theta = 0;
	deltaTheta = 5. * Math.PI / 180;
	play = false;
	ccw = true;
	rotAbout = "ORIGEN";
	document.getElementById("text-x0").value = 0;
	document.getElementById("text-y0").value = 0.5;

	document.getElementById("text-x1").value = -0.5;
	document.getElementById("text-y1").value = -0.5;

	document.getElementById("text-x2").value = 0.5;
	document.getElementById("text-y2").value = -0.5;

	setVertexValues();

	var data = new Float32Array(vertices);
	var usage = gl.STATIC_DRAW;
	var bufferType = gl.ARRAY_BUFFER;
	gl.bufferData(bufferType, data, usage);

	document.getElementById("radio-ccw").checked = true;
	document.getElementById("radio-origin").checked = true;
	document.getElementById("lab-theta-msg").innerHTML = 0;
	document.getElementById("text-xq").value = 0;
	document.getElementById("text-yq").value = 0;
	document.getElementById("range-speed").value = 5;

	const uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	const modelMatrix = glMatrix.mat4.create();
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
}

// Speed Slider Event
function rangeSpeedEventListener(event)
{
	var sliderValue = document.getElementById("range-speed").value;
	document.getElementById("lab-deltaTheta-msg").innerHTML = sliderValue;
	deltaTheta = sliderValue * Math.PI / 180.;
}

// CCW Radio Button Event
function radioCCWEventListener(event)
{
	ccw = true;
}

// CW Radio Button Event
function radioCWEventListener(event)
{
	ccw = false;
}

// Origin Radio Button Event
function radioOriginEventListener(event)
{
	rotAbout = "ORIGEN";
}

// Centroid Radio Button Event
function radioCentroidEventListener(event)
{
	rotAbout = "CENTROID";
}

// Q Radio Button Event
function radioQEventListener(event)
{
	rotAbout = "Q";
}

function initEventHandler(event)
{
	// Buttons
	document.getElementById("button-ok").addEventListener("click", okButtonClickEventListener, false);
	document.getElementById("button-play").addEventListener("click", playButtonClickEventListener, false);
	document.getElementById("button-pause").addEventListener("click", pauseButtonClickEventListener, false);
	document.getElementById("button-home").addEventListener("click", homeButtonClickEventListener, false);
	document.getElementById("button-reset").addEventListener("click", resetButtonClickEventListener, false);

	// Slider
	document.getElementById("range-speed").addEventListener("input", rangeSpeedEventListener, false);

	// Radio
	document.getElementById("radio-ccw").addEventListener("input", radioCCWEventListener, false);
	document.getElementById("radio-cw").addEventListener("input", radioCWEventListener, false);
	document.getElementById("radio-origin").addEventListener("input", radioOriginEventListener, false);
	document.getElementById("radio-centroid").addEventListener("input", radioCentroidEventListener, false);
	document.getElementById("radio-q").addEventListener("input", radioQEventListener, false);
}

