import React, { useRef, useEffect } from 'react'

export function HeatMap(props) {
  const canvasRef = useRef(null)
  const canvasGridSize = useRef(10);

  const draw = (col, row) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const gridSize = canvasGridSize.current
    context.fillStyle = "rgba(255, 0, 0, 0.1)";
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
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.height = 7000;
    props.mousePos.forEach(mousePos => {
      updateHeatMap(mousePos[0], mousePos[1])
    });
  }, []);
  return (
    <div style={{maxHeight:'700px',overflowY:'scroll'}}>
      <canvas style={{ width: '500px' }} ref={canvasRef} />
    </div>
  )
}