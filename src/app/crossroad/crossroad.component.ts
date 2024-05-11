import { Component } from '@angular/core';
import { TrafficLightComponent } from '../traffic-light/traffic-light.component';

@Component({
  selector: 'app-crossroad',
  standalone: true,
  imports: [TrafficLightComponent],
  templateUrl: './crossroad.component.html',
  styleUrl: './crossroad.component.scss'
})
export class CrossroadComponent {

  public emergency = false;
  public inCooldown = false;
  public time = 10;


  activateEmergency() {
    this.emergency = true;

    new Promise((resolve) => {
      setTimeout(() => resolve(""), this.time * 1000)
    })
    .then(() => {
      this.emergency = false;
      this.inCooldown = true;

      return new Promise((resolve => {
        setTimeout(() => resolve(""), this.time * 1000)
      }))
    })
    .then(() => this.inCooldown = false)
  }
}
