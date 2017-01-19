import { PPage } from './app.po';

describe('p App', function() {
  let page: PPage;

  beforeEach(() => {
    page = new PPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
