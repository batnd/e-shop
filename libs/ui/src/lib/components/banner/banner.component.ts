import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

const UX_MODULES = [
  ButtonModule
]

@Component({
  selector: 'ltviz-ui-banner',
  standalone: true,
  imports: [
    CommonModule,
    ...UX_MODULES
  ],
  templateUrl: './banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent {}
