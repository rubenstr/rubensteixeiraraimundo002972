import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  page = input(0);
  pageCount = input(0);
  size = input(10);
  sizeChange = output<number>();

  pageChange = output<number>();

  previous() {
    if (this.page() > 0) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  next() {
    if (this.page() < this.pageCount() - 1) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}