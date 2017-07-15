import {Component, OnInit} from '@angular/core';
import {AwesomeInfo, AwesumService} from './awesum.service';
import {AwesomeIndexData, AwesomeListStoredData} from './lib/shared/AwesomeListInfo';

@Component({
  selector: 'awesum-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'awesum.one';
  list: AwesomeInfo[];
  selectedList: AwesomeListStoredData;
  errorMessage: string;
  index: AwesomeIndexData;

  constructor(private awesumService: AwesumService) {}

  ngOnInit() {
    this.getIndex();
  }

  getList(listData: AwesomeListStoredData) {
    return this.awesumService.getList(listData)
      .subscribe(
        list => this.list = list,
        error => this.errorMessage = <any>error
      );
  }

  getIndex() {
    return this.awesumService.getAwesumIndex()
      .subscribe(
        index => this.index = index,
        error => this.errorMessage = <any>error
      );
  }

  selectList(list: AwesomeListStoredData) {
    this.selectedList = list;
    this.getList(list);
  }
}
