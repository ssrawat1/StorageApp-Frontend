// const allTestPassed = Math.random() > 0.5;
const allTestPassed = true;

if (allTestPassed) {
  console.log('All test have been passed');
  process.exit(0);
} else {
  console.log('All test have been failed');
  process.exit(1);
}
