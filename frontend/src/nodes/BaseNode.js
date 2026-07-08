import { Handle, Position } from 'reactflow';
import { X } from 'lucide-react';
import { useStore } from '../store';

const positionMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const getHandleOffset = (index, total) => {
  if (total <= 1) return '50%';
  const gap = 100 / (total + 1);
  return `${gap * (index + 1)}%`;
};

export const BaseNode = ({
  id,
  title,
  subtitle,
  variant = 'default',
  inputs = [],
  outputs = [],
  children,
  style = {},
  className = '',
}) => {
  const removeNode = useStore((state) => state.removeNode);

  return (
    <div className={`vs-node vs-node--${variant} ${className}`} style={style}>
      {inputs.map((handle, index) => {
        const top = handle.top ?? getHandleOffset(index, inputs.length);

        return (
          <div
            key={handle.id}
            className="vs-node__port vs-node__port--left"
            style={{ top }}
          >
            {handle.label ? (
              <span className="vs-node__portLabel vs-node__portLabel--left">
                {handle.label}
              </span>
            ) : null}

            <Handle
              id={handle.id}
              type="target"
              position={positionMap[handle.position || 'left']}
              className="vs-node__handle"
            />
          </div>
        );
      })}

      {outputs.map((handle, index) => {
        const top = handle.top ?? getHandleOffset(index, outputs.length);

        return (
          <div
            key={handle.id}
            className="vs-node__port vs-node__port--right"
            style={{ top }}
          >
            <Handle
              id={handle.id}
              type="source"
              position={positionMap[handle.position || 'right']}
              className="vs-node__handle"
            />

            {handle.label ? (
              <span className="vs-node__portLabel vs-node__portLabel--right">
                {handle.label}
              </span>
            ) : null}
          </div>
        );
      })}

      <div className="vs-node__header">
        <div className="vs-node__titleRow">
          <h4 className="vs-node__title">{title}</h4>

          <div className="vs-node__actions">
            {subtitle ? <span className="vs-node__badge">{subtitle}</span> : null}

            <button
              type="button"
              className="vs-node__iconButton"
              onClick={() => removeNode(id)}
              aria-label={`Delete ${title} node`}
            >
              <X size={14} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>

      <div className="vs-node__body">{children}</div>
    </div>
  );
};