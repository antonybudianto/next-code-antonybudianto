self.addEventListener(
  "message",
  function (e) {
    run(e.data, 100);
  },
  false
);

function run(code, TOTAL_RUN) {
  if (/postMessage\([^)]*\)/.test(code)) {
    throw new Error("Invalid code");
  }
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
  self.postMessage(result);
  return res;
}
