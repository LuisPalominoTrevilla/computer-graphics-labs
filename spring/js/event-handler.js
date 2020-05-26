function windowEventListener(event) {
  resizeCanvas();
  renderer.setSize(canvas.width, canvas.height);
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
}

// Resets the canvas dimensions to match window
function resizeCanvas() {
  canvas.width = 0.75 * window.innerWidth;
  canvas.height = 0.75 * window.innerHeight;
}
