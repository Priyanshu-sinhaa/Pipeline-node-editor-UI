import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { BaseNode } from './BaseNode';

const VARIABLE_REGEX = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const variables = new Set();
  let match;

  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
};

const getNodeSize = (text) => {
  const lines = text.split('\n');
  const longestLine = lines.reduce(
    (max, line) => Math.max(max, line.length),
    0
  );

  return {
    width: Math.min(Math.max(280, longestLine * 7.4 + 120), 520),
    minHeight: Math.min(Math.max(180, lines.length * 24 + 120), 420),
  };
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  const inputs = useMemo(
    () =>
      variables.map((variable) => ({
        id: `${id}-${variable}`,
        position: 'left',
        label: variable,
      })),
    [id, variables]
  );

  const outputs = useMemo(
    () => [
      {
        id: `${id}-output`,
        position: 'right',
        label: 'text',
      },
    ],
    [id]
  );

  const nodeSize = useMemo(() => getNodeSize(currText), [currText]);

  useLayoutEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = '0px';
    const nextHeight = Math.min(
      Math.max(textareaRef.current.scrollHeight, 100),
      240
    );
    textareaRef.current.style.height = `${nextHeight}px`;
  }, [currText]);

  return (
    <BaseNode
      id={id}
      title="Text"
      subtitle="Template"
      variant="rose"
      inputs={inputs}
      outputs={outputs}
      style={{ width: nodeSize.width, minHeight: nodeSize.minHeight }}
    >
      <label className="vs-field">
        <span className="vs-field__label">Content</span>
        <textarea
          ref={textareaRef}
          className="vs-input vs-input--textarea vs-textarea--autosize"
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          placeholder="Write text with variables like {{input}}"
          rows={1}
        />
      </label>

      {variables.length > 0 ? (
        <div className="vs-variable-list">
          <span className="vs-field__label">Detected variables</span>
          <div className="vs-variable-list__items">
            {variables.map((variable) => (
              <span key={variable} className="vs-variable-chip">
                {variable}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </BaseNode>
  );
};