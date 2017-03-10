uniform highp vec2 screenResolution;
uniform highp vec2 mousePosition;
uniform highp float size;

void main(void)
{
    highp vec2 pos = vec2(gl_FragCoord.x, screenResolution.y - gl_FragCoord.y);
    highp float dist = distance(mousePosition + 0.5, pos);
    if (dist > size/2.0 - 0.2) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
