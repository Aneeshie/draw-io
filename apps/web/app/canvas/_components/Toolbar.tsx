"use client"
import { Button } from "@/components/ui/button";
import { Tool } from "../page";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ToolbarFunctions = {
    undo: () => void
    clear: () => void
    setTool: (tool: Tool) => void
    redo: () => void
}

const Toolbar = ({ undo, clear, setTool, redo }: ToolbarFunctions) => {
    const [selectedTool, setSelectedTool] = useState<Tool>("pen")

    const setToolState = (tool: Tool) => {
        setTool(tool)
        setSelectedTool(tool)
    }

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex gap-2 bg-white p-2 rounded-xl shadow">
                <Button variant="outline" onClick={() => (setToolState("pen"))} className={cn(
                    "transition-colors",
                    selectedTool === "pen" &&
                    "bg-black text-white hover:bg-black hover:text-white"
                )}>Pen</Button>
                <Button variant="outline" onClick={() => (setToolState("eraser"))} className={cn(
                    "transition-colors",
                    selectedTool === "eraser" &&
                    "bg-black text-white hover:bg-black hover:text-white"
                )}>Eraser</Button>
                <Button variant="outline" onClick={undo}>Undo</Button>
                <Button variant="destructive" onClick={clear}>Clear</Button>
                <Button variant="outline" onClick={redo}>Redo</Button>
            </div>
        </div>
    );
};

export default Toolbar;
