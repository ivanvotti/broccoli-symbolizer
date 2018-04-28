'use strict';

const Sympolizer = require('../');
const fixture = require('broccoli-fixture');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('broccoli-symbolizer', () => {
  let inputNode = `${__dirname}/fixtures/input-node`;

  it('works', () => {
    let options = {
      outputFile: 'symbols.svg'
    };

    let outputNode = fixture.build(new Sympolizer(inputNode, options));
    let expectedContent =
`<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<symbol id="icon-1" viewBox="0 0 13 13">
  <path d="M7 6V0H6v6H0v1h6v6h1V7h6V6H7z"/>
</symbol>
<symbol id="icon-2" viewBox="0 0 16 16">
  <path d="M7 6V0H6v6H0z"/>
</symbol>
</svg>`;

    return expect(outputNode).to.eventually.deep.equal({
      'symbols.svg': expectedContent
    });
  });
});
