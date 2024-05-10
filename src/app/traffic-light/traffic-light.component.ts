import { Component, Input, OnInit } from "@angular/core";

type TrafficLight = "red" | "yellow" | "green";
type Direction = "vertical" | "horizontal";

@Component({
    selector: "app-traffic-light",
    templateUrl: "./traffic-light.component.html",
    styleUrl: "./traffic-light.component.scss",
    standalone: true
})

export class TrafficLightComponent implements OnInit {
    
   @Input({required: true}) public activeLight: TrafficLight = "red";

   @Input({required: true}) public direction: Direction = "vertical";

    public redLightDuration = 5;
    public yellowLightDuration = 2;
    public greenLightDuration = 5;

    public trafficLightSequence = [
        {
            light:"red",
            duration: this.redLightDuration,
            nextLight:"yellow"
        },
        {
            light:"yellow",
            duration: this.yellowLightDuration,
            nextLight:"green"
        },
        {
            light:"green",
            duration: this.greenLightDuration,
            nextLight:"yellow"
        },
        {
            light:"yellow",
            duration: this.yellowLightDuration,
            nextLight:"red"
        },
    ]

    isActiveLight(light: TrafficLight) : string {

        if(light === this.activeLight) return "active";
        return "";
    }

    ngOnInit(): void {
        this.startTrafficLight()
    }

    wait(duration: number, nextLight: TrafficLight) : Promise<TrafficLight> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(nextLight)
            }, duration * 1000)
        })
    }

    startTrafficLight() {
        const sequence: any = this.activeLight === "red"
                              ? [...this.trafficLightSequence] 
                              : [this.trafficLightSequence[2], this.trafficLightSequence[3],
                                 this.trafficLightSequence[0],this.trafficLightSequence[1]]

        this.wait(sequence[0].duration,sequence[0].nextLight)
        .then(nextTrafficLight => {
            this.activeLight = nextTrafficLight;
            return this.wait(sequence[1].duration,sequence[1].nextLight)
        })
        .then(nextTrafficLight => {
            this.activeLight = nextTrafficLight;
            return this.wait(sequence[2].duration,sequence[2].nextLight)
        })
        .then(nextTrafficLight => {
            this.activeLight = nextTrafficLight;
            return this.wait(sequence[3].duration,sequence[3].nextLight)
        })
        .then(nextTrafficLight => {
            this.activeLight = nextTrafficLight;
            this.startTrafficLight();
        })
        
    }
}