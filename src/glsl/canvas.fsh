precision mediump float;

varying vec2 Texcoord;
uniform vec3 backgroundColor;
uniform sampler2D imageTex;

uniform ivec3 layerOrder;
uniform vec3 layerVisibility;
uniform mat3 layerColors;

void main(void){
  vec4 texColor = texture2D(imageTex,Texcoord);

  vec3 outputColor = backgroundColor;

  for(int i = 0; i < 3; i++){
    int currentLayer = layerOrder[i];

    if(currentLayer == 0){
      vec3 currentColor = layerColors[0];
      float currentSet = texColor[0];
      currentSet = currentSet * layerVisibility[0];
      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet); 
    } else if(currentLayer == 1){
      vec3 currentColor = layerColors[1];
      float currentSet = texColor[1];
      currentSet = currentSet * layerVisibility[1];
      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet);
    } else {
      vec3 currentColor = layerColors[2];
      float currentSet = texColor[2];
      currentSet = currentSet * layerVisibility[2];
      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet);
    }
  }
  gl_FragColor = vec4(outputColor,1.0);
}