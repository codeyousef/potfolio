'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TerminalNavProps {
  onCommand?: (command: string) => void;
}

export default function TerminalNav({ onCommand }: TerminalNavProps) {
  const [history, setHistory] = useState([
    '> SYSTEM INITIALIZED',
    '> TYPE "HELP" FOR COMMANDS'
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const commands: Record<string, () => void> = {
    'help': () => {
      addToHistory([
        'AVAILABLE COMMANDS:',
        '  ls         - List all projects',
        '  cd work    - Navigate to work section',
        '  cd tech    - Navigate to tech section',
        '  whoami     - Display system info',
        '  sudo hire me - Initiate contact protocol',
        '  cat secrets.txt - Access classified data',
        '  clear      - Clear terminal',
        '  rm -rf /   - [DANGEROUS] System purge',
        '  hack --self - Enter matrix mode'
      ]);
    },
    'ls': () => {
      addToHistory([
        'PROJECTS/',
        '├── neural-network-visualizer.exe',
        '├── quantum-portfolio-v2.app',
        '├── reality-breach-simulator.js',
        '├── consciousness.tar.gz',
        '└── [REDACTED].classified'
      ]);
    },
    'cd work': () => {
      addToHistory(['Navigating to /work...']);
      setTimeout(() => router.push('/work'), 500);
    },
    'cd tech': () => {
      addToHistory(['Already in /tech']);
    },
    'cd ..': () => {
      addToHistory(['Navigating to root...']);
      setTimeout(() => router.push('/'), 500);
    },
    'whoami': () => {
      addToHistory([
        'USER: root',
        'SYSTEM: BREACHER v2.0.25',
        'CLEARANCE: LEVEL 9',
        'STATUS: COMPROMISED'
      ]);
    },
    'sudo hire me': () => {
      addToHistory([
        '[sudo] password for root: ********',
        'ACCESS GRANTED',
        'Initiating contact protocol...',
        'Email: breacher@techportfolio.com'
      ]);
    },
    'cat secrets.txt': () => {
      addToHistory([
        'Reading secrets.txt...',
        '',
        'THE REAL SECRET IS THAT THERE ARE NO SECRETS',
        'EXCEPT THIS ONE: I ACTUALLY ENJOY DEBUGGING',
        'AND THIS: DARK MODE IS THE ONLY MODE',
        '',
        'P.S. Check the browser console for more'
      ]);
      console.log('%c🔓 SECRET UNLOCKED', 'color: #00FF41; font-size: 20px;');
      console.log('%cYou found the developer console. Email subject: "CONSOLE HACKER"', 'color: #00FF41;');
    },
    'clear': () => {
      setHistory(['> TERMINAL CLEARED']);
    },
    'rm -rf /': () => {
      addToHistory(['INITIATING SYSTEM PURGE...']);
      setTimeout(() => {
        document.body.style.transition = 'transform 2s ease-in';
        document.body.style.transform = 'scale(0) rotate(720deg)';
        setTimeout(() => {
          document.body.innerHTML = '<div style="color: #00FF41; padding: 2rem; font-family: monospace;">SYSTEM RESTORED FROM BACKUP</div>';
          setTimeout(() => location.reload(), 2000);
        }, 2000);
      }, 1000);
    },
    'hack --self': () => {
      addToHistory(['ENTERING MATRIX MODE...']);
      document.body.classList.add('matrix-mode');
      setTimeout(() => {
        document.body.classList.remove('matrix-mode');
        addToHistory(['Reality restored. Or is it?']);
      }, 5000);
    },
    'exit': () => {
      addToHistory(['There is no escape.']);
    },
    'ping reality': () => {
      addToHistory(['Pinging reality...', 'Destination host unreachable']);
    },
    'wget consciousness.tar.gz': () => {
      addToHistory(['Downloading consciousness...', 'Progress: [████████████████████] 100%', 'Download complete. Extracting soul...']);
      // Actually download resume
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'consciousness.tar.gz';
      link.click();
    }
  };

  const addToHistory = (lines: string | string[]) => {
    const newLines = Array.isArray(lines) ? lines : [lines];
    setHistory(prev => [...prev, ...newLines]);
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = currentCommand.trim().toLowerCase();
      addToHistory(`> ${currentCommand}`);
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
      
      if (cmd in commands) {
        commands[cmd]();
      } else if (cmd) {
        addToHistory(`Command not found: ${cmd}. Type "help" for available commands.`);
      }
      
      setCurrentCommand('');
      if (onCommand) onCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  return (
    <div 
      className="fixed top-4 right-4 w-96 font-mono z-50"
      onClick={() => inputRef.current?.focus()}
    >
      <div 
        ref={terminalRef}
        className="p-4 shadow-terminal overflow-y-auto max-h-96"
        style={{ 
          backgroundColor: '#0A0A0A',
          border: '1px solid #00FF41',
          color: '#00FF41',
          fontSize: '0.875rem'
        }}
      >
        {/* Terminal header */}
        <div className="flex items-center mb-2 text-xs" style={{ color: '#008F11' }}>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF0040' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFAA00' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00FF41' }} />
          </div>
          <div className="ml-4">root@breacher:~$</div>
        </div>
        
        {/* Terminal content */}
        <div>
          {history.map((line, i) => (
            <div key={i} className="mb-1" style={{ 
              color: line.startsWith('>') ? '#00FF41' : 
                     line.includes('ERROR') || line.includes('DANGEROUS') ? '#FF0040' :
                     line.includes('WARNING') ? '#FFAA00' : '#00FF41'
            }}>
              {line}
            </div>
          ))}
          <div className="flex items-center">
            <span className="mr-2">{'>'}</span>
            <input 
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleCommand}
              className="bg-transparent outline-none flex-1"
              style={{ caretColor: '#00FF41' }}
              spellCheck={false}
              autoComplete="off"
            />
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}