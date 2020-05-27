import React, { useRef, useEffect, useState } from "react";

const useViewPort = () => {
  const [ width, setWidth ] = useState(0);
  const [ height, setHeight ] = useState(0);

  useEffect(() => {
    setWidth(innerWidth);
    setHeight(innerHeight);
  }, []);

  return {
    width,
    height
  };
};

const Canvas: React.FC = () => {
  const { width, height } = useViewPort();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const gl = canvasRef.current.getContext("webgl2");
    if (!gl) return;
    gl.flush();
  }, []);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
      style={{ width: "100vw", height: "100vh" }}
    >
      javascript not working.
    </canvas>
  )
}

export default Canvas;
