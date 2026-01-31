import { TestBed } from '@angular/core/testing';
import { DecisionStoreService } from './decision-store.service';
import { EventBusService } from './event-bus.service';
import { LocalStorageService } from './local-storage.service';

describe('DecisionStoreService', () => {
  let service: DecisionStoreService;
  let storage: jasmine.SpyObj<LocalStorageService>;
  let eventBus: jasmine.SpyObj<EventBusService>;

  beforeEach(() => {
    storage = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem']);
    storage.getItem.and.returnValue(null);
    eventBus = jasmine.createSpyObj('EventBusService', ['emit']);

    TestBed.configureTestingModule({
      providers: [
        DecisionStoreService,
        { provide: LocalStorageService, useValue: storage },
        { provide: EventBusService, useValue: eventBus },
      ],
    });
    service = TestBed.inject(DecisionStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a decision and emit event', (done) => {
    const dto = {
      title: 'Test decision',
      problemStatement: 'Test problem',
      optionsConsidered: ['A', 'B'],
      chosenOption: 'A',
      assumptions: ['Assumption 1'],
      risks: ['Risk 1'],
      confidenceLevel: 'medium' as const,
      type: 'product' as const,
    };
    service.create(dto).subscribe((decision) => {
      expect(decision.title).toBe(dto.title);
      expect(decision.id).toBeDefined();
      expect(decision.id.startsWith('dec_')).toBe(true);
      expect(eventBus.emit).toHaveBeenCalledWith({
        type: 'decision:created',
        payload: { id: decision.id },
      });
      done();
    });
  });

  it('should return all decisions after create', (done) => {
    const dto = {
      title: 'List test',
      problemStatement: 'P',
      optionsConsidered: ['X'],
      chosenOption: 'X',
      assumptions: [],
      risks: [],
      confidenceLevel: 'high' as const,
      type: 'tech' as const,
    };
    service.create(dto).subscribe(() => {
      service.getAll().subscribe((list) => {
        expect(list.length).toBeGreaterThanOrEqual(1);
        expect(list.some((d) => d.title === dto.title)).toBe(true);
        done();
      });
    });
  });
});
