import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { CountriesService, User, UsersService } from '@ltviz/users';
import { TagModule } from 'primeng/tag';
import { map } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const UX_MODULE = [
  ButtonModule,
  CardModule,
  ConfirmDialogModule,
  TableModule,
  ToastModule,
  ToolbarModule,
  SharedModule,
  TagModule,
  ProgressSpinnerModule,
];

@Component({
  selector: 'admin-e-shop-users-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ...UX_MODULE,
  ],
  templateUrl: './users-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  private userService: UsersService = inject(UsersService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private countriesService: CountriesService = inject(CountriesService);

  public users: User[] = [];

  ngOnInit(): void {
    this._getUsers();
  }

  private _getUsers(): void {
    this.userService.getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((users: User[]): User[] => users.map((user: User) => {
          return {
            ...user,
            country: user.country ? this._getCountryName(user.country) : ''
          }
        }))
      )
      .subscribe((users: User[]): void => {
        this.users = users;
        this.cd.markForCheck();
      });
  }

  private _getCountryName(countryName: string): string {
    return this.countriesService.getCountry(countryName);
  }

  public onDeleteUser(userId: string, userName: string): void {
    this.confirmationService.confirm({
      message: `Do you want to delete user <b>${userName}</b>?`,
      header: 'Delete user',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      rejectButtonStyleClass: 'p-button-text',
      dismissableMask: true,
      accept: (): void => {
        this.userService.deleteUser(userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this._getUsers();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User id deleted',
              });
            },
            error: (): void => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'User is not deleted',
              });
            },
          });
      },
    });
  }

  public onUpdateUser(userId: string): void {
    this.router.navigateByUrl(`users/form/${userId}`);
  }
}
