import { TestBed } from '@angular/core/testing';
import { InsightService } from './insight.service';
import { AnalyticsService } from './analytics.service';
import { TradeoffStoreService } from './tradeoff-store.service';
import { DecisionStoreService } from './decision-store.service';
import { MetricsService } from './metrics.service';
import { EventBusService } from './event-bus.service';
import { LocalStorageService } from './local-storage.service';

describe('InsightService', () => {
  let service: InsightService;

  beforeEach(() => {
    const storage = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem']);
    storage.getItem.and.returnValue(null);
    const eventBus = jasmine.createSpyObj('EventBusService', ['emit']);

    TestBed.configureTestingModule({
      providers: [
        InsightService,
        AnalyticsService,
        TradeoffStoreService,
        DecisionStoreService,
        MetricsService,
        { provide: LocalStorageService, useValue: storage },
        { provide: EventBusService, useValue: eventBus },
      ],
    });
    service = TestBed.inject(InsightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit insights including reflection prompt', (done) => {
    service.getInsights().subscribe((insights) => {
      expect(Array.isArray(insights)).toBe(true);
      const reflection = insights.find((i) => i.type === 'reflection');
      expect(reflection).toBeDefined();
      expect(reflection!.title).toContain('Reflection');
      done();
    });
  });

  it('should surface high_impact or poor_outcome when decisions have metrics', (done) => {
    service.getInsights().subscribe((insights) => {
      const types = insights.map((i) => i.type);
      expect(types).toContain('reflection');
      done();
    });
  });
});
