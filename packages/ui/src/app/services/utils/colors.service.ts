import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ColorsService {
  colors = [
    "light-purple",
    "light-red",
    "light-green",
    "light-amber",
    "dark-yellow",
    "dark-blue",
  ];

  getColorClassByName(name: string) {
    return this.colors[
      name
        .split("")
        .map((c) => c.charCodeAt(0))
        .reduce((a, b) => a + b, 0) % this.colors.length
    ];
  }
}
