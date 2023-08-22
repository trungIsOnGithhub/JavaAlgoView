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

  @Input() titleSlug = '';
  @Input() apiBaseURL = '';
  @Input() notes = [];

  onKey(event: any) {
    // this.contentToAdd = event.target.value;
    const content = ((document.getElementById("contentToAdd") as HTMLInputElement).value);
    console.log(content);
    fetch(`${this.apiBaseURL}/${this.titleSlug}/note`)
    .then(res => res.json())
    .then(json => console.log(json));
  }
}
