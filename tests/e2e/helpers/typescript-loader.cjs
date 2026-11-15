module.exports = async function typescriptLoader(source) {
  const { default: ts } = await import("typescript");
  return ts.transpileModule(source, {
    fileName: this.resourcePath,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
};
