import { Component } from '@angular/core';
import { SharedService } from './shared/shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private sharedService: SharedService) {}
  ngOnInit() {
    this.sharedService.setUserData('0', '0', '0');
  }
}
