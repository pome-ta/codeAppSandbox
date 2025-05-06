//[extensionMonaco/src/sandbox/sandbox.js at main · pome-ta/extensionMonaco · GitHub](https://github.com/pome-ta/extensionMonaco/blob/main/src/sandbox/sandbox.js)


let consoleResult;


console.log = function (...log) {
  consoleResult += log.map((lg) => JSON.stringify(lg)) + '\n';
};

window.addEventListener('message', (e) => {
  consoleResult = '';
  const timeStr = new Date().toLocaleTimeString();
  const code = e.data;
  try {
    eval(code);
    e.source.postMessage(
      {
        result: { time: timeStr, success: true, code: consoleResult },
        isSandbox: true,
      },
      e.origin
    );
  } catch (error) {
    e.source.postMessage(
      {
        result: { time: timeStr, success: false, code: error },
        isSandbox: true,
      },
      e.origin
    );
  }
});
