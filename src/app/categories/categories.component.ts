import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '../shared/services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: false
})
export class CategoriesComponent {
  categories: Category[] = [];
  filtered: Category[] = [];
  filter = '';

  constructor(private svc: CategoriesService, private router: Router) {}

  ngOnInit() {
    this.svc.getAll().subscribe(list => {
      this.categories = list;
      this.filtered = list;
    });
  }

  onFilterChange() {
    const q = this.filter.toLowerCase();
    this.filtered = this.categories.filter(c => c.name.toLowerCase().includes(q));
  }

  reset() {
    this.filter = '';
    this.filtered = this.categories;
  }

  open(cat: Category) {
    const playerName = localStorage.getItem('playerName') || '';
    this.router.navigate(['/quiz', playerName, cat.id]);
  }
}
