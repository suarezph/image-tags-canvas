/**
 * @jest-environment jsdom
 */

const slider = require('../js/slider');

describe('Slider previous and next buttons', () => {
  const arrayImages = [0, 1, 2, 3];
  const currentSelected = 1;
  const nextExpected = 2;
  const prevExpected = 0;

  it(`Press previous button with an array of photos [${arrayImages}] and current of ${currentSelected} will move the index to ${prevExpected}`, () => {
    expect(slider.previous(arrayImages, currentSelected)).toBe(prevExpected);
  });
  it(`Press next button with an array of photos  [${arrayImages}] and current of ${currentSelected} will move the index to ${nextExpected}`, () => {
    expect(slider.next(arrayImages, currentSelected)).toBe(nextExpected);
  });
});