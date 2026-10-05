import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import type { Point, SketchData, SketchItem } from '../types/form';

type Tool = 'pen' | 'line' | 'mark' | 'text';

const INK = '#0b2a4a';
const MARK = '#d9480f';

const TOOLS: { id: Tool; label: string; icon: string }[] = [
  { id: 'pen', label: 'Kalem', icon: '✎' },
  { id: 'line', label: 'Çizgi', icon: '╱' },
  { id: 'mark', label: 'İşaret', icon: '◉' },
  { id: 'text', label: 'Ölçü / Yazı', icon: 'A' },
];

function render(ctx: CanvasRenderingContext2D, w: number, h: number, items: SketchItem[]) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // hafif kılavuz ızgarası
  ctx.strokeStyle = '#e8edf3';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 50; x < w; x += 50) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 50; y < h; y += 50) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const it of items) {
    if (it.type === 'pen') {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.beginPath();
      it.points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      if (it.points.length === 1) ctx.lineTo(it.points[0][0] + 0.1, it.points[0][1]);
      ctx.stroke();
    } else if (it.type === 'line') {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(it.from[0], it.from[1]);
      ctx.lineTo(it.to[0], it.to[1]);
      ctx.stroke();
    } else if (it.type === 'mark') {
      ctx.fillStyle = MARK;
      ctx.beginPath();
      ctx.arc(it.at[0], it.at[1], 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (it.type === 'text') {
      ctx.font = '600 30px system-ui, -apple-system, sans-serif';
      ctx.textBaseline = 'middle';
      const m = ctx.measureText(it.text);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillRect(it.at[0] - 4, it.at[1] - 20, m.width + 8, 40);
      ctx.fillStyle = INK;
      ctx.fillText(it.text, it.at[0], it.at[1]);
    }
  }
}

interface SketchPadProps {
  value: SketchData;
  onChange: (next: SketchData) => void;
}

export function SketchPad({ value, onChange }: SketchPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [confirmClear, setConfirmClear] = useState(false);
  const drawing = useRef<SketchItem | null>(null);
  const { width: W, height: H, items } = value;

  const redraw = useCallback(
    (extra?: SketchItem | null) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      render(ctx, W, H, extra ? [...items, extra] : items);
    },
    [W, H, items],
  );

  useEffect(() => {
    redraw();
  }, [redraw]);

  const commit = (nextItems: SketchItem[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    render(ctx, W, H, nextItems);
    const image = nextItems.length ? canvas.toDataURL('image/png') : null;
    onChange({ ...value, items: nextItems, image });
  };

  const toPoint = (e: RPointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return [
      Math.round(((e.clientX - rect.left) / rect.width) * W),
      Math.round(((e.clientY - rect.top) / rect.height) * H),
    ];
  };

  const onDown = (e: RPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const p = toPoint(e);
    if (tool === 'mark') {
      commit([...items, { type: 'mark', at: p }]);
      return;
    }
    if (tool === 'text') {
      const text = window.prompt('Ölçü veya not yazın (örn. 9,50 m):');
      if (text && text.trim()) commit([...items, { type: 'text', at: p, text: text.trim() }]);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current =
      tool === 'pen' ? { type: 'pen', points: [p] } : { type: 'line', from: p, to: p };
    redraw(drawing.current);
  };

  const onMove = (e: RPointerEvent<HTMLCanvasElement>) => {
    const cur = drawing.current;
    if (!cur) return;
    const p = toPoint(e);
    if (cur.type === 'pen') cur.points.push(p);
    else if (cur.type === 'line') cur.to = p;
    redraw(cur);
  };

  const onUp = () => {
    const cur = drawing.current;
    if (!cur) return;
    drawing.current = null;
    if (cur.type === 'line' && cur.from[0] === cur.to[0] && cur.from[1] === cur.to[1]) {
      redraw();
      return;
    }
    commit([...items, cur]);
  };

  return (
    <div className="sketch">
      <div className="sketch__toolbar" role="toolbar" aria-label="Kroki araçları">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tool${tool === t.id ? ' tool--active' : ''}`}
            onClick={() => setTool(t.id)}
            aria-pressed={tool === t.id}
          >
            <span className="tool__icon" aria-hidden="true">
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
        <span className="sketch__spacer" />
        <button
          type="button"
          className="tool"
          disabled={items.length === 0}
          onClick={() => commit(items.slice(0, -1))}
        >
          <span className="tool__icon" aria-hidden="true">
            ↶
          </span>
          Geri Al
        </button>
        <button
          type="button"
          className="tool tool--danger"
          disabled={items.length === 0}
          onClick={() => setConfirmClear(true)}
        >
          <span className="tool__icon" aria-hidden="true">
            ✕
          </span>
          Temizle
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="sketch__canvas"
        width={W}
        height={H}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-label="Kroki çizim alanı"
      />

      {confirmClear && (
        <div className="sketch__confirm" role="alert">
          <span>Tüm kroki silinsin mi?</span>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmClear(false)}>
            Vazgeç
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => {
              setConfirmClear(false);
              commit([]);
            }}
          >
            Evet, temizle
          </button>
        </div>
      )}
    </div>
  );
}
