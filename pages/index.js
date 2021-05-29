import Head from "next/head";
import BenchmarkCard from "../components/BenchmarkCard";

const code1 = `const n = 5000000;
const res = (n * (n + 1)) / 2;
`;
const code2 = `const n = 5000000;
let res = 0;
for(let i = 1; i <= n; i++) {
  res += i;
}
`;

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center h-auto md:h-screen">
      <Head>
        <title>JSBench</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no"
        />
      </Head>

      <div className="px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-red-600 tracking-tight mt-8 mb-8 sm:mt-14 sm:mb-10">
            JSBench
          </h1>
          <p className="text-gray-500 text-lg sm:text-2xl sm:leading-10 font-medium mb-10 sm:mb-11">
            Benchmark your JS code!
          </p>

          <BenchmarkCard code={code1} />
          <BenchmarkCard code={code2} />
        </div>
      </div>
      <div className="m-5 py-5 text-gray-500">
        by Antony Budianto. {new Date().getFullYear()}.
      </div>
    </div>
  );
}
