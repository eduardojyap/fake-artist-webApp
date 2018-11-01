//
// Array Destructuring
//

const address = ['1299 S Juniper Street', 'Philadelphia', 'Pennsylvania'];

const [,city,state] = address;

console.log(`You are in ${city} ${state}.`);