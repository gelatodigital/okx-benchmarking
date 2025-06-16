import { RowLabel } from "./RowLabel";

interface MetricLabel {
  label: string;
  tooltipText?: string;
}

interface MetricsLabelsProps {
  metrics: MetricLabel[];
  emptyElementClassName?: string;
}

export const MetricsLabels = ({
  metrics = [
    { label: "Latency (s)", tooltipText: "Latency" },
    { label: "Estimated Gas", tooltipText: "Estimated Gas" },
    { label: "L1 Gas", tooltipText: "L1 Gas" },
    { label: "L2 Gas", tooltipText: "L2 Gas" },
    { label: "Tx Hash", tooltipText: "Tx Hash" },
  ],
  emptyElementClassName,
}: MetricsLabelsProps) => {
  return (
    <div className="flex flex-col w-full">
      {/* Empty element */}
      <div className={`flex flex-col  ${emptyElementClassName}`} />
      {/* Label */}
      <div className="flex flex-col">
        {metrics.map((metric) => (
          <RowLabel
            key={metric.label}
            label={metric.label}
            tooltipText={metric.tooltipText}
          />
        ))}
      </div>
    </div>
  );
};
