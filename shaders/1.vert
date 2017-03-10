attribute vec2 position;
uniform vec2 screenResolution;
uniform vec2 mousePosition;
uniform float size;

void main(){
  vec2 scaledPosition = position * size - size/2.0;
  vec2 movedPosition = mousePosition + vec2(0.5, 0.5) + scaledPosition;
  vec2 pos = 2.0 * movedPosition / screenResolution - 1.0;
  gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);
}
