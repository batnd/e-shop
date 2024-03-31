import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { CategoriesService, Category, Product, ProductsService } from '@ltviz/products';
import { EditorModule } from 'primeng/editor';
import { catchError, EMPTY, switchMap, tap, timer } from 'rxjs';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

const UX_MODULE = [
  ButtonModule,
  CardModule,
  ColorPickerModule,
  InputTextModule,
  PaginatorModule,
  ToastModule,
  ToolbarModule,
  InputNumberModule,
  InputTextareaModule,
  InputSwitchModule,
  DropdownModule,
  EditorModule
];

@Component({
  selector: 'admin-e-shop-products-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...UX_MODULE
  ],
  templateUrl: './products-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsFormComponent implements OnInit {
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private categoriesService: CategoriesService = inject(CategoriesService);
  private productsService: ProductsService = inject(ProductsService);
  private messageService: MessageService = inject(MessageService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private location: Location = inject(Location);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  public form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    richDescription: [''],
    image: ['', Validators.required],
    images: [''],
    brand: ['', Validators.required],
    price: ['', Validators.required],
    category: ['', Validators.required],
    countInStock: ['', Validators.required],
    rating: [''],
    numReviews: [''],
    isFeatured: [false]
  });
  public editMode: boolean = false;
  public isSubmitted: boolean = false;
  public categories: Category[] = [];
  public imageDisplay: string | ArrayBuffer = '';
  public currentProductId: string = '';

  ngOnInit(): void {
    this._getCategories();
    this._checkEditMode();
  }

  private _checkEditMode(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params): void => {
        if (params['id']) {
          this.editMode = true;
          this.currentProductId = params['id'];

          this.productsService.getProduct(params['id'])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((product: Product): void => {
              this.productForm['name'].setValue(product.name);
              this.productForm['category'].setValue(product.category?.id);
              this.productForm['brand'].setValue(product.brand);
              this.productForm['price'].setValue(product.price);
              this.productForm['countInStock'].setValue(product.countInStock);
              this.productForm['isFeatured'].setValue(product.isFeatured);
              this.productForm['description'].setValue(product.description);
              this.productForm['richDescription'].setValue(product.richDescription);
              this.imageDisplay = product.image as string;
              this.productForm['image'].setValidators([]);
              this.productForm['image'].updateValueAndValidity();
            });
        }
      })
  }

  private _getCategories(): void {
    this.categoriesService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories: Category[]) => this.categories = categories);
  }

  public get productForm() {
    return this.form.controls;
  }

  public onSubmit(): void {
    this.isSubmitted = true;
    this.markFormAsDirty();

    if (this.form.invalid) return;

    const productFormData: FormData = new FormData();

    Object.keys(this.productForm).map((key: string): void => {
      productFormData.append(key, this.productForm[key].value);
    });

    if (this.editMode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
    }
  }

  private _updateProduct(productData: FormData): void {
    this._disableControls();
    this.productsService.updateProduct(productData, this.currentProductId)
      .pipe(
        tap((product: Product): void => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${product.name} is updated`,
          });
        }),
        switchMap(() => timer(2000)),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.location.back()),
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not updated',
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  public _addProduct(productData: FormData): void {
    this._disableControls();
    this.productsService.createProduct(productData)
      .pipe(
        tap((product: Product): void => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${product.name} is created`,
          });
        }),
        switchMap(() => timer(2000)),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.location.back()),
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not created'
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  private markFormAsDirty(): void {
    this.productForm['name'].markAsDirty();
    this.productForm['description'].markAsDirty();
    this.productForm['brand'].markAsDirty();
    this.productForm['price'].markAsDirty();
    this.productForm['category'].markAsDirty();
    this.productForm['countInStock'].markAsDirty();
  }

  public onCancel(): void {
    this.router.navigateByUrl('products')
  }

  public onImageUpload(event: Event): void {
    const eventTarget: HTMLInputElement = event.target as HTMLInputElement;
    const eventTargetFiles: FileList | null = eventTarget.files;
    let file: File | null = null;

    if (eventTargetFiles) file = eventTargetFiles[0];

    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();

      const fileReader: FileReader = new FileReader();

      fileReader.onload = (): void => {
        if (fileReader.result) this.imageDisplay = fileReader.result;
        this.cd.markForCheck();
      };

      fileReader.readAsDataURL(file);
    }
  }

  private _disableControls(): void {
    this.productForm['name'].disable();
    this.productForm['category'].disable();
    this.productForm['brand'].disable();
    this.productForm['price'].disable();
    this.productForm['countInStock'].disable();
    this.productForm['isFeatured'].disable();
    this.productForm['description'].disable();
    this.productForm['richDescription'].disable();
  }
}
