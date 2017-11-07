const { parseInputText } = require('../server/utils/helpers');

describe('Parse slash command input', () => {
  test('Empty command returns HELLO', () => {
    expect(parseInputText('')).toHaveProperty('command', 'HELLO');
  });

  test("'foo bar' returns OPEN foo bar", () => {
    const text = 'foo bar';
    expect(parseInputText(text)).toHaveProperty('command', 'OPEN');
    expect(parseInputText(text)).toHaveProperty('message', 'foo bar');
  });

  test("'oPen foo bar' returns OPEN foo bar", () => {
    const text = 'oPen foo bar';
    expect(parseInputText(text)).toHaveProperty('command', 'OPEN');
    expect(parseInputText(text)).toHaveProperty('message', 'foo bar');
  });

  test("'oPeN foo #75 bar' returns OPEN foo bar", () => {
    const text = 'oPeN foo #75 bar';
    expect(parseInputText(text)).toHaveProperty('command', 'OPEN');
    expect(parseInputText(text)).toHaveProperty('message', 'foo bar');
  });

  test("'opEn #75' returns ERROR", () => {
    expect(parseInputText('opEn #75')).toHaveProperty('command', 'ERROR');
  });

  test("'hELp foo #75 bar' returns HELP", () => {
    expect(parseInputText('hELp foo #75 bar')).toHaveProperty('command', 'HELP');
  });

  test("'sHoW foo #75 bar' returns HELP", () => {
    expect(parseInputText('sHoW foo #75 bar')).toHaveProperty('command', 'SHOW');
  });

  test("'soLve' returns ERROR", () => {
    expect(parseInputText('soLve')).toHaveProperty('command', 'ERROR');
  });

  test("'solve foo bar' returns ERROR", () => {
    expect(parseInputText('solve foo bar')).toHaveProperty('command', 'ERROR');
  });

  test("'solve #75' returns SOLVE 75", () => {
    const text = 'solve #75';
    expect(parseInputText(text)).toHaveProperty('command', 'SOLVE');
    expect(parseInputText(text)).toHaveProperty('number', 75);
  });

  test("'solve foo #75 bar #20' returns SOLVE 75", () => {
    const text = 'solve foo #75 bar #20';
    expect(parseInputText(text)).toHaveProperty('command', 'SOLVE');
    expect(parseInputText(text)).toHaveProperty('number', 75);
  });

  test("'unsolve foo #75 bar #20' returns UNSOLVE 75", () => {
    const text = 'unsolve foo #75 bar #20';
    expect(parseInputText(text)).toHaveProperty('command', 'UNSOLVE');
    expect(parseInputText(text)).toHaveProperty('number', 75);
  });

  test("'close foo #75 bar #20' returns CLOSE 75", () => {
    const text = 'close foo #75 bar #20';
    expect(parseInputText(text)).toHaveProperty('command', 'CLOSE');
    expect(parseInputText(text)).toHaveProperty('number', 75);
  });
});
