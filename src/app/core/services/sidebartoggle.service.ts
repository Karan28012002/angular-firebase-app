import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebartoggleService {
  private sidebarOpenSource = new BehaviorSubject<boolean>(false); // false = closed by default
  sidebarOpen$ = this.sidebarOpenSource.asObservable();

  setSidebar(open: boolean) {
    this.sidebarOpenSource.next(open);
  }

  toggleSidebar() {
    this.sidebarOpenSource.next(!this.sidebarOpenSource.value);
  }
}
