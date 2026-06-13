import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';
import { SimulatedShell } from './simulatedShell';
import { terminalWsUrl } from '@/lib/api';

export interface TerminalHandle {
  insert: (text: string) => void;
  send: (key: string) => void;
  fit: () => void;
}

interface Props {
  sessionId?: string | null;
  host?: string;
  onStatus?: (s: 'connecting' | 'connected' | 'simulated' | 'closed') => void;
}

export const Terminal = forwardRef<TerminalHandle, Props>(function Terminal(
  { sessionId, host = 'forge', onStatus },
  ref,
) {
  const elRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lineRef = useRef('');
  const shellRef = useRef<SimulatedShell | null>(null);

  useImperativeHandle(ref, () => ({
    insert: (text: string) => {
      const term = termRef.current;
      if (!term) return;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(text);
      } else {
        lineRef.current += text;
        term.write(text);
      }
    },
    send: (key: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(key);
      else handleKey(key);
    },
    fit: () => fitRef.current?.fit(),
  }));

  function handleKey(data: string) {
    const term = termRef.current;
    const shell = shellRef.current;
    if (!term || !shell) return;
    for (const ch of data) {
      const code = ch.charCodeAt(0);
      if (code === 13) {
        term.write('\r\n');
        shell.exec(lineRef.current);
        lineRef.current = '';
        term.write(shell.prompt());
      } else if (code === 127) {
        if (lineRef.current.length) {
          lineRef.current = lineRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (code === 3) {
        term.write('^C\r\n');
        lineRef.current = '';
        term.write(shell.prompt());
      } else if (code === 12) {
        term.write('\x1b[2J\x1b[H');
        term.write(shell.prompt() + lineRef.current);
      } else if (code >= 32) {
        lineRef.current += ch;
        term.write(ch);
      }
    }
  }

  useEffect(() => {
    if (!elRef.current) return;
    const term = new XTerm({
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 13,
      cursorBlink: true,
      allowProposedApi: true,
      theme: {
        background: '#0A0A0F',
        foreground: '#cbd5e1',
        cursor: '#9D5CFF',
        selectionBackground: 'rgba(124,58,237,0.35)',
        black: '#0A0A0F',
        brightBlack: '#475569',
        blue: '#22D3EE',
        magenta: '#9D5CFF',
        green: '#34D399',
        red: '#F87171',
        yellow: '#FBBF24',
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.loadAddon(new WebLinksAddon());
    term.open(elRef.current);
    fit.fit();
    termRef.current = term;
    fitRef.current = fit;

    const shell = new SimulatedShell((s) => term.write(s), host);
    shellRef.current = shell;

    // Try real backend PTY first, fall back to simulated shell.
    if (sessionId) {
      onStatus?.('connecting');
      try {
        const ws = new WebSocket(terminalWsUrl(sessionId));
        wsRef.current = ws;
        const failTimer = setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close();
          }
        }, 1800);
        ws.onopen = () => {
          clearTimeout(failTimer);
          onStatus?.('connected');
          term.onData((d) => ws.send(d));
        };
        ws.onmessage = (ev) => term.write(typeof ev.data === 'string' ? ev.data : '');
        ws.onerror = () => {};
        ws.onclose = () => {
          if (!termRef.current) return;
          startSimulated(term, shell);
        };
      } catch {
        startSimulated(term, shell);
      }
    } else {
      startSimulated(term, shell);
    }

    function startSimulated(t: XTerm, sh: SimulatedShell) {
      onStatus?.('simulated');
      sh.banner();
      t.write(sh.prompt());
      t.onData(handleKey);
    }

    const onResize = () => fit.fit();
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => fit.fit());
    ro.observe(elRef.current);

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      wsRef.current?.close();
      term.dispose();
      termRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return <div ref={elRef} className="h-full w-full overflow-hidden" />;
});
