import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ltviz-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {}
