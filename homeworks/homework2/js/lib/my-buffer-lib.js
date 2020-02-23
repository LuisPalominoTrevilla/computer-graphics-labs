function writeIntoBuffer(dataVertices) {
    // Write data into buffer
	const bufferType = gl.ARRAY_BUFFER;
	const data = new Float32Array(dataVertices);
	const usage = gl.STATIC_DRAW;
	gl.bufferData(bufferType, data, usage);
}

function positionAssignment(positionName) {
	const aPositionLocation = gl.getAttribLocation(shaderProgram, positionName);
	const size = 3;
	const type = gl.FLOAT;
	const normalized = false;
	const stride = (3 + 4) * 4;
	const offset = 0;
	gl.vertexAttribPointer(aPositionLocation, size, type, normalized, stride, offset);
	gl.enableVertexAttribArray(aPositionLocation);
}

function colorAssignment(colorName) {
	const aColorLocation = gl.getAttribLocation(shaderProgram, colorName);
	const size = 4;
	const type = gl.FLOAT;
	const normalized = false;
	const stride = (3 + 4) * 4;
	const offset = 3 * 4;
	gl.vertexAttribPointer(aColorLocation, size, type, normalized, stride, offset);
	gl.enableVertexAttribArray(aColorLocation);
}