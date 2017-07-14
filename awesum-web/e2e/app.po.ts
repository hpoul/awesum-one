import { browser, by, element } from 'protractor';

export class AwesumWebPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('awesum-root h1')).getText();
  }
}
