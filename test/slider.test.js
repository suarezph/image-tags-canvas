/**
 * @jest-environment jsdom
 */

const slider = require('../js/slider');

describe('Slider previous and next buttons', () => {
  const arrayImages = [0, 1, 2, 3];
  const currentSelected = 1;

  it(`Pressing previous button with [${arrayImages}] and current of ${currentSelected} to move the index to 0`, () => {
    expect(slider.previous(arrayImages, currentSelected)).toBe(0);
  });
  it(`Pressing next button with [${arrayImages}] and current of ${currentSelected} to move the index to 2`, () => {
    expect(slider.next(arrayImages, currentSelected)).toBe(2);
  });
});