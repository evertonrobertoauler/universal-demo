import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public form: FormGroup;

  constructor(private _title: Title, private _fb: FormBuilder) { }

  ngOnInit() {
    this.form = this._fb.group({ title: ['World!'] });

    this.setPageTitle(this.form.value);

    this.form.valueChanges.subscribe(value => this.setPageTitle.bind(value));
  }

  setPageTitle(formValue) {
    this._title.setTitle(`Hello ${formValue.title}`);
  }
}
