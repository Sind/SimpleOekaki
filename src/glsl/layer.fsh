precision mediump float;

uniform vec4 line;
uniform float thickness;

//uniform sampler2D pattern;

void main(void){
  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;
  
  float x1 = line[0];
  float y1 = line[1];
  float x2 = line[2];
  float y2 = line[3];

  float A = x - x1;
  float B = y - y1;
  float C = x2 - x1;
  float D = y2 - y1;
  
  float dot = A * C + B * D;
  float len_sq = C * C + D * D;
  float param = -1.0;
  if (len_sq != 0.0) //in case of 0 length line
      param = dot / len_sq;
  
  float xx, yy;
  
  if (param < 0.0){
    xx = x1;
    yy = y1;
  } else if(param > 1.0){
    xx = x2;
    yy = y2;
  } else if(abs(C) > abs(D)){
    xx = floor(x1 + param * C) + 0.5;
    yy = floor(y1 + (xx - x1) / C * D) + 0.5;
  }else{
    yy = floor(y1 + param * D) + 0.5;
    xx = floor(x1 + (yy - y1) / D * C) +0.5;
  }
  float d = distance(vec2(x,y),vec2(xx,yy));

  if(d > thickness/2.0) discard;

  //gl_FragColor = texture2D(pattern, gl_FragCoord.xy / 800.0);
  gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}