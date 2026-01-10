import { Button } from "@/components/ui/button";

const Toolbar = () => {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex gap-2 bg-white p-2 rounded-xl shadow">
                <Button variant="outline">Pen</Button>
                <Button variant="outline">Eraser</Button>
                <Button variant="destructive">Clear</Button>
            </div>
        </div>
    );
};

export default Toolbar;
