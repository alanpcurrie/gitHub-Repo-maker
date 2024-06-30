# GitHub Repo Maker

GitHub Repo Maker is a Node.js application that automates the process of creating and initialising multiple GitHub repositories. 

## Prerequisites

* Node.js (version 18 or 20)
* npm 
* Git installed on your local machine

## Installation

To install GitHub Repo Maker, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/alanpcurrie/gitHub-Repo-maker.git
   ```
2. Navigate to the project directory:
   ```
   cd github-repo-maker
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   SSH_USERNAME=your_ssh_username
   SSH_KEY_FILE=/path/to/your/ssh/key
   SSH_PASSPHRASE=your_ssh_key_passphrase
   BASE_DIRECTORY=/path/to/your/base/directory
   GITHUB_API_URL=https://api.github.com  # Or your GitHub Enterprise API URL
   ```
   Replace the values with your actual GitHub and SSH credentials.

## Usage

To use GitHub Repo Maker, follow these steps:

1. Ensure your `.env` file is properly configured.
2. Run the application:
   ```
   npm start
   ```
   This will process all directories in your `BASE_DIRECTORY`, creating a new GitHub repository for each and pushing the initial content.

For development with hot-reloading:
```
npm run dev
```

## Development

This project uses TypeScript and follows modern JavaScript practices. Here are some key development commands:

- `npm start`: Runs the application
- `npm run dev`: Runs the application with nodemon for development
- `npm test`: Runs the test suite

## Testing

This project uses Vitest (in source testing) for testing. To run the tests:

```
npm run test
```

## Dependencies

- @octokit/rest: For interacting with the GitHub API
- chalk and chalk-animation: For colorful console output
- dotenv: For loading environment variables
- effect: For functional programming patterns (Effect Refactor TODO)
- node-ssh: For SSH operations
- winston: For logging
- @biomejs/biome: as an alternative to eslint and prettier for linting and code formatting



