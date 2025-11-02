import { Component, OnInit } from '@angular/core';
import { NewsService, NewsItem } from 'src/app/service/news.service';
import { AuthService } from 'src/app/auth/auth.service'; // assuming same as gallery logic

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsList: NewsItem[] = [];
  selectedNews: NewsItem = { title: '', category: '', date: '', content: '' };
  selectedFile: File | null = null;
  showForm = false;
  isAdmin = false;

  constructor(private newsService: NewsService, private auth: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isLoggedIn();
    this.loadNews();
  }

  loadNews() {
    this.newsService.getAll().subscribe((news) => (this.newsList = news));
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.selectedNews = { title: '', category: '', date: '', content: '' };
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveNews() {
    if (this.selectedNews.id) {
      this.newsService
        .update(this.selectedNews.id, this.selectedNews, this.selectedFile || undefined)
        .then(() => this.cancel());
    } else {
      this.newsService
        .add(this.selectedNews, this.selectedFile || undefined)
        .then(() => this.cancel());
    }
  }

  edit(news: NewsItem) {
    this.selectedNews = { ...news };
    this.showForm = true;
  }

  delete(id?: string, imageUrl?: string) {
    if (id && confirm('Are you sure to delete this news?')) {
      this.newsService.delete(id, imageUrl);
    }
  }

  cancel() {
    this.showForm = false;
    this.selectedNews = { title: '', category: '', date: '', content: '' };
    this.selectedFile = null;
  }

  getEmbedUrl(url: string): string {
    if (!url) return '';
    if (url.includes('youtube.com')) {
      const videoId = url.split('v=')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}`;
    }
    if (url.includes('instagram.com')) {
      return `https://www.instagram.com/p/${url.split('/p/')[1]?.split('/')[0]}/embed`;
    }
    return url;
  }
}
