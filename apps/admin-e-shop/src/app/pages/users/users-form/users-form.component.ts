import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { CountriesService, User, UsersService } from '@ltviz/users';
import { catchError, EMPTY, switchMap, tap, timer } from 'rxjs';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Country } from '@ltviz/users';

const UX_MODULE = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  ToastModule,
  ConfirmDialogModule,
  InputMaskModule,
  InputSwitchModule,
  DropdownModule
];

@Component({
  selector: 'admin-e-shop-users-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ...UX_MODULE,
    ColorPickerModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFormComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private usersService: UsersService = inject(UsersService);
  private messageService: MessageService = inject(MessageService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private location: Location = inject(Location);
  private router: Router = inject(Router);
  private countriesService: CountriesService = inject(CountriesService);

  public form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', Validators.required],
    isAdmin: [false],
    street: [''],
    apartment: [''],
    zip: [''],
    city: [''],
    country: ['']
  });
  public editMode: boolean = false;
  public isSubmitted: boolean = false;
  public currentUserId: string = '';
  public countries: Country[] = this.countriesService.getCountries();

  public get userForm() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this._checkEditMode();
  }

  public onSubmit(): void {
    this.isSubmitted = true;
    this.markFormAsDirty();

    if (this.form.invalid) return;

    const user: User = {
      id: this.currentUserId,
      name: this.userForm['name'].value,
      email: this.userForm['email'].value,
      phone: this._unformattedPhoneNumber(this.userForm['phone'].value),
      isAdmin: this.userForm['isAdmin'].value,
      street: this.userForm['street'].value,
      apartment: this.userForm['apartment'].value,
      zip: this.userForm['zip'].value,
      city: this.userForm['city'].value,
      country: this.userForm['country'].value,
      password: this.editMode ? (this.userForm['password'].value || '') : this.userForm['password'].value
    }

    if (this.editMode) {
      this._updateUser(user);
    } else {
      this._addUser(user);
    }
  }

  private _checkEditMode(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params): void => {
        if (params['id']) {
          this.editMode = true;
          this.currentUserId = params['id'];

          this.usersService.getUser(params['id'])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user: User): void => {
              this.userForm['name'].setValue(user.name);
              this.userForm['email'].setValue(user.email);
              this.userForm['isAdmin'].setValue(user.isAdmin);
              this.userForm['street'].setValue(user.street);
              this.userForm['apartment'].setValue(user.apartment);
              this.userForm['zip'].setValue(user.zip);
              this.userForm['city'].setValue(user.city);
              this.userForm['country'].setValue(user.country);

              let formattedPhone: string = '';
              if (user.phone) {
                formattedPhone =  this._formattedPhoneNumber(user.phone);
              }
              this.userForm['phone'].setValue(formattedPhone);

              this.userForm['password'].setValidators([]);
              this.userForm['password'].updateValueAndValidity();
            });
        }
      });
  }

  private _addUser(user: User): void {
    this._disableControls();
    this.usersService.createUser(user)
      .pipe(
        tap((user: User): void => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${user.name} is created`,
          });
        }),
        switchMap(() => timer(2000)),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.location.back()),
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User is not created'
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  private _updateUser(user: User): void {
    this._disableControls();
    this.usersService.updateUser(user)
      .pipe(
        tap((user: User): void => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${user.name} is updated`,
          });
        }),
        switchMap(() => timer(2000)),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.location.back()),
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User is not updated',
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  private _unformattedPhoneNumber(formattedPhone: string): string {
    return formattedPhone.replace(/[^\d+]/g, '');
  }

  private _formattedPhoneNumber(unformattedPhone: string): string {
    const pattern: RegExp = /^\+(\d)(\d{3})(\d{3})(\d{4})$/;
    return unformattedPhone.replace(pattern, '+$1 ($2) $3-$4');
  }

  public onCancel(): void {
    this.router.navigateByUrl('users');
  }

  public markFormAsDirty(): void {
    this.userForm['name'].markAsDirty();
    this.userForm['email'].markAsDirty();
    this.userForm['password'].markAsDirty();
    this.userForm['phone'].markAsDirty();
  }

  private _disableControls(): void {
    this.userForm['name'].disable();
    this.userForm['email'].disable();
    this.userForm['password'].disable();
    this.userForm['phone'].disable();
    this.userForm['isAdmin'].disable();
    this.userForm['street'].disable();
    this.userForm['apartment'].disable();
    this.userForm['zip'].disable();
    this.userForm['city'].disable();
    this.userForm['country'].disable();
  }
}
