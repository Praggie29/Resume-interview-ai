const autocannon = require("autocannon");

async function runBenchmark() {
  console.log("🚀 Benchmarking /api/interview with Custom LRU Cache...\n");

  const result = await autocannon({
    url: "http://localhost:3000/api/interview",
    method: "GET",
    connections: 50,
    duration: 10,
    headers: {
      cookie: "token=YOUR_AUTH_TOKEN_HERE",
    },
  });

  console.log(autocannon.printResult(result));
}

runBenchmark();