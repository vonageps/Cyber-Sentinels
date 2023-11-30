import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSharedModule } from "./mat-shared-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FileSelectorModule } from "./file-selector";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSharedModule,
    FlexLayoutModule,
    FileSelectorModule,
  ],
  exports: [MatSharedModule, FlexLayoutModule, FileSelectorModule],
})
export class SharedModule {}
