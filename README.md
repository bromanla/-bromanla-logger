# @bromanla/logger

A lightweight and flexible logger library for Node.js, designed with extensibility in mind. It supports multiple logging levels, transports for handling log output, and the ability to create child loggers with contextual data.

## Features

- Log levels: `fatal`, `error`, `warn`, `info`, `debug`.
- Customizable transports for handling log output (e.g., console, file, remote service).
- Pretty-printed output in development mode.
- Supports child loggers for adding contextual information to logs.
- Easy integration and customization.
- Environment variable support for configuration.

## Installation

Install via npm:

```bash
npm install @bromanla/logger
```

## Basic Usage

The logger is easy to configure and use. Here's a basic example:

```ts
import { logger } from '@bromanla/logger';

logger.info('Application started');
logger.warn('Low disk space');
logger.error(new Error('Something went wrong'));
```

## Log Levels

The available log levels, in increasing order of verbosity, are:

- `fatal`: Critical errors, application shutdown required.
- `error`: Runtime errors or unexpected conditions.
- `warn`: Potentially harmful situations.
- `info`: General informational messages.
- `debug`: Detailed information for debugging.

### Filtering by Log Level

You can set a minimum log level using the `level` option or the `LOG_LEVEL` environment variable. Logs below that level will be ignored.

For example, setting the level to `warn` will ignore `info` and `debug` logs:

```ts
import { Logger, LEVELS } from '@bromanla/logger';

const logger = new Logger({ level: LEVELS.warn });

logger.info('This will not be logged');
logger.warn('This will be logged');
```

Alternatively, set the `LOG_LEVEL` environment variable:

```bash
LOG_LEVEL=2 node app.js
```

## Pretty Printing

When running in a development environment (`NODE_ENV=development`), logs are pretty-printed with colors and indentation for easier reading.

In production (`NODE_ENV=production` or unset), pretty-printing is disabled to improve performance and reduce log size.

```bash
NODE_ENV=development node app.js
```

This behavior can be customized using the `pretty` option:

```ts
const logger = new Logger({ pretty: true });
```

## Child Loggers

Create child loggers with additional context for better traceability in larger applications. Context is automatically included in every log from the child logger.

```ts
const mainLogger = new Logger();
const userLogger = mainLogger.createChild({ userId: 1234 });

userLogger.info('User logged in'); // Logs: { type: 'info', userId: 1234, message: 'User logged in' }
userLogger.error('User failed to authenticate'); // Logs: { type: 'error', userId: 1234, message: 'User failed to authenticate' }
```

## Transports

Transports are functions responsible for handling the log output. By default, the logger comes with a `ConsoleTransport`, which outputs logs to the console. You can add multiple transports or write your own.

### Using ConsoleTransport

By default, logs will be printed to the console. In development mode, logs are pretty-printed and color-coded.

```ts
const logger = new Logger({
  pretty: process.env.NODE_ENV === 'development',
  level: LEVELS.debug, // Set log level to debug
});
```

### Writing a Custom Transport

To write your own transport, implement a function that accepts the log data and options as parameters. Below is an example of a custom transport that sends logs to a remote logging service.

```ts
import { Logger, LoggerTransport } from '@bromanla/logger';

const RemoteTransport: LoggerTransport = (data, options) => {
  // Send log data to a remote service
  fetch('https://example.com/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const logger = new Logger({
  transports: [RemoteTransport],
});
```

You can add multiple transports by including them in the `transports` array:

```typescript
import { ConsoleTransport } from '@bromanla/logger';

const logger = new Logger({
  transports: [ConsoleTransport.run, RemoteTransport],
});
```

### Transport Interface

A transport is a function that accepts two arguments:

- `data: TransportData`: The log data, including the log level and any additional context.
- `options: TransportOptions`: The logger's configuration, excluding the transports.

The `TransportData` type is defined as:

```ts
export type TransportData = { type: LoggerLevels } & Record<string, unknown>;
```

## API

### `new Logger(options?, context?)`

Creates a new `Logger` instance.

- `options`: An object to customize the logger behavior:
  - `level`: The minimum log level (default: `info` or from `LOG_LEVEL`).
  - `transports`: Array of transport functions (default: `[ConsoleTransport.run]`).
  - `pretty`: Boolean to enable pretty-printing (default: `true` if `NODE_ENV` is `'development'`).
- `context`: An object to add persistent context to all logs from this logger (default: `{}`).

### Logging Methods

Each method corresponds to a log level:

```typescript
logger.debug(message: unknown);
logger.info(message: unknown);
logger.warn(message: unknown);
logger.error(message: unknown);
logger.fatal(message: unknown);
```

- `message`: Can be any type, such as a string, object, or `Error`. Objects will be logged as JSON.

### `createChild(context?)`

Creates a child logger with additional context. The child logger will inherit the parent's settings but can add or overwrite context.

```ts
const childLogger = logger.createChild({ requestId: 'abc123' });
```

### `ConsoleTransport`

The default console transport handles output to the terminal. Logs are color-coded and pretty-printed in development mode.

```ts
import { ConsoleTransport } from '@bromanla/logger';

const logger = new Logger({
  transports: [ConsoleTransport.run],
});
```
