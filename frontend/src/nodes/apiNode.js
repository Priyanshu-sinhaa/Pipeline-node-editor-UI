import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [endpoint, setEndpoint] = useState(data?.endpoint || 'https://api.example.com');

  const inputs = useMemo(
    () => [
      { id: `${id}-params`, position: 'left', top: '38%' },
      { id: `${id}-body`, position: 'left', top: '68%' },
    ],
    [id]
  );

  const outputs = useMemo(
    () => [{ id: `${id}-response`, position: 'right' }],
    [id]
  );

  return (
    <BaseNode id = {id} title="API" subtitle="Request" variant="teal" inputs={inputs} outputs={outputs}>
      <label className="vs-field">
        <span className="vs-field__label">Method</span>
        <div className="vs-selectWrap">
          <select
            className="vs-input"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
          </select>
        </div>
      </label>

      <label className="vs-field">
        <span className="vs-field__label">Endpoint</span>
        <input
          className="vs-input"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
      </label>
    </BaseNode>
  );
};