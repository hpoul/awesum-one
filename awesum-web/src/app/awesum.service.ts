import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as jsyaml from 'js-yaml';
import 'rxjs/add/operator/map';
import {
  AwesomeCategory, AwesomeIndexData, AwesomeItem, AwesomeListStoredData, AwesumConfig, GithubRepository,
  GithubRepositoryInfoData,
  MarkdownHeadline
} from './lib/shared/AwesomeListInfo';
import * as path from 'path';
import * as moment from 'moment';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AwesumService {

  awesumIndexRequestSubject: BehaviorSubject<AwesomeList[]> = null;

  constructor(private http: Http) { }

  getList(list: AwesomeListStoredData): Observable<AwesomeInfo[]> {
    return this.http.get(path.join('/assets/generator-out', list.saveFile))
      .map((res) => {
        const ret: AwesomeItem[] = jsyaml.safeLoad(res.text()).items;
        // return Observable.create(<AwesomeItem[]>[]);
        return ret.map(i => new AwesomeInfo(i));
      });
  }

  getAwesumIndex(): Subject<AwesomeList[]> {
    if (this.awesumIndexRequestSubject != null) {
      return this.awesumIndexRequestSubject;
    }
    this.awesumIndexRequestSubject = new BehaviorSubject(null);
    this.http.get(path.join('/assets/generator-out', AwesumConfig.awesumIndexFileName))
      .map((res) => {
        return jsyaml.safeLoad(res.text());
      })
      .map(data => data.stored.map(list => new AwesomeList(list)))
      .subscribe(value => this.awesumIndexRequestSubject.next(value),
        error => this.awesumIndexRequestSubject.error(error));
    return this.awesumIndexRequestSubject;
  }
}

export class AwesomeList implements AwesomeListStoredData {
  title: string;
  repository: GithubRepository;
  saveFile: string;

  constructor(data: AwesomeListStoredData) {
    Object.assign(this, data);
    this.repository = new GithubRepository(data.repository.owner, data.repository.name);
  }

}

export class AwesomeInfo implements AwesomeItem {
  infoData: GithubRepositoryInfoData;
  repository: GithubRepository;
  title: string;
  category: MarkdownHeadline | null;
  categoryInfo: AwesomeCategory | null;

  get lastUpdatedAt() {
    return moment(this.infoData.updated_at).format('YYYY-MM-DD hh:mm');
  }

  constructor(item: AwesomeItem) {
    Object.assign(this, item);
    this.repository = new GithubRepository(item.repository.owner, item.repository.name);

    if (item.category) {
      this.categoryInfo = new AwesomeCategory(item.category);
    }
  }
}
