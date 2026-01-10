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

export type Tool = "pen" | "eraser"


export default function Canvas() {
    const strokeRef = useRef<Stroke[]>([]);
    const currentStrokeRef = useRef<Point[]>([])
    const currentToolRef = useRef<Tool>("pen")
    const redoStackRef = useRef<Stroke[]>([])


    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawing = useRef(false);

    const setTool = (tool: Tool) => {
        currentToolRef.current = tool
    }

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

        if (currentToolRef.current === "pen") {
            ctx.globalCompositeOperation = "source-over";
        }

        if (currentToolRef.current === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
        }

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing.current = false;

        if (currentStrokeRef.current.length < 2) return;

        strokeRef.current.push({
            points: currentStrokeRef.current,
            color: "black",
            thickness: 3
        })

        redoStackRef.current = [];

        redraw()
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
        if (currentStrokeRef.current.length === 0) return

        const lastStroke = strokeRef.current.pop();
        redoStackRef.current.push(lastStroke!)

        redraw()
    }

    const redo = () => {
        if (redoStackRef.current.length === 0) return;

        const stroke = redoStackRef.current.pop()!;
        strokeRef.current.push(stroke)

        redraw();

    }

    const clear = () => {
        strokeRef.current = [];
        redraw()
    }

    return (
        <>
            <Toolbar undo={undo} clear={clear} setTool={setTool} redo={redo} />
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
