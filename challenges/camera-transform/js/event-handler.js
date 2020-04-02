// Button Events
function clickButtonAutoFocusEventListener(event) {
  document.getElementById("label-msg").innerHTML = "AUTO-FOCUS Button clicked!";
}
function clickButtonOrbitEventListener(event) {
  orbitCamera = true;
}
function clickButtonPauseEventListener(event) {
  orbitCamera = false;
}
function clickButtonHomeEventListener(event) {
  orbitCamera = false;
  theta = 0;
  deltaTheta = (3 * Math.PI) / 180;
  xEye = 0;
  yEye = 0;
  zEye = 11;
  xTarget = 0;
  yTarget = 0;
  zTarget = 0;
  radious = zEye;

  document.getElementById("range-panX").value = 0;
  document.getElementById("range-panY").value = 0;
  document.getElementById("range-zoom").value = 0;

  document.getElementById("label-range-panX").innerHTML = "0.0";
  document.getElementById("label-range-panY").innerHTML = "0.0";
	document.getElementById("label-range-zoom").innerHTML = "0.0";
	
	document.getElementById("label-xEye").innerHTML = "0.0";
	document.getElementById("label-yEye").innerHTML = "0.0";
	document.getElementById("label-zEye").innerHTML = "0.0";

	document.getElementById("label-xTarget").innerHTML = "0.0";
	document.getElementById("label-yTarget").innerHTML = "0.0";
	document.getElementById("label-zTarget").innerHTML = "0.0";
}

// Range Events
function inputRangePanXEventListener(event) {
  var sliderValue = parseInt(document.getElementById("range-panX").value);
  document.getElementById("label-range-panX").innerHTML = sliderValue;

  xEye = sliderValue;
  xTarget = sliderValue;
}
function inputRangePanYEventListener(event) {
  var sliderValue = parseInt(document.getElementById("range-panY").value);
  document.getElementById("label-range-panY").innerHTML = sliderValue;
  yEye = sliderValue;
  yTarget = sliderValue;
}
function inputRangeZoomEventListener(event) {
  var sliderValue = parseInt(document.getElementById("range-zoom").value);
  document.getElementById("label-range-zoom").innerHTML = sliderValue;
  zEye = 11 - sliderValue;
  radious = zEye;
}

function initEventHandler(event) {
  // Buttons
  document
    .getElementById("button-auto-focus")
    .addEventListener("click", clickButtonAutoFocusEventListener, false);
  document
    .getElementById("button-orbit")
    .addEventListener("click", clickButtonOrbitEventListener, false);
  document
    .getElementById("button-pause")
    .addEventListener("click", clickButtonPauseEventListener, false);
  document
    .getElementById("button-home")
    .addEventListener("click", clickButtonHomeEventListener, false);

  // Range Sliders
  document
    .getElementById("range-panX")
    .addEventListener("input", inputRangePanXEventListener, false);
  document
    .getElementById("range-panY")
    .addEventListener("input", inputRangePanYEventListener, false);
  document
    .getElementById("range-zoom")
    .addEventListener("input", inputRangeZoomEventListener, false);
}
