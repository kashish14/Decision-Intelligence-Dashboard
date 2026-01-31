import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Decision, CreateDecisionDto } from '../models/decision.model';
import { EventBusService } from './event-bus.service';
import { LocalStorageService } from './local-storage.service';

const STORAGE_KEY = 'decisio_decisions';

@Injectable({ providedIn: 'root' })
export class DecisionStoreService {
  private store = new BehaviorSubject<Decision[]>(this.loadFromStorage());
  readonly decisions$ = this.store.asObservable();

  constructor(
    private eventBus: EventBusService,
    private storage: LocalStorageService
  ) {}

  getAll(): Observable<Decision[]> {
    return of(this.store.value).pipe(delay(50));
  }

  getById(id: string): Observable<Decision | undefined> {
    const decision = this.store.value.find((d) => d.id === id);
    return of(decision).pipe(delay(50));
  }

  create(dto: CreateDecisionDto): Observable<Decision> {
    const now = new Date().toISOString();
    const decision: Decision = {
      id: this.generateId(),
      ...dto,
      createdAt: now,
      updatedAt: now,
      metricIds: [],
    };
    const next = [...this.store.value, decision];
    this.store.next(next);
    this.persist(next);
    this.eventBus.emit({ type: 'decision:created', payload: { id: decision.id } });
    return of(decision).pipe(delay(50));
  }

  update(id: string, patch: Partial<Decision>): Observable<Decision | null> {
    const current = this.store.value;
    const index = current.findIndex((d) => d.id === id);
    if (index === -1) return of(null);
    const updated = {
      ...current[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    const next = [...current];
    next[index] = updated;
    this.store.next(next);
    this.persist(next);
    this.eventBus.emit({ type: 'decision:updated', payload: { id } });
    return of(updated).pipe(delay(50));
  }

  delete(id: string): Observable<boolean> {
    const next = this.store.value.filter((d) => d.id !== id);
    if (next.length === this.store.value.length) return of(false);
    this.store.next(next);
    this.persist(next);
    this.eventBus.emit({ type: 'decision:deleted', payload: { id } });
    return of(true).pipe(delay(50));
  }

  linkMetric(decisionId: string, metricId: string): Observable<boolean> {
    return this.getById(decisionId).pipe(
      switchMap((d) => {
        if (!d) return of(false);
        const metricIds = [...(d.metricIds ?? []), metricId];
        return this.update(decisionId, { metricIds }).pipe(
          map((updated) => updated != null)
        );
      }),
      delay(50)
    );
  }

  private loadFromStorage(): Decision[] {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : this.getSeedData();
    } catch {
      return this.getSeedData();
    }
  }

  private persist(decisions: Decision[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  }

  private generateId(): string {
    return `dec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  private getSeedData(): Decision[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'dec_seed_1',
        title: 'Launch MVP without advanced analytics',
        problemStatement: 'We needed to ship quickly but had limited analytics capacity.',
        optionsConsidered: ['Full analytics', 'MVP with basic events', 'No analytics'],
        chosenOption: 'MVP with basic events',
        assumptions: ['We can add analytics later', 'Basic events cover 80% of needs'],
        risks: ['Might miss important signals', 'Retrofitting is costly'],
        confidenceLevel: 'medium',
        type: 'product',
        createdAt: now,
        updatedAt: now,
        metricIds: ['met_seed_1'],
      },
      {
        id: 'dec_seed_2',
        title: 'Choose monolith over microservices for v1',
        problemStatement: 'Team size and domain clarity did not justify microservices yet.',
        optionsConsidered: ['Microservices', 'Modular monolith', 'Monolith'],
        chosenOption: 'Modular monolith',
        assumptions: ['Domain boundaries will emerge', 'We can extract services later'],
        risks: ['Scaling limits', 'Deployment coupling'],
        confidenceLevel: 'high',
        type: 'tech',
        createdAt: now,
        updatedAt: now,
        metricIds: ['met_seed_2'],
      },
      {
        id: 'dec_seed_3',
        title: 'Two-week sprint cadence over one-week',
        problemStatement: 'Team was split on sprint length; we needed a sustainable pace.',
        optionsConsidered: ['One week', 'Two weeks', 'Three weeks', 'Kanban'],
        chosenOption: 'Two weeks',
        assumptions: ['Stakeholders can wait 2 weeks for demos', 'Planning overhead is acceptable'],
        risks: ['Slower feedback', 'Bigger batches'],
        confidenceLevel: 'high',
        type: 'process',
        createdAt: now,
        updatedAt: now,
        metricIds: ['met_seed_3'],
      },
      {
        id: 'dec_seed_4',
        title: 'Build in-house auth vs Auth0',
        problemStatement: 'Budget and control vs time-to-market for authentication.',
        optionsConsidered: ['Auth0', 'Cognito', 'In-house with OAuth'],
        chosenOption: 'Auth0',
        assumptions: ['Auth0 scales with us', 'Compliance requirements are met'],
        risks: ['Vendor lock-in', 'Cost at scale'],
        confidenceLevel: 'medium',
        type: 'tech',
        createdAt: now,
        updatedAt: now,
        metricIds: [],
      },
      {
        id: 'dec_seed_5',
        title: 'Prioritize retention over acquisition for Q1',
        problemStatement: 'Churn was high; we had to choose where to focus.',
        optionsConsidered: ['50/50', 'Acquisition focus', 'Retention focus'],
        chosenOption: 'Retention focus',
        assumptions: ['Retention improvements will compound', 'Acquisition can wait a quarter'],
        risks: ['Slower top-line growth', 'Board expectations'],
        confidenceLevel: 'high',
        type: 'product',
        createdAt: now,
        updatedAt: now,
        metricIds: ['met_seed_4'],
      },
      {
        id: 'dec_seed_6',
        title: 'Document decisions in Decision instead of Confluence',
        problemStatement: 'Decision context was scattered; we wanted one place to link outcomes.',
        optionsConsidered: ['Confluence', 'Notion', 'Decision', 'GitHub wiki'],
        chosenOption: 'Decision',
        assumptions: ['Team will adopt the tool', 'Outcome linking adds real value'],
        risks: ['Low adoption', 'Duplicate documentation'],
        confidenceLevel: 'medium',
        type: 'process',
        createdAt: now,
        updatedAt: now,
        metricIds: [],
      },
    ];
  }
}
