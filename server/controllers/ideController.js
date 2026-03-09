import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

export const runCode = async (req, res) => {
  const { language, code } = req.body;

  const supportedLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'rust', 'ruby', 'swift'];
  if (!supportedLanguages.includes(language)) {
    return res.status(400).json({ output: "Language " + language + " is not supported." });
  }

  if (!code) {
    return res.status(400).json({ output: "No code provided." });
  }

  const exts = {
    python: 'py', javascript: 'js', typescript: 'ts', java: 'java',
    cpp: 'cpp', rust: 'rs', ruby: 'rb', swift: 'swift'
  };
  
  const ext = exts[language];
  const uniqueId = uuidv4();
  // Java requires the class name to match the file name if it's public, so let's name it Solution.java for java
  const filename = language === 'java' ? "Solution_" + uniqueId.replace(/-/g, '') + ".java" : uniqueId + "." + ext;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, filename);
  const outPath = path.join(tempDir, uniqueId); // for compiled languages

  try {
    let codeToWrite = code;
    // For Java, replace public class Solution with the dynamic filename to avoid compile errors
    if (language === 'java') {
      const className = path.basename(filename, '.java');
      codeToWrite = code.replace(/public class [A-Za-z0-9_]+/g, "public class " + className);
    }

    await fs.writeFile(filePath, codeToWrite);

    let command = '';
    let args = [];

    switch (language) {
      case 'python':
        command = 'python3'; args = [filePath]; break;
      case 'javascript':
        command = 'node'; args = [filePath]; break;
      case 'typescript':
        command = 'npx'; args = ['ts-node', filePath]; break;
      case 'ruby':
        command = 'ruby'; args = [filePath]; break;
      case 'swift':
        command = 'swift'; args = [filePath]; break;
      case 'cpp':
        command = 'sh'; args = ['-c', 'g++ "' + filePath + '" -o "' + outPath + '" && "' + outPath + '"']; break;
      case 'rust':
        command = 'sh'; args = ['-c', 'rustc "' + filePath + '" -o "' + outPath + '" && "' + outPath + '"']; break;
      case 'java':
        const dir = path.dirname(filePath);
        const name = path.basename(filename, '.java');
        command = 'sh'; args = ['-c', 'javac "' + filePath + '" && java -cp "' + dir + '" ' + name]; break;
    }

    const childProcess = spawn(command, args);

    let output = '';
    let errorOutput = '';

    // Timeout (10 seconds to allow for compilation)
    const timeout = setTimeout(() => {
      childProcess.kill();
      output += '\n\n[Timeout Error]: Execution exceeded 10 seconds.';
    }, 10000);

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    childProcess.on('close', async (exitCode) => {
      clearTimeout(timeout);
      
      // Cleanup temp files
      try {
        await fs.unlink(filePath).catch(() => {});
        if (['cpp', 'rust'].includes(language)) await fs.unlink(outPath).catch(() => {});
        if (language === 'java') {
            const classFile = filePath.replace('.java', '.class');
            await fs.unlink(classFile).catch(() => {});
        }
      } catch (err) {}

      if (exitCode !== 0) {
        res.status(200).json({ output: output + (errorOutput ? "\nError:\n" + errorOutput : '') });
      } else {
        res.status(200).json({ output: output || "Process finished with no output." });
      }
    });

  } catch (error) {
    console.error("IDE Error:", error);
    res.status(500).json({ output: "Server Error: " + error.message });
  }
};
