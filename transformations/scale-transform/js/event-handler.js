// Button Event
function clickResetButtonEventListener(event)
{
	vertices = verticesTriangle;
	indices = indicesTriangle;
	sx = 1.;
	sy = 1.;
	triangularGeometry = true;
	scaleAboutOrigin = false;
	simetricScale = true;

	// Reset radios
	document.getElementById("radio-triangle").checked = true;
	document.getElementById("radio-centroid").checked = true;
	document.getElementById("radio-simetric").checked = true;

	// Reset ranges
	document.getElementById("range-sx").value = 10;
	document.getElementById("range-sy").value = 10;
	document.getElementById("label-range-sx").innerHTML = 1;
	document.getElementById("label-range-sy").innerHTML = 1;

	loadBuffers();

	const modelMatrix = glMatrix.mat4.create();

	const uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);

	render();
}

// Radio Button Events
function inputRadioTriangleEventListener(event)
{
	triangularGeometry = true;
	vertices = verticesTriangle;
	indices = indicesTriangle;

	// Load data to buffers
	loadBuffers();

	render();
}
function inputRadioSquareEventListener(event)
{
	triangularGeometry = false;
	vertices = verticesSquare;
	indices = indicesSquare;
	
	// Load data to buffers
	loadBuffers();

	render();
}
function inputRadioCentroidEventListener(event)
{
	scaleAboutOrigin = false;
}
function inputRadioOriginEventListener(event)
{
	scaleAboutOrigin = true;
}
function inputRadioSimetricEventListener(event)
{
	simetricScale = true;
}
function inputRadioAsimetricEventListener(event)
{
	simetricScale = false;
}

// Range Slider Events
function rangeSxEventListener(event)
{
	var sliderValue = document.getElementById("range-sx").value / 10.;
	document.getElementById("label-range-sx").innerHTML = sliderValue;
	sx = sliderValue;
	if(simetricScale) {
		sy = sx;
		document.getElementById("range-sy").value = sy * 10;
		document.getElementById("label-range-sy").innerHTML = sy;
	}

	const modelMatrix = createScalingMatrix(scaleAboutOrigin);
	const uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);

	render();
}
function rangeSyEventListener(event)
{
	var sliderValue = document.getElementById("range-sy").value / 10.;
	document.getElementById("label-range-sy").innerHTML = sliderValue;
	sy = sliderValue;
	if(simetricScale) {
		sx = sy;
		document.getElementById("range-sx").value = sx * 10;
		document.getElementById("label-range-sx").innerHTML = sx;
	}

	const modelMatrix = createScalingMatrix(scaleAboutOrigin);
	const uModelMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);

	render();
}

function initEventHandler(event)
{
	// Buttons
	document.getElementById("button-reset").addEventListener("click", clickResetButtonEventListener, false);

	// Range Slider
	document.getElementById("range-sx").addEventListener("input", rangeSxEventListener, false);
	document.getElementById("range-sy").addEventListener("input", rangeSyEventListener, false);

	// Radio Buttons
	document.getElementById("radio-triangle").addEventListener("input", inputRadioTriangleEventListener, false);
	document.getElementById("radio-square").addEventListener("input", inputRadioSquareEventListener, false);
	document.getElementById("radio-centroid").addEventListener("input", inputRadioCentroidEventListener, false);
	document.getElementById("radio-origin").addEventListener("input", inputRadioOriginEventListener, false);
	document.getElementById("radio-simetric").addEventListener("input", inputRadioSimetricEventListener, false);
	document.getElementById("radio-asimetric").addEventListener("input", inputRadioAsimetricEventListener, false);

}

