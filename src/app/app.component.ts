import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ritam-portfolio-app';
  isDarkMode = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.loadTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, 'light-theme');
    }
  }

  private saveTheme() {
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
  }

  private loadTheme() {
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme !== null) {
      this.isDarkMode = JSON.parse(storedTheme);
    }
    this.applyTheme();
  }
}