"use client";

import { useEffect, useRef } from "react";
import Toolbar from "./_components/Toolbar";

type Point = {
    x: number,
    y: number
}

type Stroke = {
    points: Point[],
    color: string,
    thickness: number
}

export default function Canvas() {
    const strokeRef = useRef<Stroke[]>([]);
    const currentStrokeRef = useRef<Point[]>([])

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
            redraw()

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

        currentStrokeRef.current = [];
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        currentStrokeRef.current.push({ x, y })


        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current) return;

        const ctx = ctxRef.current!;

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        currentStrokeRef.current.push({ x, y })

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing.current = false;

        strokeRef.current.push({
            points: currentStrokeRef.current,
            color: "black",
            thickness: 3
        })
    };

    const redraw = () => {
        const canvas = canvasRef.current!;
        const ctx = ctxRef.current!;

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const stroke of strokeRef.current) {
            ctx.beginPath();
            ctx.strokeStyle = stroke.color
            ctx.lineWidth = stroke.thickness


            ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

            for (const p of stroke.points) {
                ctx.lineTo(p.x, p.y)
            }

            ctx.stroke()
        }
    }

    const undo = () => {
        strokeRef.current.pop();
        redraw()
    }

    return (
        <>
            <Toolbar undo={undo} />
            <canvas
                ref={canvasRef}
                className="block bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
        </>
    );
}
