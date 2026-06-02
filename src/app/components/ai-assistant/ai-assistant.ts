import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-ai-assistant',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.scss'
})
export class AiAssistant {
  private aiService = inject(AiService);
  private auth = inject(Auth);

  question = '';
  loading = signal(false);
  messages = signal<{ role: string; content: string }[]>([]);
  userName = this.auth.currentUser;

  ask() {
    if (!this.question.trim()) return;

    const userQuestion = this.question;
    this.question = '';

    this.messages.update(msgs => [...msgs, {
      role: 'user',
      content: userQuestion
    }]);

    this.loading.set(true);

    this.aiService.ask(userQuestion).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.messages.update(msgs => [...msgs, {
          role: 'ai',
          content: res.answer
        }]);
      },
      error: () => {
        this.loading.set(false);
        this.messages.update(msgs => [...msgs, {
          role: 'ai',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    });
  }

  askSuggestion(suggestion: string) {
    this.question = suggestion;
    this.ask();
  }
}