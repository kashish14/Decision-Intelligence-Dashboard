import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MetricsService } from '../../../core/services/metrics.service';
import { DecisionStoreService } from '../../../core/services/decision-store.service';
import { Observable } from 'rxjs';
import { Decision } from '../../../core/models/decision.model';

@Component({
  selector: 'app-metric-create',
  templateUrl: './metric-create.component.html',
  styleUrls: ['./metric-create.component.scss'],
})
export class MetricCreateComponent implements OnInit {
  form: FormGroup;
  decisions$!: Observable<Decision[]>;
  selectedDecisionId = '';

  constructor(
    private fb: FormBuilder,
    private metrics: MetricsService,
    private decisions: DecisionStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      decisionId: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      targetValue: [null as number | null],
      unit: [''],
      intendedEvolution: this.fb.array([
        this.fb.group({ date: [this.dateStr(-30)], value: [0] }),
        this.fb.group({ date: [this.dateStr(0)], value: [50] }),
        this.fb.group({ date: [this.dateStr(30)], value: [100] }),
      ]),
    });
  }

  ngOnInit(): void {
    this.decisions$ = this.decisions.getAll();
    this.route.queryParams.subscribe((qp) => {
      const id = qp['decisionId'];
      if (id) {
        this.form.patchValue({ decisionId: id });
        this.selectedDecisionId = id;
      }
    });
  }

  get intendedEvolution(): FormArray {
    return this.form.get('intendedEvolution') as FormArray;
  }

  dateStr(daysOffset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().slice(0, 10);
  }

  addPoint(): void {
    const last = this.intendedEvolution.at(this.intendedEvolution.length - 1);
    const lastDate = last?.get('date')?.value;
    const lastVal = last?.get('value')?.value ?? 100;
    this.intendedEvolution.push(
      this.fb.group({
        date: [this.dateStr(30)],
        value: [lastVal],
      })
    );
  }

  removePoint(i: number): void {
    if (this.intendedEvolution.length > 2) this.intendedEvolution.removeAt(i);
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const dto = {
      decisionId: raw.decisionId,
      name: raw.name,
      description: raw.description || undefined,
      targetValue: raw.targetValue != null ? Number(raw.targetValue) : undefined,
      unit: raw.unit || undefined,
      intendedEvolution: raw.intendedEvolution.map((p: { date: string; value: number }) => ({
        date: p.date,
        value: Number(p.value),
      })),
    };
    this.metrics.create(dto).subscribe((m) => this.router.navigate(['/metrics', m.id]));
  }

  cancel(): void {
    this.router.navigate(['/metrics']);
  }
}
