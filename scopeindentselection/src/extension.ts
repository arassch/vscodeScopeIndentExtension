// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "scopeindentselection" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.scopeIndent', () => {
		// The code you place here will be executed every time your command is executed

		if(vscode.window.activeTextEditor === undefined || 
			vscode.window.activeTextEditor.document === undefined)
		{
			return;
		}
		let editor = vscode.window.activeTextEditor;
		
		let start_pos = editor.selection.start;
		let end_pos = editor.selection.end;
		let start_pos_beginning_line = new vscode.Position(start_pos.line, 0);
		let range_indent = new vscode.Range(start_pos_beginning_line, start_pos);
		let indent_text = editor.document.getText(range_indent);
		editor.edit(builder => builder.insert(start_pos_beginning_line, indent_text + '{\n'),
		{undoStopAfter : false, undoStopBefore : true}).then(() => {
			let start_of_next_line = new vscode.Position(end_pos.line+2, 0);
			editor.edit(builder => builder.insert(start_of_next_line, indent_text + '}\n'), 
			{undoStopAfter : false, undoStopBefore : false}).then(() => {
				vscode.commands.executeCommand('editor.action.indentLines', 
				{rest: []});
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
