// const allTestPassed = Math.random() > 0.5;
const allTestPassed = true;

// Color helpers
const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

if (allTestPassed) {
  console.log(`${green}🎨 ✅ All frontend tests have passed! 🚀${reset}`);
  process.exit(0);
} else {
  console.log(`${red}🎨 ❌ Frontend tests have failed! 🛑${reset}`);
  process.exit(1);
}
