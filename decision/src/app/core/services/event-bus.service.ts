import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type DecisioEvent =
  | { type: 'decision:created'; payload: { id: string } }
  | { type: 'decision:updated'; payload: { id: string } }
  | { type: 'decision:deleted'; payload: { id: string } }
  | { type: 'metric:updated'; payload: { decisionId: string; metricId: string } }
  | { type: 'tradeoff:created'; payload: { id: string } };

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private bus = new Subject<DecisioEvent>();
  readonly events$ = this.bus.asObservable();

  emit(event: DecisioEvent): void {
    this.bus.next(event);
  }
}
