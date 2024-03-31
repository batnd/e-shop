import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const UX_MODULES = [
  InputGroupModule,
  InputGroupAddonModule,
  InputTextModule,
  ButtonModule,
];

@Component({
  selector: 'users-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...UX_MODULES,
  ],
  templateUrl: './login.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private localStorageService: LocalStorageService = inject(LocalStorageService);
  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);

  public loginRegisterForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  public isSubmitted: boolean = false;
  public authError: boolean = false;
  public authMessage: string = 'Email or Password are wrong!';

  public get form(): { [key: string]: AbstractControl } {
    return this.loginRegisterForm.controls;
  }

  public onSubmit(): void {
    this.isSubmitted = true;
    this.authError = false;

    if (this.loginRegisterForm.invalid) return;

    this.authService.login(this.loginRegisterForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: User): void => {
          if (user && user.token) {
            this.localStorageService.setToken(user.token);
            this.router.navigate(['/']);
          }
        },
        error: (error: HttpErrorResponse): void => {
          this.authError = true;
          this.cdr.markForCheck();

          if (error.status === 200) this.authMessage = error.error.text;
          else if (error.status === 400) this.authMessage = error.error;
          else this.authMessage = 'Error in the Server! Please try again later.';
        }
      });
  }
}
