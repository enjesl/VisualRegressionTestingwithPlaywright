const main = require('./runtime/main');
const { compareScreenshots } = require('./runtime/compareScreenshots');

main().then(() => {
  console.log('Main function has finished executing');
}).catch(error => {
  console.error(error);
});
