import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const ConditionNode = ({ id, data }) => {
  const [rule, setRule] = useState(data?.rule || 'Is empty');

  const inputs = useMemo(
    () => [{ id: `${id}-input`, position: 'left' }],
    [id]
  );

  const outputs = useMemo(
    () => [
      { id: `${id}-true`, position: 'right', top: '38%' },
      { id: `${id}-false`, position: 'right', top: '68%' },
    ],
    [id]
  );

  return (
    <BaseNode id={id} title="Condition" subtitle="Branch" variant="rose" inputs={inputs} outputs={outputs}>
      <label className="vs-field">
        <span className="vs-field__label">Rule</span>
        <div className="vs-selectWrap">
          <select
            className="vs-input"
            value={rule}
            onChange={(e) => setRule(e.target.value)}
          >
            <option value="Is empty">Is empty</option>
            <option value="Has value">Has value</option>
            <option value="Equals">Equals</option>
          </select>
        </div>
      </label>
    </BaseNode>
  );
};