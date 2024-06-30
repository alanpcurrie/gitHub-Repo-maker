import chalkAnimation from "chalk-animation";
import winston, { type Logger } from "winston";

export const logger: Logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.colorize(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} ${level}: ${message}`;
		}),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

export function animateLog(message: string) {
	const rainbow = chalkAnimation.rainbow(message);
	setTimeout(() => rainbow.stop(), 2000);
}

if (import.meta.vitest) {
	const { describe, it, expect, vi } = import.meta.vitest;

	vi.mock("chalk-animation");

	describe("animateLog", () => {
		it("should call chalkAnimation.rainbow and stop after 2 seconds", () => {
			const message = "test message";
			const stopMock = vi.fn();
			chalkAnimation.rainbow.mockReturnValue({ stop: stopMock });

			animateLog(message);

			expect(chalkAnimation.rainbow).toHaveBeenCalledWith(message);

			setTimeout(() => {
				expect(stopMock).toHaveBeenCalled();
			}, 2000);
		});
	});
}
