import React, { useRef, useEffect } from "react";
import { Matrix4, Vector3, Matrix3x3 } from "matrixgl";
import { useViewPort } from "../hooks/viewPort";
import { vert, frag } from "../shaders/home";
import { GL } from "../utils/gl";

const vertexPosition = new Matrix3x3(
  0.0, 2.0, 0.0,
  2.0, 0.0, 0.0,
  -2.0, 0.0, 0.0
);

const colors = new Float32Array([
  0.0 /* Red */, 1.0 /* Green */, 0.0 /* Blue */, 1.0 /* Alpha */,
  0.0, 0.0, 1.0, 1.0,
  1.0, 0.0, 0.0, 1.0,
]);

const model = Matrix4.identity();

const camera = new Vector3(0.0, 1.0, 3.0);
const lookAt = new Vector3(0, 0, 0);
const cameraUpDirection = new Vector3(0, 1, 0);

const view = Matrix4.lookAt(camera, lookAt, cameraUpDirection);

const Canvas: React.FC = () => {
  const { width, height } = useViewPort();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("webgl2");
    if (!ctx) return;

    const renderingGL = async () => {
      try {
        ctx.clearColor(0.0, 0.0, 0.0, 1.0);
        ctx.clearDepth(1.0);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

        const renderer = new GL(ctx);

        await renderer.initGl(vert, frag);
        const GLProgram = renderer.program;
        if (!GLProgram) return;
        const attLocation = ctx.getAttribLocation(GLProgram, 'position');

        const vao = renderer.createVertexArray(
          [vertexPosition.values,colors],
          [0,1],
          [3,4]
        );

        ctx.bindVertexArray(vao);

        const vbo = renderer.createBuffer(vertexPosition.values);
        if (!vbo) return;

        ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo);
        ctx.enableVertexAttribArray(attLocation);
        ctx.vertexAttribPointer(attLocation, 3, ctx.FLOAT, false, 0, 0);

        const uniLocation = ctx.getUniformLocation(GLProgram, "mvpMatrix");

        const perspective = Matrix4.perspective({
          fovYRadian: 90,
          aspectRatio: width / height,
          near: 0.1,
          far: 100
        });

        const mvp = perspective.mulByMatrix4(view)
          .mulByMatrix4(model);

        ctx.uniformMatrix4fv(uniLocation, false, mvp.values);

        const renderLoop = () => {
          renderer.renderGl();
          requestAnimationFrame(renderLoop);
        }

        renderLoop();
      } catch (error) {
        console.error(error);
      }
    }

    renderingGL();
  }, []);

  return (
    <>
      <canvas
        width={width}
        height={height}
        ref={canvasRef}
      >
        javascript not working.
      </canvas>
      <style>{`
        canvas {
          width: 100vw;
          height: 100vh;
        }
      `}</style>
    </>
  )
}

export default Canvas;
