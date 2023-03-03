import chalk = require('chalk');

export async function statusMemory() {
  const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  if (usedMemory > 600) {
    console.error(
      chalk.bgRedBright(`Memory usage alert! Function is using ${usedMemory.toFixed(2)} MB`)
    );
  } else {
    console.log(chalk.bgGreenBright(`Memory usage is:${usedMemory.toFixed(2)}`));
  }
}
