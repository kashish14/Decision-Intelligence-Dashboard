import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TradeoffStoreService } from '../../../core/services/tradeoff-store.service';
import { DecisionStoreService } from '../../../core/services/decision-store.service';
import { Observable } from 'rxjs';
import { Decision } from '../../../core/models/decision.model';

@Component({
  selector: 'app-tradeoff-create',
  templateUrl: './tradeoff-create.component.html',
  styleUrls: ['./tradeoff-create.component.scss'],
})
export class TradeoffCreateComponent {
  form: FormGroup;
  decisions$: Observable<Decision[]>;

  constructor(
    private fb: FormBuilder,
    private store: TradeoffStoreService,
    private decisions: DecisionStoreService,
    private router: Router
  ) {
    this.decisions$ = this.decisions.getAll();
    this.form = this.fb.group({
      decisionId: [''],
      title: ['', Validators.required],
      rationale: ['', Validators.required],
      dimensions: this.fb.array([
        this.fb.group({ name: ['', Validators.required], value: [50, [Validators.required, Validators.min(0), Validators.max(100)]], label: [''] }),
        this.fb.group({ name: ['', Validators.required], value: [50, [Validators.required, Validators.min(0), Validators.max(100)]], label: [''] }),
      ]),
    });
  }

  get dimensions(): FormArray {
    return this.form.get('dimensions') as FormArray;
  }

  addDimension(): void {
    this.dimensions.push(
      this.fb.group({
        name: ['', Validators.required],
        value: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
        label: [''],
      })
    );
  }

  removeDimension(i: number): void {
    if (this.dimensions.length > 2) this.dimensions.removeAt(i);
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const dto = {
      decisionId: raw.decisionId || undefined,
      title: raw.title,
      rationale: raw.rationale,
      dimensions: raw.dimensions.map((d: { name: string; value: number; label: string }) => ({
        name: d.name,
        value: Number(d.value),
        label: d.label || undefined,
      })),
    };
    this.store.create(dto).subscribe(() => this.router.navigate(['/tradeoffs']));
  }

  cancel(): void {
    this.router.navigate(['/tradeoffs']);
  }
}
