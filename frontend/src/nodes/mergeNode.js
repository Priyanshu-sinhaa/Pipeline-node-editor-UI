import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
  const [strategy, setStrategy] = useState(data?.strategy || 'Append');
  const [outputKey, setOutputKey] = useState(data?.outputKey || 'merged_result');

  const inputs = useMemo(
    () => [
      { id: `${id}-input-a`, position: 'left', top: '34%', label: 'input_a' },
      { id: `${id}-input-b`, position: 'left', top: '66%', label: 'input_b' },
    ],
    [id]
  );

  const outputs = useMemo(
    () => [{ id: `${id}-output`, position: 'right', label: 'merged' }],
    [id]
  );

  return (
    <BaseNode
      id={id}
      title="Merge"
      subtitle="Combine"
      variant="teal"
      inputs={inputs}
      outputs={outputs}
    >
      <label className="vs-field">
        <span className="vs-field__label">Strategy</span>
        <div className="vs-selectWrap vs-selectWrap--select">
          <select
            className="vs-input vs-input--select"
            value={strategy}
            onChange={(event) => setStrategy(event.target.value)}
          >
            <option value="Append">Append</option>
            <option value="Overwrite">Overwrite</option>
            <option value="Deep Merge">Deep Merge</option>
            <option value="Array Union">Array Union</option>
          </select>
        </div>
      </label>

      <label className="vs-field">
        <span className="vs-field__label">Output key</span>
        <input
          className="vs-input"
          value={outputKey}
          onChange={(event) => setOutputKey(event.target.value)}
          placeholder="merged_result"
        />
      </label>
    </BaseNode>
  );
};