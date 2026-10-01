// src/components/Sparkline.jsx
import React from "react";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    YAxis,
} from "recharts";

/**
 * Simple sparkline mini-chart.
 * @param {{ data: number[], color?: string }} props
 */
function Sparkline({ data, color = "#6366f1" }) {
    const chartData = (data || []).map((val, i) => ({ i, val }));

    return (
        <div className="h-8 w-24">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <YAxis domain={["dataMin", "dataMax"]} hide />
                    <Line
                        type="monotone"
                        dataKey="val"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Sparkline;
