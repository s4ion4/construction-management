import { Component, inject, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutService } from '../../services/layout.service';
import { ThemeService } from '../../services/theme.service';
import { Logo } from '../logo/logo';
import { Icon } from '../../../shared/components/icon/icon';

interface NavItem {
  label: string;
  routerLink: string;
  icon: string;
}

type UserMenuAction = 'toggleTheme' | 'signOut';

@Component({
  selector: 'app-side-nav',
  imports: [
    Logo,
    RouterLink,
    RouterLinkActive,
    CdkConnectedOverlay,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    MatTooltipModule,
    Icon,
  ],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
})
export class SideNav {
  protected readonly layoutService = inject(LayoutService);
  protected readonly themeService = inject(ThemeService);

  protected readonly userMenu = viewChild<Menu<UserMenuAction>>('userMenu');

  protected readonly user = {
    name: '田中 太郎',
    email: 'tanaka@example.com',
  };

  protected readonly navItems: NavItem[] = [
    { label: '工事', routerLink: '/projects', icon: 'list' },
    { label: '得意先', routerLink: '/customers', icon: 'groups' },
    { label: '部門', routerLink: '/departments', icon: 'domain' },
    { label: '社員', routerLink: '/employees', icon: 'badge' },
  ];

  protected readonly userMenuPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ];

  protected onItemSelected(action: UserMenuAction): void {
    if (action === 'toggleTheme') {
      this.themeService.toggleDarkMode();
    }
  }

  protected onDrawerTransitionEnd(event: TransitionEvent): void {
    if (event.target === event.currentTarget && event.propertyName === 'transform') {
      this.layoutService.endDrawerAnimation();
    }
  }
}
