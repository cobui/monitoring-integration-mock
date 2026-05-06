# Integration Friction Log

**Date:** ******\_\_\_\_******  
**Package version:** ******\_\_\_\_******  
**Time taken (total):** ******\_\_\_\_******

---

## Step-by-step log

Fill in each row as you work through the integration. The "friction" column is
the most important: note anything that made you pause, look something up, feel
uncertain, or required more than one attempt.

| #   | Step                                      | What you did                                                                                                                                                                                                                                                                 | Friction / observations                                                                                                                                                                                    | Time (approx) |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1   | Install the package(s)                    | I installed the example project, and the node-monitoring package. No problems there. I did encounter some problems with installing the InfluxDB database. Namely i forgot to check to use the correct version (only works with version 1 or 2, as version 3 needs licensure) | Backend database installation, InfluxDBv2 website actually points to docker website, where InfluxDBv3 is selected by default                                                                               |               |
| 2   | Setup monitoring                          | Setting up the monitoring was pretty easy. I could use the example config and code with just one point of friction. In the local setup, InfluxDB uses http, not https, which needs to be configured in the configuration file of node-monitoring.                            | I misunderstood the advice or Readme and thought I had to change the configuration of InfluxDB. I dont think this would happen to somebody with experience with InfluxDB or in a professional environment. |               |
| 3   | Add the first counter (`orders.requests`) | This was quite as I could easily adapt the example code. easy                                                                                                                                                                                                                |                                                                                                                                                                                                            |               |
| 4   | Add the request latency histogram         | This was quite easy. With the right configuration it also immediatly showed up in InfluxDB as i wanted it to. Only thing I had to learn is how to measure latency of request in JS.                                                                                          |                                                                                                                                                                                                            |               |
| 5   | Add the `heap_used` gauge                 | Basically as above, no problems                                                                                                                                                                                                                                              |                                                                                                                                                                                                            |               |
| 6   | Add the `active_connections` gauge        | Also the only problem was figuring out how to count active_connections, but as I remember this was given in the example repo/ticket.                                                                                                                                         |                                                                                                                                                                                                            |               |
| 7   | Add the job processor counter             | I skipped this implementation                                                                                                                                                                                                                                                |                                                                                                                                                                                                            |               |
| 8   | Wire up SIGTERM / graceful shutdown       | I skipped this implementation                                                                                                                                                                                                                                                |                                                                                                                                                                                                            |               |
| 9   | Verify data arrived in InfluxDB           | The data arrived quickly and with the right configuration there was no need to do any processing if the right config was used.                                                                                                                                               |                                                                                                                                                                                                            |               |

---

## Open questions during integration

Note any questions you had that were not answered immediately by the README
or TypeScript types.

- I was asking myself, what is the exact difference of data processing between using the different metric types, i.e. What is the difference between a gauge and a counter and why is it exactly necessary? I feel like anything i can do with a counter I can also use a gauge.
- 
-

---

## Overall impressions

**What worked well:**

- The integration was definitely successfull. The only complexity was introduced by influxDB. The monitoring package itself was easy to use.

**What was confusing or took longer than expected:**

-
