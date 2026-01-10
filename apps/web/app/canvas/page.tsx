"use client";

import { useEffect, useRef } from "react";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctxRef.current = ctx;

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;

            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const ctx = ctxRef.current!;
        isDrawing.current = true;

        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current) return;

        const ctx = ctxRef.current!;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };

    return (
        <canvas
            ref={canvasRef}
            className="block bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
        />
    );
}
