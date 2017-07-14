import { AwesumWebPage } from './app.po';

describe('awesum-web App', () => {
  let page: AwesumWebPage;

  beforeEach(() => {
    page = new AwesumWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to awesum!');
  });
});
