import {Component, OnInit} from '@angular/core';
import {AwesomeInfo, AwesomeList, AwesumService} from '../awesum.service';
import {AwesomeIndexData, AwesomeListStoredData} from '../lib/shared/AwesomeListInfo';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/skipUntil';
import 'rxjs/add/operator/skipWhile';

@Component({
  selector: 'awesum-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  list: AwesomeInfo[];
  selectedList: AwesomeList;
  errorMessage: string;
  index: AwesomeList[];

  constructor(private awesumService: AwesumService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.getIndex();
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        console.log('need to load list for ', params);
        return this.awesumService.getAwesumIndex()
          .skipWhile(value => value === null)
          .map( index => index.find(list => list.repository.owner === params.get('owner') && list.repository.name === params.get('name')));
      })
      .subscribe(
        list => { this.selectList(list); },
        error => { this.errorMessage = error; }
      );
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

  selectList(list: AwesomeList|null) {
    this.selectedList = list;
    if (list) {
      this.getList(list);
    }
  }

}
