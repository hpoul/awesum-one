import {Component, OnInit} from '@angular/core';
import {AwesomeInfo, AwesomeList, AwesumService} from './awesum.service';
import {AwesomeIndexData, AwesomeListStoredData} from './lib/shared/AwesomeListInfo';

@Component({
  selector: 'awesum-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'awesum.one';

  index: AwesomeList[];
  errorMessage: string;

  constructor(private awesumService: AwesumService) {
  }

  ngOnInit(): void {
    this.getIndex();
  }

  private getIndex() {
    return this.awesumService.getAwesumIndex()
      .subscribe(
        index => this.index = index,
        error => this.errorMessage = <any>error
      );
  }
}
