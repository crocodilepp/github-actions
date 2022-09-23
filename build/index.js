const core = require('@actions/core');
const fs = require('fs');
const exec = require('child_process');

try {
    const editorPath = core.getInput('editorPath');
    let command;
    if (editorPath === 'auto') {
        const allFileContents = fs.readFileSync('./ProjectSettings/ProjectVersion.txt', 'utf-8');
        const firstLine = allFileContents.split(/\r?\n/)[0];
        const version = firstLine.split(' ')[1];
        command = `"C:/Program Files/Unity/Hub/Editor/${version}/Editor/Unity.exe" -quit -batchmode -projectPath . -executeMethod Builder.Build`;
    } else {
        command = `"${editorPath}" -quit -batchmode -projectPath . -executeMethod Builder.Build`;
    }

    console.log(command);
    exec.exec(command, (error, stdout, stderr) => {
        if (error) {
            core.setFailed(error.message);
        }
        if (stderr) {
            core.setFailed(stderr);
        }
        console.log(stdout);
    });
} catch (error) {
    core.setFailed(error.message);
}
