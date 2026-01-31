import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { Tradeoff, CreateTradeoffDto } from '../models/tradeoff.model';
import { EventBusService } from './event-bus.service';
import { LocalStorageService } from './local-storage.service';

const STORAGE_KEY = 'decisio_tradeoffs';

@Injectable({ providedIn: 'root' })
export class TradeoffStoreService {
  private store = new BehaviorSubject<Tradeoff[]>(this.loadFromStorage());
  readonly tradeoffs$ = this.store.asObservable();

  constructor(
    private eventBus: EventBusService,
    private storage: LocalStorageService
  ) {}

  getAll(): Observable<Tradeoff[]> {
    return of(this.store.value).pipe(delay(50));
  }

  getByDecisionId(decisionId: string): Observable<Tradeoff[]> {
    const list = this.store.value.filter((t) => t.decisionId === decisionId);
    return of(list).pipe(delay(50));
  }

  create(dto: CreateTradeoffDto): Observable<Tradeoff> {
    const tradeoff: Tradeoff = {
      id: this.generateId(),
      ...dto,
      createdAt: new Date().toISOString(),
    };
    const next = [...this.store.value, tradeoff];
    this.store.next(next);
    this.persist(next);
    this.eventBus.emit({ type: 'tradeoff:created', payload: { id: tradeoff.id } });
    return of(tradeoff).pipe(delay(50));
  }

  private loadFromStorage(): Tradeoff[] {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : this.getSeedData();
    } catch {
      return this.getSeedData();
    }
  }

  private persist(tradeoffs: Tradeoff[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(tradeoffs));
  }

  private generateId(): string {
    return `to_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  private getSeedData(): Tradeoff[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'to_seed_1',
        decisionId: 'dec_seed_1',
        title: 'Speed vs quality',
        dimensions: [
          { name: 'Speed to market', value: 80, label: 'High' },
          { name: 'Feature completeness', value: 40, label: 'Medium-low' },
        ],
        rationale: 'We prioritized shipping a usable MVP over full feature set to validate demand.',
        createdAt: now,
      },
      {
        id: 'to_seed_2',
        decisionId: 'dec_seed_2',
        title: 'Simplicity vs scalability',
        dimensions: [
          { name: 'Operational simplicity', value: 90, label: 'High' },
          { name: 'Horizontal scale headroom', value: 50, label: 'Medium' },
        ],
        rationale: 'Monolith keeps ops and debugging simple while we find product-market fit.',
        createdAt: now,
      },
      {
        id: 'to_seed_3',
        decisionId: 'dec_seed_3',
        title: 'Predictability vs flexibility',
        dimensions: [
          { name: 'Predictable delivery', value: 85, label: 'High' },
          { name: 'Ad-hoc changes', value: 35, label: 'Lower' },
        ],
        rationale: 'Two-week sprints give enough buffer for planning while allowing some flexibility.',
        createdAt: now,
      },
      {
        id: 'to_seed_4',
        decisionId: 'dec_seed_4',
        title: 'Cost vs control',
        dimensions: [
          { name: 'Time to market', value: 90, label: 'High' },
          { name: 'Full control', value: 30, label: 'Low' },
        ],
        rationale: 'Auth0 gets us to market faster; we can revisit in-house if compliance demands it.',
        createdAt: now,
      },
      {
        id: 'to_seed_5',
        decisionId: 'dec_seed_5',
        title: 'Retention vs growth',
        dimensions: [
          { name: 'Retention focus', value: 85, label: 'High' },
          { name: 'Acquisition focus', value: 25, label: 'Low' },
        ],
        rationale: 'Stopping the leak first; acquisition will be more efficient with better retention.',
        createdAt: now,
      },
    ];
  }
}
