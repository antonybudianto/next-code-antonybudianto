self.addEventListener(
  "message",
  function (e) {
    // self.postMessage(e.data);
    run(e.data, 100);
  },
  false
);

async function run(code, TOTAL_RUN) {
  for (let i = 0; i < TOTAL_RUN; i++) {
    performance.mark("functionStart");
    eval(code);
    performance.mark("functionEnd");
    performance.measure("functionMeasure", "functionStart", "functionEnd");
  }
  const res = performance.getEntriesByName("functionMeasure");
  performance.clearMarks();
  performance.clearMeasures();
  const result = res.map((r) => ({ duration: r.duration }));
  postMessage(result);
  return res;
}
