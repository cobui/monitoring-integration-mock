## Overall Comparison

- **Which package felt easier to integrate and why:**

cobui/node-monitoring definitely felt easier. From the code component, i didnt need an extra file like `instrumentation.mjs` to set it up. Further it integrated directly into the InfluxDB database, which makes having another translation service unnecessary.
Setting up this translation service was also the hardest part of OTel, as I do not have good experience with such architectures.

- **Which package felt less complex conceptually to understand and why:**
OTel is definitely the more complex package. This is I think also by design, its plugin ecosystem probably make it very versatile. For somebody who does not need to montior many different services at the same time though, this is not necessary. Most app developers would benefit from a simpler telemetry service.



### Ratings

On a scale from **1–10** (1 = extremely easy/least, 10 = extremely difficult/most):

| Category                                                            | `@cobuid/node-monitoring` | OTeL |
| ------------------------------------------------------------------- | ------------------------- | ---- |
| General Complexity                                                  |               1           |  7   |
| Ease of integration                                                 |               3           |  7   |
| Ease of understanding and relating relevant concepts and components |               4           |  7   |
| Intuitiveness (naming, workflow, abstractions)                      |               3           |  6   |
