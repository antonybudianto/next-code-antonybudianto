function testEnv() {
  if (window.document === undefined) {
    console.log("I'm fairly confident I'm a webworker");
    // return;
  } else {
    console.log("I'm fairly confident I'm in the renderer thread");
  }
}
export async function run(code, TOTAL_RUN) {
  testEnv();
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
