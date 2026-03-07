"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
    { src: "/screenshot-catalog.png", alt: "SQL Console & Data Catalog", label: "SQL Console" },
    { src: "/screenshot-profiler.png", alt: "Query Plan & Profiler", label: "Query Profiler" },
    { src: "/screenshot-loclo-catalog.png", alt: "Local Hub & Table View", label: "Local Hub" },
    { src: "/screenshot-notebook-editor.png", alt: "Notebook Editor with marimo", label: "Notebook Editor" },
    { src: "/screenshot-connections.png", alt: "Database Connections", label: "Connections" },
]

export function ImageSlider() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative w-full">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((slide, idx) => (
                        <div key={idx} className="w-full flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={slide.src}
                                alt={slide.alt}
                                className="w-full h-auto"
                                loading={idx === 0 ? "eager" : "lazy"}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Apple HIG Page Control dots */}
            <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`rounded-full transition-all duration-300 ${idx === current
                            ? "w-2 h-2 bg-foreground"
                            : "w-2 h-2 bg-foreground/25 hover:bg-foreground/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
