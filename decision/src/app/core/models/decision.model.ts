export type DecisionType = 'product' | 'tech' | 'process';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface Decision {
  id: string;
  title: string;
  problemStatement: string;
  optionsConsidered: string[];
  chosenOption: string;
  assumptions: string[];
  risks: string[];
  confidenceLevel: ConfidenceLevel;
  type: DecisionType;
  createdAt: string;
  updatedAt: string;
  metricIds?: string[];
}

export interface CreateDecisionDto {
  title: string;
  problemStatement: string;
  optionsConsidered: string[];
  chosenOption: string;
  assumptions: string[];
  risks: string[];
  confidenceLevel: ConfidenceLevel;
  type: DecisionType;
}
