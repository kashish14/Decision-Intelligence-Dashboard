import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DecisionStoreService } from '../../../core/services/decision-store.service';
import { ConfidenceLevel, DecisionType } from '../../../core/models/decision.model';

@Component({
  selector: 'app-decision-create',
  templateUrl: './decision-create.component.html',
  styleUrls: ['./decision-create.component.scss'],
})
export class DecisionCreateComponent {
  form: FormGroup;
  confidenceLevels: ConfidenceLevel[] = ['low', 'medium', 'high'];
  decisionTypes: DecisionType[] = ['product', 'tech', 'process'];

  constructor(
    private fb: FormBuilder,
    private store: DecisionStoreService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      problemStatement: ['', Validators.required],
      optionsConsidered: this.fb.array([this.fb.control('', Validators.required)]),
      chosenOption: ['', Validators.required],
      assumptions: this.fb.array([this.fb.control('')]),
      risks: this.fb.array([this.fb.control('')]),
      confidenceLevel: ['medium', Validators.required],
      type: ['product', Validators.required],
    });
  }

  get optionsConsidered(): FormArray {
    return this.form.get('optionsConsidered') as FormArray;
  }

  get assumptions(): FormArray {
    return this.form.get('assumptions') as FormArray;
  }

  get risks(): FormArray {
    return this.form.get('risks') as FormArray;
  }

  addOption(): void {
    this.optionsConsidered.push(this.fb.control('', Validators.required));
  }

  removeOption(i: number): void {
    if (this.optionsConsidered.length > 1) this.optionsConsidered.removeAt(i);
  }

  addAssumption(): void {
    this.assumptions.push(this.fb.control(''));
  }

  removeAssumption(i: number): void {
    if (this.assumptions.length > 1) this.assumptions.removeAt(i);
  }

  addRisk(): void {
    this.risks.push(this.fb.control(''));
  }

  removeRisk(i: number): void {
    if (this.risks.length > 1) this.risks.removeAt(i);
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const dto = {
      title: raw.title,
      problemStatement: raw.problemStatement,
      optionsConsidered: raw.optionsConsidered.filter((s: string) => s?.trim()),
      chosenOption: raw.chosenOption,
      assumptions: raw.assumptions.filter((s: string) => s?.trim()),
      risks: raw.risks.filter((s: string) => s?.trim()),
      confidenceLevel: raw.confidenceLevel,
      type: raw.type,
    };
    this.store.create(dto).subscribe((d) => this.router.navigate(['/decisions', d.id]));
  }

  cancel(): void {
    this.router.navigate(['/decisions']);
  }
}
