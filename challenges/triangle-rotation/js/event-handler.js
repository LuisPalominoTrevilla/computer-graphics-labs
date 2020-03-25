// Ok Button Event
function okButtonClickEventListener(event)
{
	document.getElementById("p-msg").innerHTML = "ok Button Click!";
}

// Play Button Event
function playButtonClickEventListener(event)
{
	play = true;
}

// pause Button Event
function pauseButtonClickEventListener(event)
{
	document.getElementById("p-msg").innerHTML = "pause Button Click!";
}

//  home Button Event
function homeButtonClickEventListener(event)
{
	document.getElementById("p-msg").innerHTML = "home Button Click!";
}

//  reset Button Event
function resetButtonClickEventListener(event)
{
	document.getElementById("p-msg").innerHTML = "render Button Click!";
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

