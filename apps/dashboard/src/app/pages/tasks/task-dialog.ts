import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user.service';

@Component({
    standalone: true,
    selector: 'app-task-dialog',
    templateUrl: './task-dialog.html',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
    ]
})
export class TaskDialogComponent {
    private dialogRef = inject(MatDialogRef<TaskDialogComponent>);
    private data = inject(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    private userService = inject(UserService);

    users: any[] = [];
    organizations: any[] = [];
    showOrgSelect = false;
    isEdit = !!this.data?.task;

    form: FormGroup = this.fb.group({
        title: [this.data?.task?.title || '', Validators.required],
        description: [this.data?.task?.description || ''],
        status: [this.data?.task?.status ?? 'TODO'],
        category: [this.data?.task?.category || 'Work'],
        assignedToId: [this.data?.task?.assignedTo?.id || null],
        organizationId: [null, Validators.required]
    });

    ngOnInit() {
        console.log("DIALOG DATA:", this.data);
        this.userService.getAll().subscribe((res) => {
            this.users = res;
        });

        this.organizations = this.data.organizations || [];
        this.showOrgSelect = this.data.showOrgSelect || false;

        if (this.isEdit) {
            this.form.patchValue({
                organizationId: this.data.task.organization?.id
            });
            this.form.patchValue({
                organizationId: this.data.task.organization?.id,
                category: this.data.task.category
            });

        } else {
            if (!this.showOrgSelect) {
                this.form.patchValue({ organizationId: this.data.defaultOrgId });
            }
        }
    }



    save() {
        if (this.form.invalid) return;

        const user = JSON.parse(localStorage.getItem('user')!);

        const payload = {
            ...this.form.value,
            createdById: user.id
        };

        if (this.isEdit) {
            payload['id'] = this.data.task.id;
        }

        this.dialogRef.close(payload);
    }

    close() {
        this.dialogRef.close(null);
    }
}
