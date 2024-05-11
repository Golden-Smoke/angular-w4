import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

type TrafficLight = "red" | "yellow" | "green";
type Direction = "vertical" | "horizontal";

@Component({
    selector: "app-traffic-light",
    templateUrl: "./traffic-light.component.html",
    styleUrl: "./traffic-light.component.scss",
    standalone: true
})

export class TrafficLightComponent implements OnInit,OnChanges {
    
   @Input({required: true}) public startLight: TrafficLight = "red";

   public activeLight: TrafficLight = this.startLight;

   @Input({required: true}) public direction: Direction = "vertical";

   @Input() public emergencyMode: boolean = false;

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

        if(this.emergencyMode) return "emergency";

        if(light === this.activeLight) return "active";
        return "";
    }

    // Starting Traffic-Light
    ngOnInit(): void {
        this.startTrafficLight()
    }
    
    // Reset Traffic-Light
    ngOnChanges(changes: SimpleChanges): void {

        if(!this.emergencyMode) {
            this.activeLight = this.startLight;
            this.startTrafficLight()
        } 
    }

    wait(duration: number, nextLight: TrafficLight) : Promise<TrafficLight> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(this.emergencyMode) reject("Emergency Mode")
                resolve(nextLight)
            }, duration * 1000)
        })
    }

    startTrafficLight() {
        const sequence: any = this.startLight === "red"
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
        .catch(() => {})
    }

    crossing() {
        if(this.activeLight === "yellow") alert("Неправилно пресичане!")
    }
}