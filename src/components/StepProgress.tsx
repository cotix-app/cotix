import { useLocation } from "react-router-dom";

const steps = [
    { path: "/cliente", label: "Cliente" },
    { path: "/activo", label: "Activo" },
    { path: "/problema", label: "Problema" },
    { path: "/tareas", label: "Tareas" },
    { path: "/resumen", label: "Resumen" },
];

export default function StepProgress() {
    const location = useLocation();

    const currentIndex = steps.findIndex(
        (step) => step.path === location.pathname
    );

    if (currentIndex === -1) return null;

    return (<div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between text-sm">
            {steps.map((step, index) => {
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                return (<div key={step.path}
                    className="flex-1 text-center">
                    <span className={
                        isActive ? "text-blue-900 font-semibold" :
                            isCompleted ? "text-green-600" : "text-gray-400"} >
                        {index + 1}. {step.label} </span> </div>);
            })}
        </div>
    </div>
    );


}