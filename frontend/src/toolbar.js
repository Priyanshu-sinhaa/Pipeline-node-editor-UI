import { useMemo, useState } from 'react';
import {
  AlignLeft,
  Bot,
  Braces,
  CircleDot,
  FileText,
  Filter,
  GitBranch,
  Globe,
  Search,
  Sparkles,
  SquareTerminal,
  Waypoints,
} from 'lucide-react';
import { DraggableNode } from './draggableNode';

const TOOLBAR_SECTIONS = [
  {
    id: 'core',
    label: 'Core',
    items: [
      {
        type: 'customInput',
        label: 'Input',
        description: 'Start a pipeline with structured input.',
        icon: AlignLeft,
        tone: 'yellow',
      },
      {
        type: 'text',
        label: 'Text',
        description: 'Compose prompt text and variables.',
        icon: FileText,
        tone: 'rose',
      },
      {
        type: 'llm',
        label: 'LLM',
        description: 'Generate output with a model node.',
        icon: Bot,
        tone: 'blue',
      },
      {
        type: 'customOutput',
        label: 'Output',
        description: 'Render or return the final result.',
        icon: SquareTerminal,
        tone: 'teal',
      },
    ],
  },
  {
    id: 'logic',
    label: 'Logic',
    items: [
      {
        type: 'condition',
        label: 'Condition',
        description: 'Split the flow into conditional paths.',
        icon: GitBranch,
        tone: 'blue',
      },
      {
        type: 'filter',
        label: 'Filter',
        description: 'Keep only items matching a rule.',
        icon: Filter,
        tone: 'teal',
      },
      {
        type: 'transform',
        label: 'Transform',
        description: 'Format or map data before the next step.',
        icon: Braces,
        tone: 'yellow',
      },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    items: [
      {
        type: 'prompt',
        label: 'Prompt',
        description: 'Template content for model-ready prompts.',
        icon: Sparkles,
        tone: 'rose',
      },
      {
        type: 'api',
        label: 'API',
        description: 'Represent an external request step.',
        icon: Globe,
        tone: 'blue',
      },
      {
        type: 'merge',
        label: 'Merge',
        description: 'Combine multiple upstream branches.',
        icon: Waypoints,
        tone: 'teal',
      },
      {
        type: 'note',
        label: 'Note',
        description: 'Annotate the pipeline with guidance.',
        icon: CircleDot,
        tone: 'yellow',
      },
    ],
  },
];

export const PipelineToolbar = () => {
  const [activeSection, setActiveSection] = useState('core');
  const [query, setQuery] = useState('');

  const activeItems = useMemo(() => {
    const section =
      TOOLBAR_SECTIONS.find((entry) => entry.id === activeSection) ??
      TOOLBAR_SECTIONS[0];

    if (!query.trim()) return section.items;

    return section.items.filter((item) =>
      `${item.label} ${item.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    );
  }, [activeSection, query]);

  return (
    <aside className="vs-toolbar">
      <div className="vs-toolbar__header">
        <div className="vs-toolbar__eyebrow">Pipeline builder</div>
        <h1 className="vs-toolbar__title">Node library</h1>
      </div>

      <div className="vs-toolbar__search">
        <Search size={16} strokeWidth={2} />
        <input
          className="vs-toolbar__searchInput"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search nodes"
        />
      </div>

      <div className="vs-toolbar__tabs" role="tablist" aria-label="Node groups">
        {TOOLBAR_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`vs-toolbar__tab ${
              activeSection === section.id ? 'is-active' : ''
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="vs-toolbar__panel">
        <div className="vs-toolbar__groupTitle">
          {
            TOOLBAR_SECTIONS.find((entry) => entry.id === activeSection)?.label
          }{' '}
          nodes
        </div>

        <div className="vs-toolbar__grid">
          {activeItems.map((item) => (
            <DraggableNode
              key={item.type}
              type={item.type}
              label={item.label}
              description={item.description}
              icon={item.icon}
              tone={item.tone}
            />
          ))}
        </div>

        {activeItems.length === 0 ? (
          <div className="vs-toolbar__empty">
            No nodes found for “{query}”.
          </div>
        ) : null}
      </div>
    </aside>
  );
};