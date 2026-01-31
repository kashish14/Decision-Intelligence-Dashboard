import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { OutcomeMetric, CreateMetricDto, MetricPoint } from '../models/metric.model';
import { EventBusService } from './event-bus.service';
import { LocalStorageService } from './local-storage.service';
import { DecisionStoreService } from './decision-store.service';

const STORAGE_KEY = 'decisio_metrics';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private store = new BehaviorSubject<OutcomeMetric[]>(this.loadFromStorage());
  readonly metrics$ = this.store.asObservable();

  constructor(
    private eventBus: EventBusService,
    private storage: LocalStorageService,
    private decisions: DecisionStoreService
  ) {}

  getAll(): Observable<OutcomeMetric[]> {
    return of(this.store.value).pipe(delay(50));
  }

  getByDecisionId(decisionId: string): Observable<OutcomeMetric[]> {
    const list = this.store.value.filter((m) => m.decisionId === decisionId);
    return of(list).pipe(delay(50));
  }

  getById(id: string): Observable<OutcomeMetric | undefined> {
    const metric = this.store.value.find((m) => m.id === id);
    return of(metric).pipe(delay(50));
  }

  create(dto: CreateMetricDto): Observable<OutcomeMetric> {
    const now = new Date().toISOString();
    const metric: OutcomeMetric = {
      id: this.generateId(),
      ...dto,
      actualEvolution: [],
      createdAt: now,
      updatedAt: now,
    };
    const next = [...this.store.value, metric];
    this.store.next(next);
    this.persist(next);
    this.decisions.linkMetric(dto.decisionId, metric.id).subscribe();
    this.eventBus.emit({
      type: 'metric:updated',
      payload: { decisionId: dto.decisionId, metricId: metric.id },
    });
    return of(metric).pipe(delay(50));
  }

  updateActual(id: string, points: MetricPoint[]): Observable<OutcomeMetric | null> {
    const current = this.store.value;
    const index = current.findIndex((m) => m.id === id);
    if (index === -1) return of(null);
    const updated = {
      ...current[index],
      actualEvolution: [...points],
      updatedAt: new Date().toISOString(),
    };
    const next = [...current];
    next[index] = updated;
    this.store.next(next);
    this.persist(next);
    this.eventBus.emit({
      type: 'metric:updated',
      payload: { decisionId: updated.decisionId, metricId: id },
    });
    return of(updated).pipe(delay(50));
  }

  private loadFromStorage(): OutcomeMetric[] {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : this.getSeedData();
    } catch {
      return this.getSeedData();
    }
  }

  private persist(metrics: OutcomeMetric[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  }

  private generateId(): string {
    return `met_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  private getSeedData(): OutcomeMetric[] {
    const now = new Date().toISOString();
    const baseDate = new Date();
    const d = (days: number) => new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return [
      {
        id: 'met_seed_1',
        decisionId: 'dec_seed_1',
        name: 'Event coverage',
        description: '% of key flows instrumented',
        targetValue: 80,
        unit: '%',
        intendedEvolution: [
          { date: d(-30), value: 20 },
          { date: d(0), value: 50 },
          { date: d(30), value: 80 },
        ],
        actualEvolution: [
          { date: d(-30), value: 18 },
          { date: d(0), value: 45 },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'met_seed_2',
        decisionId: 'dec_seed_2',
        name: 'Deploy frequency',
        description: 'Deploys per week',
        targetValue: 5,
        unit: '/week',
        intendedEvolution: [
          { date: d(-60), value: 1 },
          { date: d(0), value: 3 },
          { date: d(30), value: 5 },
        ],
        actualEvolution: [
          { date: d(-60), value: 1 },
          { date: d(-30), value: 2 },
          { date: d(0), value: 4 },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'met_seed_3',
        decisionId: 'dec_seed_3',
        name: 'Sprint predictability',
        description: '% of committed stories delivered',
        targetValue: 85,
        unit: '%',
        intendedEvolution: [
          { date: d(-60), value: 60 },
          { date: d(0), value: 75 },
          { date: d(60), value: 85 },
        ],
        actualEvolution: [
          { date: d(-60), value: 58 },
          { date: d(0), value: 78 },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'met_seed_4',
        decisionId: 'dec_seed_5',
        name: 'Monthly retention (D30)',
        description: 'Users still active 30 days after signup',
        targetValue: 40,
        unit: '%',
        intendedEvolution: [
          { date: d(-90), value: 28 },
          { date: d(0), value: 35 },
          { date: d(90), value: 40 },
        ],
        actualEvolution: [
          { date: d(-90), value: 27 },
          { date: d(-30), value: 32 },
          { date: d(0), value: 36 },
        ],
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
}
