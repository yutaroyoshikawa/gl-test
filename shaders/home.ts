import { glsl } from "../utils/temlates";

export const vert = glsl`
attribute vec3 position;
uniform   mat4 mvpMatrix;

void main(void){
  gl_Position = mvpMatrix * vec4(position, 1.0);
}
`;

export const frag = glsl`
precision mediump float;

void main(void){
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.);
}
`;
