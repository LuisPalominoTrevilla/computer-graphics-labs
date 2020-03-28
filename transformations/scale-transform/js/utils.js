function createScalingMatrix(fromOrigin) {
  const modelMatrix = glMatrix.mat4.create();
  if (fromOrigin) {
    glMatrix.mat4.scale(modelMatrix, modelMatrix, [sx, sy, 1]);
  } else {
    const { qx, qy } = geometricCenter();
    glMatrix.mat4.translate(modelMatrix, modelMatrix, [qx, qy, 0]);
    glMatrix.mat4.scale(modelMatrix, modelMatrix, [sx, sy, 1]);
    glMatrix.mat4.translate(modelMatrix, modelMatrix, [-qx, -qy, 0]);
  }
  return modelMatrix;
}
