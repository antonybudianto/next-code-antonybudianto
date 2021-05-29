import { useState } from "react";
import WebWorker from "react-webworker";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

const TOTAL_RUN = 100;

const roundMs = (ms) => {
  const rounded = Math.round(ms * 1000) / 1000;
  if (isNaN(rounded)) return 0;
  return rounded;
};

const BenchmarkCard = ({ code: initCode }) => {
  const [loading, setLoading] = useState(false);
  const [jsError, setJsError] = useState(false);
  const [code, setCode] = useState(initCode);

  const handleRun = async (postMessage) => {
    setLoading(true);
    setJsError(false);
    postMessage(code);
  };

  return (
    <WebWorker
      url="/runner.js"
      onError={() => {
        setJsError(true);
        setLoading(false);
      }}
      onMessage={() => {
        setLoading(false);
      }}
    >
      {({ data, error, postMessage }) => {
        if (error) {
          console.error(
            "Error when executing the code, please check your code"
          );
        }

        const result = data || [];
        const durations = result.map((r) => r.duration);
        const sorted = durations.sort((a, b) => a - b);
        const durationTotal = result.reduce((p, c) => p + c.duration, 0);
        const avg = roundMs(durationTotal / result.length);
        const fastest = roundMs(sorted[0]);
        const slowest = roundMs(sorted[sorted.length - 1]);

        return (
          <div className="flex mb-2 shadow-md p-4">
            <div className="flex-grow">
              <Editor
                padding={2}
                onValueChange={(cd) => setCode(cd)}
                highlight={(code) => highlight(code, languages.js)}
                value={code}
                className={jsError ? `border-l-2 border-red-500` : ""}
                style={{
                  minWidth: "200px",
                  minHeight: "100px",
                  maxWidth: "500px",
                }}
              />
            </div>
            <div className="ml-5 w-100">
              <button
                className="disabled:opacity-50 w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-sm leading-2 font-semibold py-2 px-5 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
                disabled={loading}
                onClick={() => handleRun(postMessage)}
              >
                {loading ? "...." : "Run!"}
              </button>
            </div>
            <div
              className="ml-5 text-left bg-white p-1"
              style={{
                width: "160px",
                fontSize: "10pt",
              }}
            >
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-600">
                RESULT
              </div>
              {result.length === 0 ? (
                <div className="text-gray-500">No run test yet</div>
              ) : (
                <>
                  <div suppressHydrationWarning>
                    {new Date().toLocaleString()}
                  </div>
                  <div>Total run: {TOTAL_RUN}</div>
                  <div>Avg: {avg}ms</div>
                  <div>Fastest: {fastest}ms</div>
                  <div>Slowest: {slowest}ms</div>
                </>
              )}
            </div>
          </div>
        );
      }}
    </WebWorker>
  );
};

export default BenchmarkCard;
