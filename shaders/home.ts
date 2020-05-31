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

void main(void){
  gl_FragColor = vec4(1.0, 1.0, sin(time), 1.);
}
`;
