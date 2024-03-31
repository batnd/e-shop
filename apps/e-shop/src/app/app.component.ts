import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UsersService } from '@ltviz/users';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
  ],
  selector: 'e-shop-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private usersService: UsersService = inject(UsersService);

  ngOnInit(): void {
    this.usersService.initAppSession();
  }
}
