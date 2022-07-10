import { Component, Input, OnInit } from "@angular/core"

export type LeaderboardData = { name: string; score: number; gained: number }[]

@Component({
   selector: "app-leaderboard",
   templateUrl: "./leaderboard.component.html",
   styleUrls: ["./leaderboard.component.scss"]
})
export class LeaderboardComponent {
   @Input() players!: LeaderboardData
}
