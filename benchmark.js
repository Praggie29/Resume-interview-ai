const autocannon = require("autocannon");

async function runBenchmark() {
  console.log("🚀 Benchmarking /api/interview with Custom LRU Cache...\n");

  const result = await autocannon({
    url: "http://localhost:3000/api/interview",
    method: "GET",
    connections: 50,
    duration: 10,
    headers: {
      cookie: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYzBkMGY3ZWFkYjYwZDMxZGY5YTZmZiIsInVzZXJuYW1lIjoicGFyaXMiLCJpYXQiOjE3OTExMDcwMjgsImV4cCI6MTc5MTE5MzQyOH0.uVTTN64BmeanjAYrmYxiloe6a_Tsng2BNJjZVWRM7zE",
    },
  });

  console.log(autocannon.printResult(result));
}

runBenchmark();