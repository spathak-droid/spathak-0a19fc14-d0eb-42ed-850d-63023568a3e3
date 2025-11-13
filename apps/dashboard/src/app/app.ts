import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './pages/header/header';

@Component({
  imports: [RouterModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public title = 'dashboard';
}
