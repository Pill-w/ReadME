const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

// Create promise version of fs.writeFile
const writeFileAsync = util.promisify(fs.writeFile);

// Function to generate the license badge based on selection
function renderLicenseBadge(license) {
  if (!license || license === 'None') {
    return '';
  }
  
  const badges = {
    'MIT': '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)',
    'Apache 2.0': '[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)',
    'GPL 3.0': '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)',
    'BSD 3-Clause': '[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)',
    'Unlicense': '[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)'
  };
  
  return badges[license];
}

// Function to generate license section content
function renderLicenseSection(license) {
  if (!license || license === 'None') {
    return 'This project is not licensed.';
  }
  
  return `This project is licensed under the ${license} license.`;
}

// Function to generate markdown for README
function generateMarkdown(data) {
  return `# ${data.title}

${renderLicenseBadge(data.license)}

## Description

${data.description}

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

${data.installation}

## Usage

${data.usage}

## License

${renderLicenseSection(data.license)}

## Contributing

${data.contributing}

## Tests

${data.tests}

## Questions

If you have any questions about the repo, open an issue or contact me directly at ${data.email}.

You can find more of my work at [${data.github}](https://github.com/${data.github}/).
`;
}

// Array of questions for user input
const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'What is your project title?',
    validate: input => input ? true : 'Please enter a project title.'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please provide a description of your project:',
    validate: input => input ? true : 'Please enter a project description.'
  },
  {
    type: 'input',
    name: 'installation',
    message: 'What are the installation instructions?',
    default: 'npm install'
  },
  {
    type: 'input',
    name: 'usage',
    message: 'How do you use this project?',
    validate: input => input ? true : 'Please enter usage information.'
  },
  {
    type: 'list',
    name: 'license',
    message: 'Which license would you like to use?',
    choices: ['MIT', 'Apache 2.0', 'GPL 3.0', 'BSD 3-Clause', 'Unlicense', 'None']
  },
  {
    type: 'input',
    name: 'contributing',
    message: 'What are the contribution guidelines?',
    default: 'Contributions are welcome. Please feel free to submit a Pull Request.'
  },
  {
    type: 'input',
    name: 'tests',
    message: 'What are the test instructions?',
    default: 'npm test'
  },
  {
    type: 'input',
    name: 'github',
    message: 'What is your GitHub username?',
    validate: input => input ? true : 'Please enter your GitHub username.'
  },
  {
    type: 'input',
    name: 'email',
    message: 'What is your email address?',
    validate: function(email) {
      // Simple email validation
      const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      return valid ? true : 'Please enter a valid email address.';
    }
  }
];

// Function to initialize app
async function init() {
  try {
    console.log('Welcome to the Professional README Generator!');
    console.log('Please answer the following questions to generate your README.md');

    const answers = await inquirer.prompt(questions);
    const markdown = generateMarkdown(answers);

    await writeFileAsync('README.md', markdown);

    console.log('README.md has been successfully generated!');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Function call to initialize app
init();