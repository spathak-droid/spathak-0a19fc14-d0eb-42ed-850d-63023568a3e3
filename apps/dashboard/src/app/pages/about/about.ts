import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section
      class="flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] bg-gradient-to-br from-cyan-400 to-orange-400 text-center text-white px-6 py-16"
    >
      <h1 class="text-4xl font-bold mb-6 drop-shadow-md">About This App</h1>

      <p class="max-w-2xl text-lg leading-relaxed drop-shadow-sm">
        Meet <strong>your task management workspace</strong> — a simple, fast, and
        reliable way to keep work moving.<br /><br />
        Create, assign, and track tasks across your organization with clear roles:
        <span class="font-semibold">Owner</span>, <span class="font-semibold">Admin</span>, and
        <span class="font-semibold">Viewer</span>. Permissions are enforced server-side, so
        the right people see the right things.<br /><br />
        Highlights include org-scoped task lists, secure updates and deletes, and
        lightweight audit logging for peace of mind. Built with
        <span class="font-semibold">Angular</span> on the front end and
        <span class="font-semibold">NestJS + TypeORM</span> on the back end for a smooth,
        scalable experience.
      </p>
    </section>
  `
})
export class AboutComponent {}
