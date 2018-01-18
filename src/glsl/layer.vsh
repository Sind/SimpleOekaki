attribute vec2 position;
uniform vec2 offset;
uniform vec2 size;
void main(void) {
  vec2 newPosition = position * size;
  newPosition = newPosition + offset;
  gl_Position = vec4(newPosition, 0.0, 1.0);
}