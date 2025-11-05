
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CategoriesService, Category } from '../../app/services/categories.service';

interface Answer {
  id?: number;
  questionId: number;
  answerLabel: string;
  isCorrect: boolean;
}
interface Question {
  id: number;
  questionLabel?: string;
  text?: string;
  categoryId: number;
  answers?: Answer[];
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  username = '';
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
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.username = params.get('username') || params.get('pseudo') || '';
      let idParam = params.get('id') || params.get('categoryId') || '';
      if (!idParam) {
        const segs: UrlSegment[] = this.route.snapshot.url || [];
        if (segs.length) idParam = segs[segs.length - 1].path;
      }

      this.categoryId = Number(idParam);
      if (!this.categoryId || Number.isNaN(this.categoryId)) {
        this.questions = [];
        this.category = undefined;
        return;
      }

      this.categories.getById(this.categoryId).subscribe({
        next: c => this.category = c,
        error: () => this.category = { id: this.categoryId, name: `Category #${this.categoryId}` } as Category
      });

      const paramsHttp = new HttpParams()
        .set('categoryId', String(this.categoryId))
        .set('_embed', 'answers');

      this.http.get<Question[]>(`${this.base}/questions`, { params: paramsHttp })
        .subscribe(qs => {
          this.questions = (qs || []).map(q => ({ ...q, text: q.text ?? q.questionLabel }));
        });
    });
  }
}
