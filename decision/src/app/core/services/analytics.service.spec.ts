import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { DecisionStoreService } from './decision-store.service';
import { MetricsService } from './metrics.service';
import { TradeoffStoreService } from './tradeoff-store.service';
import { EventBusService } from './event-bus.service';
import { LocalStorageService } from './local-storage.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let decisionStore: DecisionStoreService;
  let metricsService: MetricsService;
  let tradeoffStore: TradeoffStoreService;

  beforeEach(() => {
    const storage = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem']);
    storage.getItem.and.returnValue(null);
    const eventBus = jasmine.createSpyObj('EventBusService', ['emit']);

    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        DecisionStoreService,
        MetricsService,
        TradeoffStoreService,
        { provide: LocalStorageService, useValue: storage },
        { provide: EventBusService, useValue: eventBus },
      ],
    });
    service = TestBed.inject(AnalyticsService);
    decisionStore = TestBed.inject(DecisionStoreService);
    metricsService = TestBed.inject(MetricsService);
    tradeoffStore = TestBed.inject(TradeoffStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should link decisions with metrics and compute outcome score', (done) => {
    decisionStore
      .create({
        title: 'Analytics test',
        problemStatement: 'P',
        optionsConsidered: ['A'],
        chosenOption: 'A',
        assumptions: [],
        risks: [],
        confidenceLevel: 'medium',
        type: 'product',
      })
      .subscribe((decision) => {
        metricsService
          .create({
            decisionId: decision.id,
            name: 'Test metric',
            intendedEvolution: [
              { date: '2025-01-01', value: 0 },
              { date: '2025-02-01', value: 100 },
            ],
          })
          .subscribe((metric) => {
            metricsService.updateActual(metric.id, [
              { date: '2025-02-01', value: 80 },
            ]).subscribe(() => {
              service.getDecisionsWithOutcomes().subscribe((list) => {
                const wo = list.find((w) => w.decision.id === decision.id);
                expect(wo).toBeDefined();
                expect(wo!.metrics.length).toBe(1);
                expect(wo!.outcomeScore).toBeDefined();
                done();
              });
            });
          });
      });
  });
});
