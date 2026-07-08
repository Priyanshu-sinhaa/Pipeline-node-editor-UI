import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace('customInput-', 'input_')
  );
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  const outputs = useMemo(
    () => [
      {
        id: `${id}-value`,
        position: 'right',
      },
    ],
    [id]
  );

  return (
    <BaseNode id={id} title="Input" subtitle="Source" variant="yellow" outputs={outputs}>
      <label className="vs-field">
        <span className="vs-field__label">Name</span>
        <input
          className="vs-input"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
        />
      </label>

      <label className="vs-field">
        <span className="vs-field__label">Type</span>
          <select
            className="vs-input"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
      </label>
    </BaseNode>
  );
};