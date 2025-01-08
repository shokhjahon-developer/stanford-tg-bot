// import pino from "pino";
// import { env } from "../utils/config";

// const pinoLokiTransport = pino.transport({
//   target: "pino-loki",
//   options: {
//     host: `${env.GRAFANA_URL}`,
//     labels: {
//       app: "stanford-telegram-bot",
//     },
//   },
// });

// const pinoPretty = pino.transport({
//   target: "pino-pretty",
//   options: {
//     translateTime: "HH:MM:ss Z",
//     ignore: "pid,hostname",
//   },
// });

// const loggerStreams = [
//   { level: "debug", stream: pinoLokiTransport },
//   { level: "debug", stream: pinoPretty },
// ];

// export const logger = pino({ level: "trace" }, pino.multistream(loggerStreams));
