# monitoring integration task

This repo contains a small Node.js order service. Your task is to integrate a monitoring package into it by working through the ticket in [`ticket.md`](./ticket.md). When you're done, fill in the friction log in [`friction.md`](./friction.md).

---

## Prerequisites

### 1. Repository

Clone the repository. For a quick guide have a look at the GitHub Docs [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

### 2. Node.js

Check if Node is installed:

```bash
node --version
```

If the command is not found, install Node via [nvm](https://github.com/nvm-sh/nvm) (recommended):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Restart your terminal, then install Node
nvm install 22
nvm use 22
```

Or download the installer directly from [nodejs.org](https://nodejs.org).

> **Common issue:** `npm`, `npx`, or `node` not found after install. In this case close and reopen your terminal, or run `source ~/.zshrc` (zsh) / `source ~/.bashrc` (bash).

---

### 3. InfluxDB

The monitoring package ships data to InfluxDB. You need a local instance running before metrics will appear anywhere.

**Install via installation guide at [https://docs.influxdata.com/influxdb/v2/install/](https://docs.influxdata.com/influxdb/v2/install/)**

Once running, open **http://localhost:8086** in your browser to complete the setup wizard:

1. Create a user and password
2. **Organisation name** — note this down, you'll need it for the config file
3. **Bucket name** — call it `test` or whatever you prefer, note it down
4. Go to **Data → API Tokens → Generate API Token → All Access Token** — copy the token

You'll use these three values (org, bucket, token) when you create the monitoring config file.

---

### 4. Project dependencies

```bash
npm install
```

> **Common issue:** `npm install` fails with `EACCES` — you're likely using a system Node with permission issues. Use nvm instead (see step 1).

---

## Running the server

```bash
npm start
```

The server starts on **http://localhost:3000**.

---

## Testing the endpoints

**List orders**

```bash
curl http://localhost:3000/orders
```

**Create an order (valid)**

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"item": "widget", "quantity": 3}'
```

**Create an order (invalid — triggers validation error)**

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"item": "", "quantity": -1}'
```

**Health check**

```bash
curl http://localhost:3000/health
```

**Generate a stream of mixed traffic** (runs until you press Ctrl-C)

```bash
while true; do
  curl -s http://localhost:3000/orders > /dev/null
  curl -s -X POST http://localhost:3000/orders \
    -H "Content-Type: application/json" \
    -d '{"item": "thing", "quantity": 1}' > /dev/null
  sleep 0.5
done
```

---

## Verifying data in InfluxDB

Once the server is running with monitoring integrated and you've sent some requests, check that metrics arrived:

1. Open **http://localhost:8086**
2. Go to **Data Explorer** (the graph icon in the left sidebar)
3. Select your bucket, then browse measurements where you should see the metric names you chose
4. Click **Submit** to run the query and see data points

If nothing appears after 30 seconds of traffic, check:

- The config file has the correct org, bucket, and token

- InfluxDB is running (`curl http://localhost:8086/ping` should return `204`)

---

## Installing the monitoring packages

```bash
npm install @cobui/node-monitoring
```

The package README and full API reference are at [npmjs.com/package/@cobui/node-monitoring](https://www.npmjs.com/package/@cobui/node-monitoring).

The documentation for OpenTelemtry regarding nodejs can be found at [opentelemetry.io/docs/languages/js/getting-started/nodejs/](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/)
