import { glsl } from "../utils/temlates";

export const vert = glsl`
attribute vec3 position;
uniform mat4 mvpMatrix;

void main(void){
  gl_Position = mvpMatrix * vec4(position, 1.);
}
`;

export const frag = glsl`
precision highp float;

uniform float time;
uniform vec2 mouse;

void main(void){
  vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
  gl_FragColor = vec4(m.x, cos(time), sin(time), 1.);
}
`;
