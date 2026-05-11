"use client";

import { Eraser, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const colors = ["#2f2925", "#e45757", "#f59e0b", "#3b82f6", "#16a34a"];

type DrawingCanvasProps = {
  onDrawingChange: (file: File | null) => void;
};

export function DrawingCanvas({ onDrawingChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const inkRef = useRef(false);
  const [color, setColor] = useState(colors[0]);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 8;
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function begin(event: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = point(event);
    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(event);
    ctx.strokeStyle = color;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    inkRef.current = true;
    setHasInk(true);
  }

  function end() {
    drawingRef.current = false;
    exportDrawing();
  }

  function exportDrawing() {
    const canvas = canvasRef.current;
    if (!canvas || !inkRef.current) {
      onDrawingChange(null);
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      onDrawingChange(new File([blob], "drawing.png", { type: "image/png" }));
    }, "image/png");
  }

  function clear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(0, 0, rect.width, rect.height);
    inkRef.current = false;
    setHasInk(false);
    onDrawingChange(null);
  }

  return (
    <div className="rounded-[2rem] border-2 border-dashed border-amber-300 bg-white/75 p-3 shadow-inner">
      <canvas
        ref={canvasRef}
        aria-label="그림 그리기 캔버스"
        className="canvas-grid h-64 w-full touch-none rounded-[1.4rem] border border-amber-200 bg-white shadow-sm sm:h-80"
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2" aria-label="펜 색상 선택">
          {colors.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setColor(item)}
              className={`h-8 w-8 rounded-full border-2 border-white shadow ring-2 ${item === color ? "ring-stone-900" : "ring-transparent"}`}
              style={{ backgroundColor: item }}
              aria-label={`${item} 색상`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-bold text-amber-900 shadow-sm transition hover:-translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4" /> 지우기
        </button>
      </div>
      {!hasInk && (
        <p className="mt-2 inline-flex items-center gap-2 text-sm text-stone-500">
          <Eraser className="h-4 w-4" /> 손가락이나 마우스로 자유롭게 그려주세요.
        </p>
      )}
    </div>
  );
}
