import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { AboutComponent } from './pages/about/about';
import { TasksComponent } from './pages/tasks/task';
import { AuditComponent } from './pages/audit/audit';

import { authGuard } from './guards/auth.guard';
import { redirectIfAuthGuard } from './guards/redirect-if-auth.guard';

export const routes: Routes = [
    // Home → If logged in redirect to /task
    { path: '', component: HomeComponent, canActivate: [redirectIfAuthGuard] },

    // Login → If logged in redirect to /task
    { path: 'login', component: LoginComponent, canActivate: [redirectIfAuthGuard] },

    { path: 'about', component: AboutComponent },

    // Protected Routes
    { path: 'task', component: TasksComponent, canActivate: [authGuard] },
    { path: 'audit', component: AuditComponent, canActivate: [authGuard] },

    { path: '**', redirectTo: '' }
];
