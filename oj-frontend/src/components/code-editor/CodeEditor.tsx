import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string) => void;
  theme: 'vs' | 'vs-dark';
}

// Mapping from our language IDs to Monaco's language IDs
const LANGUAGE_MAPPING: Record<string, string> = {
  'c': 'c',
  'cpp': 'cpp',
  'java': 'java',
  'python': 'python',
  'javascript': 'javascript',
  'csharp': 'csharp'
};

// Default code templates for each language
const DEFAULT_CODE_TEMPLATES: Record<string, string> = {
  'c': `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`,
  'cpp': `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  'java': `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Your code here
    }
}`,
  'python': `# Your code here
`,
  'javascript': `// Your code here
`,
  'csharp': `using System;

class Program {
    static void Main() {
        // Your code here
    }
}`,
};

export default function CodeEditor({ language, code, onChange, theme }: CodeEditorProps) {
  const [editorHeight, setEditorHeight] = useState('100%');
  const [editorInstance, setEditorInstance] = useState<any>(null);
  
  // Handle editor mount
  const handleEditorDidMount = (editor: any) => {
    setEditorInstance(editor);
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      folding: true,
      wordWrap: 'on',
      automaticLayout: true,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      }
    });
    
    // Add keyboard shortcut for run (Ctrl+Enter or Cmd+Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const submitButton = document.querySelector('button:has(.fa-play)');
      submitButton?.dispatchEvent(new MouseEvent('click'));
    });
      
    // Focus the editor
    editor.focus();
  };
  
  // Handle editor layout changes
  useEffect(() => {
    const handleResize = () => {
      editorInstance?.layout();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editorInstance]);
  
  return (
    <div className="relative w-full h-full">
      {/* Editor */}
      <MonacoEditor
        height="100%"
        language={LANGUAGE_MAPPING[language] || language}
        value={code || DEFAULT_CODE_TEMPLATES[language] || ''}
        onChange={(value) => value && onChange(value)}
        theme={theme}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          folding: true,
          wordWrap: 'on'
        }}
      />
      
      {/* Keyboard shortcut hint */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-70">
        <span className="mr-1">提交快捷键:</span>
        <kbd className="px-1.5 py-0.5 bg-black rounded border border-gray-600">Ctrl</kbd>
        <span className="mx-1">+</span>
        <kbd className="px-1.5 py-0.5 bg-black rounded border border-gray-600">Enter</kbd>
      </div>
    </div>
  );
}

// We need to declare monaco globally since it's loaded by the MonacoEditor
