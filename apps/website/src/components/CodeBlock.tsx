import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'bash',
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c0e14] overflow-hidden text-sm font-mono shadow-2xl">
      {/* Window bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700/80" />
          </div>
          {filename ? (
            <span className="text-slate-300 font-medium">{filename}</span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language}</span>
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed font-mono text-xs sm:text-sm">
        {lines.map((line, idx) => (
          <div key={idx} className="flex">
            {showLineNumbers && (
              <span className="select-none text-slate-600 w-8 flex-shrink-0 text-right pr-4">
                {idx + 1}
              </span>
            )}
            <span className="whitespace-pre">
              {line.startsWith('$') ? (
                <span>
                  <span className="text-emerald-400 select-none mr-2 font-bold">$</span>
                  <span className="text-slate-100">{line.slice(1).trim()}</span>
                </span>
              ) : line.startsWith('#') ? (
                <span className="text-slate-500 italic">{line}</span>
              ) : (
                line
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
