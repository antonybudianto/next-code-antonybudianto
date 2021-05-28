import { useState } from "react";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

const TOTAL_RUN = 100;

const createWorker = createWorkerFactory(() => import("../workers/runner"));

const BenchmarkCard = ({ code: initCode }) => {
  const worker = useWorker(createWorker);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(initCode);
  const [result, setResult] = useState([]);

  const handleRun = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const rs = await worker.run(code, TOTAL_RUN);
        setLoading(false);
        setResult(rs);
      } catch (e) {
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const roundMs = (ms) => Math.round(ms * 1000) / 1000;
  const durations = result.map((r) => r.duration);
  const durationTotal = result.reduce((p, c) => p + c.duration, 0);
  const avg = roundMs(durationTotal / result.length);
  const sorted = durations.sort((a, b) => a - b);
  const fastest = roundMs(sorted[0]);
  const slowest = roundMs(sorted[sorted.length - 1]);

  return (
    <div className="flex mb-2 shadow-md p-4 relative">
      <div className="flex-grow">
        <Editor
          padding={2}
          onValueChange={(cd) => setCode(cd)}
          highlight={(code) => highlight(code, languages.js)}
          value={code}
          style={{
            minWidth: "200px",
            minHeight: "100px",
            maxWidth: "500px",
          }}
        />
      </div>
      <div className="ml-5 w-100 relative">
        <button
          className="disabled:opacity-50 w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-sm leading-2 font-semibold py-2 px-5 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
          disabled={loading}
          onClick={handleRun}
        >
          {loading ? "...." : "Run!"}
        </button>
      </div>

      {result.length !== 0 && !loading ? (
        <div
          className="mt-5 text-left bg-white shadow-md p-2 rounded"
          style={{
            position: "absolute",
            top: "-15%",
            left: "102%",
            width: "300px",
            fontSize: "10pt",
          }}
        >
          <div className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-600">
            RESULT
          </div>
          <div>{new Date().toLocaleString()}</div>
          <div>Total run: {TOTAL_RUN}</div>
          <div>Avg: {avg}ms</div>
          <div>Fastest: {fastest}ms</div>
          <div>Slowest: {slowest}ms</div>
        </div>
      ) : null}
    </div>
  );
};

export default BenchmarkCard;
