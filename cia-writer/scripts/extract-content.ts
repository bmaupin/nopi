import { readFile } from 'fs/promises';

const main = async () => {
  if (process.argv.length !== 5) {
    console.log(
      'Error: Please provide the file path, starting index, ending index'
    );
    process.exit(1);
  }

  const filePath = process.argv[2];
  const startingIndex = process.argv[3];
  const endingIndex = process.argv[4];

  const fileContents = await readFile(filePath);

  fileContents
    .slice(Number(startingIndex), Number(endingIndex))
    .forEach((byte) => {
      process.stdout.write(`0x${byte.toString(16).padStart(2, '0')}, `);
    });
  console.log();
};

main();
