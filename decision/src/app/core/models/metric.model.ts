export interface MetricPoint {
  date: string;
  value: number;
  label?: string;
}

export interface OutcomeMetric {
  id: string;
  decisionId: string;
  name: string;
  description?: string;
  targetValue?: number;
  unit?: string;
  intendedEvolution: MetricPoint[];
  actualEvolution: MetricPoint[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMetricDto {
  decisionId: string;
  name: string;
  description?: string;
  targetValue?: number;
  unit?: string;
  intendedEvolution: MetricPoint[];
}
