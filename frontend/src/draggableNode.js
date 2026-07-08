import { ArrowRight } from 'lucide-react';

export const DraggableNode = ({
  type,
  label,
  description,
  icon: Icon,
  tone = 'blue',
}) => {
  const onDragStart = (event, nodeType) => {
    const payload = { nodeType };
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(payload)
    );
    event.dataTransfer.effectAllowed = 'move';
    event.currentTarget.classList.add('is-dragging');
  };

  const onDragEnd = (event) => {
    event.currentTarget.classList.remove('is-dragging');
  };

  return (
    <div
      className="vs-drag-card"
      draggable
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
    >
      <div className={`vs-drag-card__icon vs-drag-card__icon--${tone}`}>
        {Icon ? <Icon strokeWidth={2.1} /> : null}
      </div>

      <div className="vs-drag-card__content">
        <div className="vs-drag-card__titleRow">
          <div className="vs-drag-card__title">{label}</div>
          <span className="vs-drag-card__badge">Drag</span>
        </div>
        <p className="vs-drag-card__description">{description}</p>
      </div>

      <div className="vs-drag-card__arrow">
        <ArrowRight size={16} strokeWidth={2.2} />
      </div>
    </div>
  );
};