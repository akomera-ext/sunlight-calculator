### Sunlight Calculator
This Node.js script calculates and prints the place with the longest daylight duration based on given latitude and longitude values.

### Requirements
Node.js (version >= 10)
npm (Node Package Manager)
Installation

### Clone this repository:

### bash
git clone https://github.com/akomera-ext/sunlight-calculator.git
cd sunlight-calculator

### Install dependencies:

### bash
npm install

### Usage
To run the script and find the place with the longest daylight duration:

### bash
npm run dev

### Example usage of the function
const date = new Date("2024-03-02");// Example date, change as needed

const topN = 1;// to retrieve the top location 

findLongestDaylightPlace(date, topN);


