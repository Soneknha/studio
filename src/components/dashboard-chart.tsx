"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart } from "recharts"

const chartData = [
  { month: "Jan", reservations: 18 },
  { month: "Fev", reservations: 21 },
  { month: "Mar", reservations: 25 },
  { month: "Abr", reservations: 32 },
  { month: "Mai", reservations: 28 },
  { month: "Jun", reservations: 35 },
]

const chartConfig = {
  reservations: {
    label: "Reservas",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function DashboardChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <RechartsBarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="reservations" fill="var(--color-reservations)" radius={4} />
      </RechartsBarChart>
    </ChartContainer>
  )
}
