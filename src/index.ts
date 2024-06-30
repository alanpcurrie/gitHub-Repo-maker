import { type ExecException, exec } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { promisify } from "node:util";
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import dotenv from "dotenv";
// import { Context, Effect, Layer } from "effect";
import { animateLog, logger } from "./logger";

dotenv.config();

const execPromise = promisify(exec);
const baseDirectory: string = process.env.BASE_DIRECTORY || ".";
const githubToken: string = process.env.GITHUB_TOKEN || "";

const octokit: Octokit = new Octokit({
	auth: githubToken,
	// baseUrl: process.env.GITHUB_API_URL, // may be neeeded for enterprise
});

async function createGitHubRepo(repoName: string): Promise<string> {
	try {
		const { data } = await octokit.repos.createForAuthenticatedUser({
			name: repoName,
			private: true,
		});
		return data.ssh_url;
	} catch (error) {
		throw new Error(
			`Failed to create GitHub repository: ${(error as Error).message})`,
		);
	}
}

async function runGitCommand(
	workingDir: string,
	command: string,
): Promise<string> {
	try {
		const { stdout, stderr } = await execPromise(command, { cwd: workingDir });

		if (stderr) {
			return `${stdout.trim()}\nStderr: ${stderr.trim()}`;
		}
		return stdout.trim();
	} catch (error) {
		const err = error as ExecException & { stderr?: string };
		throw new Error(`${err.message}\nStderr: ${err.stderr || ""}`);
	}
}

async function initGitHubRepo(localRepoPath: string): Promise<void> {
	const gitDir = path.join(localRepoPath, ".git");

	if (fs.existsSync(gitDir)) {
		logger.info(`Removing existing .git directory in ${localRepoPath}`);
		fs.rmSync(gitDir, { recursive: true, force: true });
	}

	logger.info(`Initializing Git repository in ${localRepoPath}`);

	try {
		await runGitCommand(localRepoPath, "git init");
		await runGitCommand(localRepoPath, "git add .");
		await runGitCommand(localRepoPath, 'git commit -m "Initial commit"');
	} catch (error) {
		throw new Error(
			`Failed to initialize Git repository: ${(error as Error).message}`,
		);
	}
}

async function uploadRepo(localRepoPath: string): Promise<void> {
	const repoName: string = path.basename(localRepoPath);
	animateLog(`Processing repository: ${repoName}`);
	logger.info(`Processing repository: ${chalk.yellow(repoName)}`);

	try {
		await initGitHubRepo(localRepoPath);
		const githubRepoUrl = await createGitHubRepo(repoName);
		animateLog(`Created new GitHub repository: ${githubRepoUrl}`);
		logger.info(`Created new GitHub repository: ${chalk.green(githubRepoUrl)}`);

		await runGitCommand(
			localRepoPath,
			`git remote add origin ${githubRepoUrl}`,
		);
		await runGitCommand(localRepoPath, "git branch -M master");
		const pushResult = await runGitCommand(
			localRepoPath,
			"git push -u origin master",
		);
		logger.info(`Push result: ${chalk.cyan(pushResult)}`);
		animateLog(`Successfully processed repository: ${repoName}`);
		logger.info(chalk.green(`Successfully processed repository: ${repoName}`));
	} catch (error) {
		logger.error(
			chalk.red(`Error processing ${repoName}: ${(error as Error).message}`),
		);
	}
}

async function processRepositories(baseDir: string): Promise<void> {
	const directories: Array<string> = fs
		.readdirSync(baseDir, { withFileTypes: true })
		.filter((dirent: fs.Dirent) => dirent.isDirectory())
		.map((dirent: fs.Dirent) => path.join(baseDir, dirent.name));

	await Promise.all(directories.map(uploadRepo));
}

processRepositories(baseDirectory)
	.then(() => logger.info(chalk.blue("Done processing repositories")))
	.catch((error: Error) => {
		logger.error(chalk.red(`Failed to process repositories: ${error.message}`));
	});
