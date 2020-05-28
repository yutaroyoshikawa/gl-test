import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useViewPort } from "../hooks/viewPort";
import { vert, frag } from "../shaders/home";
import { GL } from "../utils/gl";

const obj = new THREE.Object3D();
const modelMat = obj.matrixWorld;

const vertexPosition = [
  0.0, 1.0, 0.0,
  1.0, 0.0, 0.0,
 -1.0, 0.0, 0.0
];

const Canvas: React.FC = () => {
  const { width, height } = useViewPort();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("webgl");
    if (!ctx) return;

    const renderingGL = async () => {
      try {
        ctx.clearColor(1.0, 1.0, 1.0, 1.0);
        ctx.clearDepth(1.0);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
      
        const renderer = new GL(ctx);
      
        await renderer.initGl(vert, frag);
        const GLProgram = renderer.program;
        if (!GLProgram) return;
        const attLocation = ctx.getAttribLocation(GLProgram, 'position');
    
        const vbo = renderer.createBuffer(vertexPosition);
        if (!vbo) return;
    
        ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo);
        ctx.enableVertexAttribArray(attLocation);
        ctx.vertexAttribPointer(attLocation, 3, ctx.FLOAT, false, 0, 0);
    
        const uniLocation = ctx.getUniformLocation(GLProgram, "mvpMatrix");
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
        const viewMatrix = camera.matrixWorldInverse;
        const projectionMatrix = camera.projectionMatrix;
        const mvpMatrix = modelMat.multiplyMatrices(viewMatrix, projectionMatrix);
  
        console.log(mvpMatrix.toArray());
    
        ctx.uniformMatrix4fv(uniLocation, false, mvpMatrix.toArray());
        ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    
        renderer.renderGl();
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
