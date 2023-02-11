import React, { useRef, useEffect } from 'react'

export function HeatMap(props) {
  const canvasRef = useRef(null)
  const canvasGridSize = useRef(10);

  const draw = (col, row) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const gridSize = canvasGridSize.current
    context.fillStyle = "rgba(255, 0, 0, 0.1)";
    console.log(col,row,gridSize)
    context.fillRect(col*gridSize, row*gridSize, gridSize, gridSize);
    
  };
  const updateHeatMap = (x, y) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const cWidth = context.canvas.clientWidth;
    const col = Math.floor((x/(props.bWidth/cWidth))/canvasGridSize.current)
    const row = Math.floor(y/canvasGridSize.current)
    draw(col, row)
  }

  useEffect(() => {
    // props.mousePos.forEach(mousePos => {
    //   updateHeatMap(mousePos[0], mousePos[1])
    // });
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    //Our first draw
    context.fillStyle = '#000000'
    context.fillRect(2*10, 2*10, context.canvas.width, context.canvas.height)
  }, []);
  return (
    <canvas style={{ width: '500px', height:'5000px' }} ref={canvasRef} />
  )
}