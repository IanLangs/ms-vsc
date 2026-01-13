const vscode = require('vscode');

function transpileMS(code) {
    code = code.replace(/::\s*[^\s\(\)]*/g, "");
    code = code.replace(/mut\s+([a-zA-Z_]\w*)\s*=\s*(.+)/g,
        "let $1= (()=>{let v=$2; return {get:()=>v,set:n=>v=n}})()");
    code = code.replace(/immut\s+([a-zA-Z_]\w*)/g, "delete $1.set");
    code = code.replace(/fn/g, "function");
    return code;
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('mathscript.transpile', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const code = editor.document.getText();
        const jsCode = transpileMS(code);
        vscode.window.showInformationMessage('Código transpilado a JS (ver consola)');
        console.log(jsCode);
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
