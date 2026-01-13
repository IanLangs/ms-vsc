const vscode = require("vscode");
const { exec } = require("child_process");

const Consts = [
    [/::\s*[^\s\(\)]*/g, ""],
    [/mut\s+([a-zA-Z_]\w*)\s*=\s*(.+)/g, "let $1= (()=>{let v=$2; return {get:()=>v,set:n=>v=n}})()"],
    [/immut\s+([a-zA-Z_]\w*)/g, "delete $1.set"],
    [/using\(/g, "require("],
    [/fn/g, "function"]
];

function transpile(code) {
    for (let [i, j] of Consts) {
        code = code.replace(i, j);
    }
    return code;
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('mathscript.transpile', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return vscode.window.showErrorMessage("No active editor");

        const code = editor.document.getText();
        const jsCode = transpile(code);

        const output = vscode.window.createOutputChannel("MathScript Transpile");
        output.show(true);
        output.appendLine(jsCode);

        // Ejecuta msc si está instalado y muestra la salida
        exec(`msc --transpile temp.ms`, { shell: true }, (err, stdout, stderr) => {
            if (err) output.appendLine(`Error: ${err.message}`);
            if (stderr) output.appendLine(stderr);
            if (stdout) output.appendLine(stdout);
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
