import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class InitialsService {
  fromName(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  }
}
