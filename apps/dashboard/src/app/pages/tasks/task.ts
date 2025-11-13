import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { TaskDialogComponent } from './task-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OrganizationService } from '../../services/organization.service';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        DragDropModule
    ],
    templateUrl: './task.html',
})
export class TasksComponent {

    private dialog = inject(MatDialog);
    private auth = inject(AuthService);
    private taskService = inject(TaskService);
    private userService = inject(UserService);
    private organizationService = inject(OrganizationService);
    private router = inject(Router);

    isKanbanView = false;

    tasks: any[] = [];
    groupedTasks: Record<string, any[]> = {};
    usersMap: Record<string, string> = {};
    organizations: any[] = [];

    allowedToCreate = false;
    allowedToDelete = false;
    allowedToEdit = false;
    allowedToAudit = false;

    filterStatus = '';
    filterAssigned = '';
    filterOrg = '';
    sortBy = 'title_asc';

    tasksTodo: any[] = [];
    tasksProgress: any[] = [];
    tasksDone: any[] = [];

    readonly kanbanIds = ['TODO', 'IN_PROGRESS', 'DONE'];

    currentFilter: string = '';
    currentSort: string = '';

    onFilterChange(event: any) {
        this.currentFilter = event.target.value;
        this.applyFiltersAndSorting();
    }

    onSortChange(event: any) {
        this.currentSort = event.target.value;
        this.applyFiltersAndSorting();
    }

    ngOnInit() {
        const user = this.auth.user();

        if (!user) return;

        const role = user.role?.name;
        const orgId = user.organization.id;

        this.allowedToCreate = this.auth.hasPermission('task:create');
        this.allowedToEdit = this.auth.hasPermission('task:update');
        this.allowedToDelete = this.auth.hasPermission('task:delete');
        this.allowedToAudit = role === "OWNER" || role === "ADMIN";

        // Load organization tree
        this.organizationService.getTree(orgId).subscribe((orgs) => {
            this.organizations = this.dedupeOrgs(this.flattenOrgs(orgs));
            this.loadUsers();
        });
    }

    loadUsers() {
        this.userService.getAll().subscribe((users) => {
            this.usersMap = users.reduce((acc: any, u: any) => {
                acc[u.id] = u.name;
                return acc;
            }, {});

            this.loadTasks();
        });
    }

    loadTasks() {
        this.taskService.getAll().subscribe((t) => {
            const allowedOrgIds = this.organizations.map(o => o.id);

            this.tasks = t
                .filter(task => allowedOrgIds.includes(task.organization.id))
                .map(task => ({
                    ...task,
                    assigneeName: this.usersMap[task.assignedToId] || 'Unassigned',
                }));

            this.applyFiltersAndSorting();
        });
    }

    openAuditLogs() {
        this.router.navigate(['/audit']);
    }

    openCreateDialog() {
        const user = this.auth.user();
        if (!user) return;  // <-- FIX

        const ref = this.dialog.open(TaskDialogComponent, {
            width: '400px',
            data: {
                organizations: this.organizations,
                showOrgSelect: user.role?.name === 'OWNER',
                defaultOrgId: user.organization?.id,
            }
        });

        ref.afterClosed().subscribe(result => {
            if (result) {
                this.taskService.create(result).subscribe(() => this.loadTasks());
            }
        });
    }


    openEditDialog(task: any) {
        const user = this.auth.user();
        if (!user) return;  // <-- FIX

        const ref = this.dialog.open(TaskDialogComponent, {
            width: '400px',
            data: {
                task,
                organizations: this.organizations,
                showOrgSelect: user.role?.name === 'OWNER',
                defaultOrgId: user.organization?.id,
            }
        });

        ref.afterClosed().subscribe(result => {
            if (result) {
                this.taskService.update(task.id, result).subscribe(() => this.loadTasks());
            }
        });
    }


    deleteTask(id: string) {
        this.taskService.delete(id).subscribe(() => this.loadTasks());
    }

    flattenOrgs(tree: any[]): any[] {
        const list: any[] = [];
        const walk = (node: any) => {
            list.push({ id: node.id, name: node.name, children: node.children });
            if (node.children) node.children.forEach(walk);
        };
        tree.forEach(walk);
        return list;
    }

    dedupeOrgs(orgs: any[]) {
        const map = new Map<string, any>();
        orgs.forEach(o => map.set(o.id, o));
        return Array.from(map.values());
    }

    applyFiltersAndSorting() {
        let filtered = [...this.tasks];

        if (this.currentFilter) {
            filtered = filtered.filter(t =>
                t.status === this.currentFilter ||
                t.category.toLowerCase() === this.currentFilter.toLowerCase()
            );
        }

        if (this.currentSort === 'title') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        if (this.currentSort === 'createdBy') {
            filtered.sort((a, b) =>
                (a.createdBy?.name || '').localeCompare(b.createdBy?.name || '')
            );
        }

        if (this.currentSort === 'status') {
            const order: Record<'TODO' | 'IN_PROGRESS' | 'DONE', number> = {
                TODO: 1,
                IN_PROGRESS: 2,
                DONE: 3
            };

            filtered.sort((a, b) => order[a.status as keyof typeof order] - order[b.status as keyof typeof order]);
        }

        this.tasksTodo = filtered.filter(t => t.status === 'TODO');
        this.tasksProgress = filtered.filter(t => t.status === 'IN_PROGRESS');
        this.tasksDone = filtered.filter(t => t.status === 'DONE');

        this.groupedTasks = this.groupByOrg(filtered);
    }

    onDrop(event: CdkDragDrop<any[]>) {

        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            return;
        }

        const item = event.previousContainer.data[event.previousIndex];

        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );

        const newStatus = event.container.id;

        item.status = newStatus;

        this.taskService.update(item.id, { status: newStatus }).subscribe({
            next: () => {
                this.applyFiltersAndSorting();
            }
        });
    }

    groupByOrg(tasks: any[]) {
        const groups: Record<string, any[]> = {};

        for (const task of tasks) {
            const org = task.organization?.name ?? 'Unknown Organization';
            if (!groups[org]) groups[org] = [];
            groups[org].push(task);
        }

        return groups;
    }
}
