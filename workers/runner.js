export async function run(code, TOTAL_RUN) {
  for (let i = 0; i < TOTAL_RUN; i++) {
    performance.mark("functionStart");
    eval(code);
    performance.mark("functionEnd");
    performance.measure("functionMeasure", "functionStart", "functionEnd");
  }
  const res = performance.getEntriesByName("functionMeasure");
  performance.clearMarks();
  performance.clearMeasures();
  return res;
}
