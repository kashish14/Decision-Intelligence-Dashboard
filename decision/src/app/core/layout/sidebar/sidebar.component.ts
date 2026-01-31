import { Component } from '@angular/core';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Decision Log', route: '/decisions', icon: 'list' },
    { label: 'Trade-offs', route: '/tradeoffs', icon: 'balance' },
    { label: 'Outcome Metrics', route: '/metrics', icon: 'trending' },
    { label: 'Insights', route: '/insights', icon: 'lightbulb' },
  ];
}
