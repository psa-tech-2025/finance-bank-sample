// src/app/service/header-config.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderConfigService {
  private logoSource = new BehaviorSubject<string | null>(null);
  private titleSource = new BehaviorSubject<string | null>(null);

  logo$ = this.logoSource.asObservable();
  title$ = this.titleSource.asObservable();

  setHeaderLogo(url: string | null) { this.logoSource.next(url); }
  setHeaderTitle(title: string | null) { this.titleSource.next(title); }
}
