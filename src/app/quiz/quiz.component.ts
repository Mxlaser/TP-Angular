import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { QuizService } from "../shared/services/quiz.service";
import { CategoriesService, Category } from "../shared/services/categories.service";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  standalone: false
})
export class QuizComponent implements OnInit {
  isQuizFinished = this.quizService.isQuizFinished;
  playerName = '';
  categoryId = 0;
  category?: Category;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute,
    private categories: CategoriesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playerName = params['playerName'];
      this.quizService.playerName = this.playerName;
      this.categoryId = Number(params['categoryId']);
      this.categories.getById(this.categoryId).subscribe(c => this.category = c);
    });
  }

  goToResultPage() {
    this.router.navigate(['/result']);
  }
}
