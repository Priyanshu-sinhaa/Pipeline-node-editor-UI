import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const [title, setTitle] = useState(data?.noteTitle || 'Note');
  const [content, setContent] = useState(
    data?.content || 'Add context, reminders, or implementation notes here.'
  );

  const outputs = useMemo(
    () => [{ id: `${id}-note`, position: 'right', label: 'note' }],
    [id]
  );

  return (
    <BaseNode
      id={id}
      title="Note"
      subtitle="Context"
      variant="rose"
      outputs={outputs}
      style={{ width: '320px' }}
    >
      <label className="vs-field">
        <span className="vs-field__label">Title</span>
        <input
          className="vs-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
        />
      </label>

      <label className="vs-field">
        <span className="vs-field__label">Details</span>
        <textarea
          className="vs-input vs-input--textarea"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a note for this step..."
          rows={5}
        />
      </label>
    </BaseNode>
  );
};