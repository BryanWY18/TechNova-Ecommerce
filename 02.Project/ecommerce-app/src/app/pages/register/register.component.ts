import { Component, ViewChild } from '@angular/core';
import { RegisterFormComponent } from "../../components/auth/register-form/register-form.component";
import { canComponentDeactivate } from '../../core/guards/form/form.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RegisterFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements canComponentDeactivate {

   @ViewChild(RegisterFormComponent) registerFormComponent!: RegisterFormComponent;
  
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.registerFormComponent?.canDeactivate() ?? true;
  }

}
