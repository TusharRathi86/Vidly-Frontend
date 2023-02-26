import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

function initialise() {
  Sentry.init({
    dsn: "https://3d9066828e2f43318e7d823111e62e55@o4504634547896320.ingest.sentry.io/4504653817511936",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  initialise,
  log,
};
