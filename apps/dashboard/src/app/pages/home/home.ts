import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule} from "@angular/material/card"
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatGridListModule
    ],
    templateUrl: './home.html',
})

export class HomeComponent { 
    title =  "Task Manager Tool";
    subtitle = "Plan smart. Work Faster. Finish Better"
}