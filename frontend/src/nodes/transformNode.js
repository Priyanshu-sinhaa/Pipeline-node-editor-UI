import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'Uppercase');

  const inputs = useMemo(
    () => [{ id: `${id}-input`, position: 'left' }],
    [id]
  );

  const outputs = useMemo(
    () => [{ id: `${id}-output`, position: 'right' }],
    [id]
  );

  return (
    <BaseNode id={id} title="Transform" subtitle="Formatter" variant="blue" inputs={inputs} outputs={outputs}>
      <label className="vs-field">
        <span className="vs-field__label">Operation</span>
        <div className="vs-selectWrap">
          <select
            className="vs-input"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
          >
            <option value="Uppercase">Uppercase</option>
            <option value="Lowercase">Lowercase</option>
            <option value="Trim">Trim</option>
            <option value="JSON Parse">JSON Parse</option>
          </select>
        </div>
      </label>
    </BaseNode>
  );
};