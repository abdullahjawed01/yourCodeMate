import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

export const runCode = async (req, res) => {
  const { language, code } = req.body;

  if (language !== 'python' && language !== 'javascript') {
    return res.status(400).json({ output: "Only Python and JavaScript are currently supported." });
  }

  if (!code) {
    return res.status(400).json({ output: "No code provided." });
  }

  const extension = language === 'python' ? 'py' : 'js';
  const filename = `${uuidv4()}.${extension}`;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, filename);

  try {
    await fs.writeFile(filePath, code);

    const command = language === 'python' ? 'python3' : 'node';
    const childProcess = spawn(command, [filePath]);

    let output = '';
    let errorOutput = '';

    // Timeout (5 seconds)
    const timeout = setTimeout(() => {
      childProcess.kill();
      output += '\n\n[Timeout Error]: Execution exceeded 5 seconds.';
    }, 5000);

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    childProcess.on('close', async (code) => {
      clearTimeout(timeout);
      
      // Cleanup temp file
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }

      if (code !== 0) {
        // Combine output and error for better feedback
        // If there is stderr, it usually is the error description
        res.status(200).json({ output: output + (errorOutput ? `\nError:\n${errorOutput}` : '') });
      } else {
        res.status(200).json({ output: output || "Process finished with no output." });
      }
    });

  } catch (error) {
    console.error("IDE Error:", error);
    res.status(500).json({ output: `Server Error: ${error.message}` });
  }
};
