import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  user: string = '';
  pwd: string = '';

  show = () => {
    console.log(`Los valores son: ${this.user} y ${this.pwd}`);
  }
}
