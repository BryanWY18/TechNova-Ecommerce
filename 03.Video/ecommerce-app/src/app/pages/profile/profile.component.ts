import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-profile',
    imports: [],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {

  profile: any;
  error = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.route.snapshot.data['profileData'];
    if (!data) {
      this.error = 'No pudimos cargar tu perfil. Intenta iniciar sesión de nuevo';
    } else {
      this.profile = data.user || data;
    }
  }

}
