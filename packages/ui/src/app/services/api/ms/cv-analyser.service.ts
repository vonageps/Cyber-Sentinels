import { Injectable } from "@angular/core";
import { ApiService } from "src/app/services";
import { map, of, switchMap } from "rxjs";
import { JdVectors, ParsedCV, Profile, ScoreResponse } from "src/app/types";
import { environment } from "src/environments/environment";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CvAnalyserService {
  constructor(private apiService: ApiService) {}
  criteria = environment.cvThreshold;

  analyseCv(file: File, profile: Profile) {
    const headers = new HttpHeaders({
      "x-Authorization": environment.api.cvKey,
    });
    const formData = new FormData();
    formData.append("document", file);
    return this.apiService
      .post(`${environment.api.cv}/cv/parse`, formData, {
        headers,
      })
      .pipe(
        switchMap((cvResult: ParsedCV) => {
          return this.apiService
            .post(
              `${environment.api.cv}/jd/generate-vectors`,
              {
                jd_text: profile.jd,
              },
              {
                headers,
              }
            )
            .pipe(
              switchMap((jdResult: JdVectors) => {
                return this.apiService
                  .post<ScoreResponse>(`${environment.api.cv}/jd_cv_match/score`, {
                    cv_vectors: cvResult.candidate_vectors,
                    jd_skill_vectors: jdResult.jd_vectors,
                  })
                  .pipe(
                    map((res) => {
                      return {eligible: res.total_score >= this.criteria};
                    })
                  );
              })
            );
        })
      );
  }
}
