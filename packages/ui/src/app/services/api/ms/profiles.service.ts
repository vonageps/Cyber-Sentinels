import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { JDS } from "src/app/constants";
import { Profile } from "src/app/types";

@Injectable({
  providedIn: "root",
})
export class ProfilesService {
  private profiles: Profile[] = [
    {
      id: "1",
      name: "Full Stack Developer",
      createdOn: "2021-01-01",
      jd: JDS.ANGULAR_FS,
    },
    {
      id: "2",
      name: "Product Designer",
      createdOn: "2021-01-01",
      jd: "",
    },
    {
      id: "3",
      name: "Sr. Human Resource Manager",
      createdOn: "2021-01-01",
      jd: "",
    },
    {
      id: "4",
      name: "Marketing Executive",
      createdOn: "2021-01-01",
      jd: "",
    },
    {
      id: "5",
      name: "Product Manager",
      createdOn: "2021-01-01",
      jd: "",
    },
    {
      id: "6",
      name: "Support Engineer Manager",
      createdOn: "2021-01-01",
      jd: "",
    },
  ];

  getProfiles() {
    return of(this.profiles);
  }

  getProfileById(id: string) {
    return of(this.profiles.find((p) => p.id === id));
  }
}
