import chalk from "chalk";
import { type Config, NodeSSH } from "node-ssh";
import { logger } from "./logger";

const ssh = new NodeSSH();

const sshUsername: string = process.env.SSH_USERNAME || "";
const sshKeyFile: string = process.env.SSH_KEY_FILE || "";
const sshPassphrase: string = process.env.SSH_PASSPHRASE || "";
// const githubApiUrl: string | undefined = process.env.GITHUB_API_URL;

async function connectSSH(): Promise<void> {
	const sshConfig: Config = {
		host: "github.com",
		username: sshUsername,
		privateKey: sshKeyFile,
		passphrase: sshPassphrase,
	};

	try {
		await ssh.connect(sshConfig);
		logger.info(chalk.green("SSH connection established"));
	} catch (error) {
		logger.error(
			chalk.red(
				`Failed to establish SSH connection: ${(error as Error).message}`,
			),
		);
		throw error;
	}
}

// processRepositories(baseDirectory);
export async function RunConnectMain(
	cb: (arg0: string) => Promise<void>,
): Promise<void> {
	try {
		await connectSSH();
		await cb;
		logger.info(chalk.blue("Done processing repositories"));
	} catch (error) {
		logger.error(
			chalk.red(`Failed to process repositories: ${(error as Error).message}`),
		);
	} finally {
		ssh.dispose();
	}
}
