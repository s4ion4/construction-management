import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from '../side-nav/side-nav';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SideNav],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  protected readonly layoutService = inject(LayoutService);
}
