import { Component, Input } from '@angular/core';
import { MetricPoint } from '../../../core/models/metric.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent {
  @Input() intended: MetricPoint[] = [];
  @Input() actual: MetricPoint[] = [];
  @Input() height = 120;
  @Input() unit = '';

  get maxValue(): number {
    const all = [...this.intended, ...this.actual].map((p) => p.value);
    return Math.max(100, ...all, 0);
  }

  get pathPoints(): string {
    const w = 100;
    const h = 100;
    const max = this.maxValue;
    const pts = this.intended.map((p, i) => {
      const x = (i / Math.max(1, this.intended.length - 1)) * w;
      const y = h - (p.value / max) * h;
      return `${x},${y}`;
    });
    return pts.length ? `M ${pts.join(' L ')}` : '';
  }

  get actualPathPoints(): string {
    const w = 100;
    const h = 100;
    const max = this.maxValue;
    const pts = this.actual.map((p, i) => {
      const x = (i / Math.max(1, this.actual.length - 1)) * w;
      const y = h - (p.value / max) * h;
      return `${x},${y}`;
    });
    return pts.length ? `M ${pts.join(' L ')}` : '';
  }
}
