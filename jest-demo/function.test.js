const sayHello = require("./function.js");

test('Creates a greeting', () => {
expect(sayHello('Lera', 'Jackson')). toBe('Hello, Lera Jackson!');
});