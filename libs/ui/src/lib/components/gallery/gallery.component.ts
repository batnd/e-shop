import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ltviz-ui-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  @Input()
  public images: string[] | undefined;

  public selectedImageUrl: string | undefined;

  get hasImages(): boolean {
    if (this.images?.length) return this.images.length > 0;
    else return false;
  }

  ngOnInit(): void {
    if (this.hasImages && this.images?.length) {
      this.selectedImageUrl = this.images[0];
    }
  }

  public changeSelectedImage(image: string): void {
    if (this.selectedImageUrl === image) return;

    this.selectedImageUrl = image;
    this.cdr.markForCheck();
  }
}
