import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() label = '';
  @Input() color: 'accent' | 'success' | 'warning' | 'danger' = 'accent';

  get widthPct(): number {
    if (this.max <= 0) return 0;
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }
}
