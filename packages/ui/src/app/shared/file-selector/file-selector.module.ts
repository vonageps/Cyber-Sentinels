import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FileSelectorComponent } from "./file-selector/file-selector.component";

@NgModule({
  declarations: [FileSelectorComponent],
  imports: [CommonModule, FormsModule],
  exports: [FileSelectorComponent],
})
export class FileSelectorModule {}
