import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoriesService, Category } from '../../app/services/categories.service';

interface Question {
  id: number;
  text: string;
  categoryId: number;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  categoryId!: number;
  category?: Category;
  questions: Question[] = [];
  base = 'http://localhost:3000';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private categories: CategoriesService
  ) {}

  ngOnInit() {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.categories.getById(this.categoryId).subscribe(c => (this.category = c));
    this.http
      .get<Question[]>(`${this.base}/questions?categoryId=${this.categoryId}`)
      .subscribe(q => (this.questions = q));
  }
}
