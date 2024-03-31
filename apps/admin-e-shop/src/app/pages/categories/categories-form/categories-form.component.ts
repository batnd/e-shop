import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap, tap, timer } from 'rxjs';
import { CommonModule, Location, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CategoriesService, Category } from '@ltviz/products';
import { ColorPickerModule } from 'primeng/colorpicker';

const UX_MODULE = [
  ButtonModule,
  CardModule,
  TableModule,
  ToolbarModule,
  InputTextModule,
  ToastModule,
  ColorPickerModule
];

@Component({
  selector: 'admin-e-shop-categories-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    ...UX_MODULE
  ],
  templateUrl: './categories-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesFormComponent implements OnInit {
  private messageService: MessageService = inject(MessageService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private categoriesService: CategoriesService = inject(CategoriesService);
  private location: Location = inject(Location);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef: DestroyRef = inject(DestroyRef);

  public form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    icon: ['', Validators.required],
    color: ['#c7c7c7']
  });
  public isSubmitted: boolean = false;
  public editMode: boolean = false;
  private currentCategoryId: string = '';

  public get categoryForm() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this._checkEditMode();
  }

  private _checkEditMode(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params): void => {
        if (params['id']) {
          this.editMode = true;
          this.currentCategoryId = params['id'];

          this.categoriesService.getCategory(params['id'])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((category: Category) => {
              this.categoryForm['name'].setValue(category.name);
              this.categoryForm['icon'].setValue(category.icon);
              this.categoryForm['color'].setValue(category.color);
            });
        }
      });
  }

  public onSubmit(): void {
    this.isSubmitted = true;
    this.categoryForm['name'].markAsDirty();
    this.categoryForm['icon'].markAsDirty();

    if (this.form.invalid) return;

    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm['name'].value,
      icon: this.categoryForm['icon'].value.toLowerCase(),
      color: this.categoryForm['color'].value
    };

    if (this.editMode) this._updateCategory(category);
    else this._addCategory(category);
  }

  private _updateCategory(category: Category): void {
    this._disableControls();
    this.categoriesService.updateCategory(category)
      .pipe(
        tap((category: Category): void => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Category ${category.name} is updated`,
          });
        }),
        switchMap(() => timer(2000)),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.location.back()),
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category is not updated',
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  private _addCategory(category: Category): void {
    this._disableControls();
    this.categoriesService.createCategory(category)
      .pipe(
        tap((category: Category): void => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Category ${category.name} is created`,
          });
        }),
        switchMap(() => timer(2000)),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.location.back()),
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category is not created',
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  private _disableControls(): void {
    this.categoryForm['name'].disable();
    this.categoryForm['icon'].disable();
    this.categoryForm['color'].disable();
  }

  public onCancel(): void {
    this.router.navigateByUrl('categories');
  }
}
