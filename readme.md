# Screenshot Comparator

A simple tool to compare actual and expected screenshots and identify the difference between them.

## Features

- Takes screenshots of actual and expected webpages
- Compares the screenshots and identifies the difference
- Writes the difference image to disk

## Requirements

- Node.js
- npm
- Playwright
- jimp
- pixelmatch
- PNGjs

## Usage

- Clone the repository
- Run `npm install` to install the dependencies
- Update the `data.json` file with the actual and expected URLs, along with other parameters
- Run `npm start` to execute the script

## Output

The script will output the number of different pixels found between the actual and expected images. If the number of different pixels is higher than the specified threshold, it will write a difference image to disk.

## Contribute

Feel free to contribute to the project by submitting a pull request or creating an issue.

## License

This project is licensed under the MIT License.
