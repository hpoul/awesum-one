import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as jsyaml from 'js-yaml';
import 'rxjs/add/operator/map';
import {
  AwesomeCategory, AwesomeIndexData, AwesomeItem, AwesomeListStoredData, AwesumConfig, GithubRepository,
  MarkdownHeadline
} from './lib/shared/AwesomeListInfo';
import * as path from 'path';

@Injectable()
export class AwesumService {

  constructor(private http: Http) { }

  getList(list: AwesomeListStoredData): Observable<AwesomeInfo[]> {
    return this.http.get(path.join('/assets/generator-out', list.saveFile))
      .map((res) => {
        const ret: AwesomeItem[] = jsyaml.safeLoad(res.text()).items;
        // return Observable.create(<AwesomeItem[]>[]);
        return ret.map(i => new AwesomeInfo(i));
      });
  }

  getAwesumIndex(): Observable<AwesomeIndexData> {
    return this.http.get(path.join('/assets/generator-out', AwesumConfig.awesumIndexFileName))
      .map((res) => {
        return jsyaml.safeLoad(res.text());
      });
  }

}

export class AwesomeInfo implements AwesomeItem {
  repository: GithubRepository;
  title: string;
  category: MarkdownHeadline | null;
  categoryInfo: AwesomeCategory | null;

  constructor(item: AwesomeItem) {
    Object.assign(this, item);

    if (item.category) {
      this.categoryInfo = new AwesomeCategory(item.category);
    }
  }
}
