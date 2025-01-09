import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { env } from "../utils/config";

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "stanford-bot",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  traceExporter: new OTLPTraceExporter({
    url: `${env.TRACER_URL}`,
  }),
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
sdk.start();
