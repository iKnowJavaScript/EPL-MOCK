console.log(new Date(1355897837000).toLocaleDateString());
console.log(new Date(1355897837000).getFullYear());
console.log(new Date().getTime());
console.log(new Date('09/08/2019').getTime()); //today
console.log(new Date('09/14/2019').getTime()); //next saturday
console.log(new Date('09/15/2019').getTime()); //next sunday
console.log(new Date('09/21/2019').getTime()); //next saturday
console.log(new Date('09/22/2019').getTime()); //next sunday

console.log(new Date('09/15/2019').getTime() - new Date('09/08/2019').getTime());
// diff = 604800000
// console.log(new Date(1567897200000 + 604800000 + 604800000))
