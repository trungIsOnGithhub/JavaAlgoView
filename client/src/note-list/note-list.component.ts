import { Input, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'note-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})

export class NoteList {
  contentToAdd: string = "";

  @Input() titleSlug :string = '';
  @Input() apiBaseURL :string = '';
  @Input() notes :string[] = [];

  onKey(event: any) {
    // this.contentToAdd = event.target.value;
    const content = ((document.getElementById("contentToAdd") as HTMLInputElement).value);
    console.log(content);
    console.log(`${this.apiBaseURL}/${this.titleSlug}/note`);
    fetch(`${this.apiBaseURL}/${this.titleSlug}/note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: content
      })
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(error => console.error(error));
  }
}
