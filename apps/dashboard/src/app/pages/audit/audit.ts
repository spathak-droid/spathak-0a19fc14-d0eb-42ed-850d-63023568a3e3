import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { OrganizationService } from '../../services/organization.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-audit',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './audit.html',
})
export class AuditComponent {

    private taskService = inject(TaskService);
    private auth = inject(AuthService);
    private organizationService = inject(OrganizationService);

    constructor(private location: Location) {}

    goBack() {
        this.location.back();
    }

    stats: any = null;

    ngOnInit() {
        const user = this.auth.user();   // <-- SIGNAL READ
        if (!user) return;

        const orgId = user.organization.id;

        this.organizationService.getTree(orgId).subscribe(orgTree => {
            const allowedOrgIds = this.flatten(orgTree);

            this.taskService.getAll().subscribe(tasks => {

                const filtered = tasks.filter(
                    t => allowedOrgIds.includes(t.organization.id)
                );

                this.stats = this.buildStats(
                    filtered,
                    orgTree,
                    user.role.name
                );
            });
        });
    }

    flatten(tree: any[]): string[] {
        const ids: string[] = [];
        const walk = (o: any) => {
            ids.push(o.id);
            if (o.children) o.children.forEach(walk);
        };
        tree.forEach(walk);
        return ids;
    }

    buildStats(tasks: any[], orgTree: any[], role: string) {
        const total = tasks.length;
        const done = tasks.filter(t => t.status === 'DONE').length;
        const progress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const todo = tasks.filter(t => t.status === 'TODO').length;

        const percent = total === 0 ? 0 : Math.round((done / total) * 100);

        let orgBreakdown: any[] = [];

        if (role === 'OWNER') {
            orgBreakdown = orgTree.map(org => ({
                name: org.name,
                total: tasks.filter(t => t.organization.id === org.id).length,
                done: tasks.filter(
                    t => t.organization.id === org.id && t.status === 'DONE'
                ).length,
            }));
        }

        return { total, done, progress, todo, percent, orgBreakdown };
    }

    downloadAudit() {
        if (!this.stats) return;

        let text = `AUDIT REPORT\n\n`;
        text += `Total Tasks: ${this.stats.total}\n`;
        text += `Completed: ${this.stats.done}\n`;
        text += `In Progress: ${this.stats.progress}\n`;
        text += `TODO: ${this.stats.todo}\n`;
        text += `Completion Rate: ${this.stats.percent}%\n\n`;

        if (this.stats.orgBreakdown?.length) {
            text += `ORGANIZATION BREAKDOWN:\n`;
            for (const org of this.stats.orgBreakdown) {
                text += `\n- ${org.name}\n`;
                text += `  Total: ${org.total}\n`;
                text += `  Done: ${org.done}\n`;
            }
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'audit.txt';
        a.click();

        window.URL.revokeObjectURL(url);
    }

}
