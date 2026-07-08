import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const PromptNode = ({ id, data }) => {
  const [role, setRole] = useState(data?.role || 'System');
  const [prompt, setPrompt] = useState(
    data?.prompt || 'You are a helpful assistant.'
  );

  const inputs = useMemo(
    () => [{ id: `${id}-context`, position: 'left' }],
    [id]
  );

  const outputs = useMemo(
    () => [{ id: `${id}-prompt`, position: 'right' }],
    [id]
  );

  return (
    <BaseNode id={id} title="Prompt" subtitle="Template" variant="rose" inputs={inputs} outputs={outputs}>
      <label className="vs-field">
        <span className="vs-field__label">Role</span>
        <div className="vs-selectWrap">
          <select
            className="vs-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="System">System</option>
            <option value="User">User</option>
            <option value="Developer">Developer</option>
          </select>
        </div>
      </label>

      <label className="vs-field">
        <span className="vs-field__label">Prompt</span>
        <textarea
          className="vs-input vs-input--textarea"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </label>
    </BaseNode>
  );
};