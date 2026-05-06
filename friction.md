# Integration Friction Log

**Date:** ******\30\04\2026******  
**Time taken (total):** ******66 minutes******

---

## Step-by-step log

Fill in each row as you work through the integration. The "friction" column is
the most important: note anything that made you pause, look something up, feel
uncertain, or required more than one attempt.

| #   | Step                                      | What you did                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Friction / observations                                                                                                                                               | 
| --- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| 1   | Install the package(s)                    | I first researched for a guide how to integrate OTel w/ InfluxDB. Then I installed some OTel packages, and created the setup file. This allowed me to see traces in console output. The ouptut had to go to influxdb somehow. I researched this and i think there was 2 options (One of them Telegraf). I tried to install telegraf and run it but ran into issues with the config.                                                                                                                                    | There was multiple different small guides, who were saying conflicting things and none of them gave me a full picture. I had to deal with multiple docker containers. |               |
| 2   | Setup monitoring                          | Finally i realized i could also setup telegraf from the Influxdb web UI. This exposed an endpoint to read the config from. WIth this config the telegraf service started. Now i tried to integrate it with OTel, but i first had to find the right Otel exporter package.                                                                                                                                                                                                                                              | Again many different independent configuration options, with no good centralized documentation (or a least i didnt find it)                                           |               |
| 3   | Add the first counter (`orders.requests`) | Once i had the right exporter, i tried adding a metric to the server component. I added it and it was running seemingly right, but the metric did not arrive in the Database. Now i did not know which service was the problem. I would have to put all services in a debug mode somehow and understand their output. But this would again require researching 3 different configuration options and parsing their output somehow (from docker and stuff) so i gave up, because the one hour timebox was already over. | 3 different services with 3 different config options and debug outputs running. I need to understand all of them to find the problem.                                 |               |
| 4   | Add the request latency histogram         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                                                                                       |               |
| 5   | Add the `heap_used` gauge                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                                                                                       |               |
| 6   | Add the `active_connections` gauge        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                                                                                       |               |
| 7   | Add the job processor counter             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                                                                                       |               |
| 8   | Wire up SIGTERM / graceful shutdown       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                                                                                       |               |
| 9   | Verify data arrived in InfluxDB           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                                                                                       |               |

---

## Open questions during integration

Note any questions you had that were not answered immediately by the README
or TypeScript types.

- /
-
-

---

## Overall impressions

**What worked well:**

- AI support was i guess quite useful, Im not sure how the lesser-known package compares

**What was confusing or took longer than expected:**

- Just the configuring of multiple services via docker is always a pain
