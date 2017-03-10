varying highp vec2 Texcoord;
uniform highp sampler2D imageTex;

void main(void){
    highp vec4 texColor = texture2D(imageTex,Texcoord);
    gl_FragColor = texColor;
}
