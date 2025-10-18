const sayHello = (firstName, lastName) => {
return `Hello, MR. ${firstName} ${lastName}!`;
};

module.exports = sayHello;

test('Creates a greeting', () => {
  expect(sayHello('Lera', 'Jackson')).toBe('Hello, Ms. Lera Jackson');
});