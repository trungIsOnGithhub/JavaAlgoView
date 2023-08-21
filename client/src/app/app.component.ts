import { Component, OnInit } from '@angular/core';

const ROOT_ENV = '../../../.env',
    PROTOCOL="http",
    HOST="localhost:3000",
    MY_LEETCODE_USERNAME="";

@Component({ // component decorator describe how component is used at runtime
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  titleSlug: string = "No Data";
  title: string = "No Data";
  content: string = "No Data";
  notes: string[] = [];

  apiBaseURL =  `${PROTOCOL}://${HOST}`;
  username = "kshatriyas";

  // less coupling, more cohesion
  // expression should concise, quick, atomic

  public ngOnInit(): void {
    console.log(`${this.apiBaseURL}/${this.username}`);
    fetch(`${this.apiBaseURL}/${this.username}`)
    .then(res => res.json())
    .then(json => {
      this.titleSlug = json.titleSlug;
      this.title = json.title;
      this.content = json.content;
      this.notes = json.notes;
    });
  }
  // here to define properties, methods, lifeccycle events, dependency injection
}