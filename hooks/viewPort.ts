import { useState, useEffect } from "react";

export const useViewPort = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(innerWidth);
    setHeight(innerHeight);
  }, []);

  return {
    width,
    height
  };
};
