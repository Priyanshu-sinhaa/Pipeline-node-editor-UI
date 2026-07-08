import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'contains');
  const [value, setValue] = useState(data?.value || 'important');

  const inputs = useMemo(
    () => [{ id: `${id}-items`, position: 'left' }],
    [id]
  );

  const outputs = useMemo(
    () => [{ id: `${id}-filtered`, position: 'right' }],
    [id]
  );

  return (
    <BaseNode id={id} title="Filter" subtitle="Logic" variant="yellow" inputs={inputs} outputs={outputs}>
      <label className="vs-field">
        <span className="vs-field__label">Condition</span>
        <div className="vs-selectWrap">

          <select
            className="vs-input"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts with</option>
          </select>
        </div>
      </label>

      <label className="vs-field">
        <span className="vs-field__label">Value</span>
        <input
          className="vs-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
    </BaseNode>
  );
};