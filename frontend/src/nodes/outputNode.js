import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace('customOutput-', 'output_')
  );
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  const inputs = useMemo(
    () => [
      {
        id: `${id}-value`,
        position: 'left',
      },
    ],
    [id]
  );

  return (
    <BaseNode id={id} title="Output" subtitle="Result" variant="teal" inputs={inputs}>
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
        <div className="vs-selectWrap">
          <select
            className="vs-input"
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </div>
      </label>
    </BaseNode>
  );
};