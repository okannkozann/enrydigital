import { useId, useState, type ReactNode } from 'react';
import { UNITS } from '../models/catalogs';
import type { Unit } from '../types/form';
import { formatDecimal, parseDecimal, sanitizeDecimalInput } from '../utils/number';

interface FieldShellProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FieldShell({ label, htmlFor, error, required, children, className }: FieldShellProps) {
  return (
    <div className={`field${error ? ' field--error' : ''}${className ? ` ${className}` : ''}`}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="field__req" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: 'text' | 'date' | 'tel';
  placeholder?: string;
  className?: string;
  autoComplete?: string;
}

export function TextField({
  label,
  value,
  onChange,
  error,
  required,
  type = 'text',
  placeholder,
  className,
  autoComplete = 'off',
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} error={error} required={required} className={className}>
      <input
        id={id}
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
    </FieldShell>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  unit?: string;
  error?: boolean;
  required?: boolean;
  className?: string;
}

/**
 * Türkçe ondalık girişi (0,60) kabul eder; yazarken ham metni korur,
 * odaktan çıkınca biçimlendirir. Modelde standart number saklanır.
 */
export function NumberField({ label, value, onChange, unit, error, required, className }: NumberFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? formatDecimal(value);

  return (
    <FieldShell label={label} htmlFor={id} required={required} className={`${className ?? ''}${error ? ' field--error' : ''}`}>
      <div className="input-unit">
        <input
          id={id}
          className="input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={display}
          onFocus={() => setDraft(value === null ? '' : formatDecimal(value))}
          onChange={(e) => {
            const clean = sanitizeDecimalInput(e.target.value);
            setDraft(clean);
            onChange(parseDecimal(clean));
          }}
          onBlur={() => setDraft(null)}
          aria-invalid={error}
        />
        {unit && <span className="input-unit__suffix">{unit}</span>}
      </div>
    </FieldShell>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

export function SelectField<T extends string>({ label, value, onChange, options, className }: SelectFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} className={className}>
      <select id={id} className="input select" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function UnitSelect({ value, onChange }: { value: Unit; onChange: (u: Unit) => void }) {
  return (
    <SelectField<Unit>
      label="Birim"
      value={value}
      onChange={onChange}
      options={UNITS.map((u) => ({ value: u, label: u }))}
    />
  );
}
