import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2, HostListener, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ritam-portfolio-app';
  isDarkMode = false;
  currentSection = 'home';
  scrollProgress = 0;

  constructor(private renderer: Renderer2, private router: Router) { }

  ngOnInit() {
    this.loadTheme();
    // Initialize AOS with fixed settings
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,  // Animation happens only once
      mirror: false,  // Don't repeat animation when scrolling back
      offset: 50,
      anchorPlacement: 'top-bottom',
      disable: false
    });

    // Refresh AOS on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    });
  }

  ngAfterViewInit() {
    // Refresh AOS after view initialization
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Update scroll progress
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = (winScroll / height) * 100;

    // Update current section
    this.updateCurrentSection();
  }

  private updateCurrentSection() {
    const sections = ['home', 'about', 'projects', 'contact'];
    const currentScrollPos = window.pageYOffset;
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const top = element.offsetTop - 100;
        const bottom = top + element.offsetHeight;
        if (currentScrollPos >= top && currentScrollPos < bottom) {
          this.currentSection = section;
        }
      }
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveTheme();
  }

  private applyTheme() {
    const wrapper = document.querySelector('.page-wrapper');
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      if (wrapper) {
        this.renderer.addClass(wrapper, 'dark-mode');
      }
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      if (wrapper) {
        this.renderer.removeClass(wrapper, 'dark-mode');
      }
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