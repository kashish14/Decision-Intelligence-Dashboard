export interface TradeoffDimension {
  name: string;
  value: number;
  label?: string;
}

export interface Tradeoff {
  id: string;
  decisionId?: string;
  title: string;
  dimensions: TradeoffDimension[];
  rationale: string;
  createdAt: string;
}

export interface CreateTradeoffDto {
  decisionId?: string;
  title: string;
  dimensions: TradeoffDimension[];
  rationale: string;
}
