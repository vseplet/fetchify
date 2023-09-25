# fetchify

```ts
import { RESTLimiter } from "https://deno.land/x/fetchify/mod.ts";

const limiter = new RESTLimiter({ interval: 1000 });

const res = await limiter.fetch(
  "https://jsonplaceholder.typicode.com/todos/1",
);
```
