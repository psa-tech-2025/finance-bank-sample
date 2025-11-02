import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Work, WorkService } from 'src/app/service/work.service';


@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  works: Work[] = [];
  showForm = false;
  selectedWork: Work = { title: '', description: '', year: '' };
  selectedFile: File | null = null;
  isAdminLoggedIn = false;

  constructor(
    private workService: WorkService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.translate.setDefaultLang('mr');
  }

  ngOnInit(): void {
    this.fetchWorks();

    // ✅ Listen to auth changes from AuthService
    this.authService.loginStatus$.subscribe(status => {
      this.isAdminLoggedIn = status;
    });
  }

  fetchWorks() {
    this.workService.getAll().subscribe((data) => {
      if (data.length === 0) {
        // ✅ Default work shown when empty
        this.works = [{
          title: 'Website Development',
          description: 'We create professional business and e-commerce websites tailored to your needs.',
          year: new Date().getFullYear().toString(),
          imageUrl: 'https://via.placeholder.com/400x200?text=Our+Work',
          createdAt: Date.now()
        }];
      } else {
        this.works = data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.selectedWork = { title: '', description: '', year: '' };
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveWork() {
    if (this.selectedWork.id) {
      this.workService.update(this.selectedWork.id, this.selectedWork, this.selectedFile || undefined).then(() => {
        this.cancelEdit();
      });
    } else {
      this.workService.add(this.selectedWork, this.selectedFile || undefined).then(() => {
        this.cancelEdit();
      });
    }
  }

  editWork(work: Work) {
    this.selectedWork = { ...work };
    this.showForm = true;
  }

  deleteWork(id?: string) {
    if (id && confirm('Are you sure you want to delete this work?')) {
      this.workService.delete(id);
    }
  }

  cancelEdit() {
    this.showForm = false;
    this.selectedWork = { title: '', description: '', year: '' };
    this.selectedFile = null;
  }
}
