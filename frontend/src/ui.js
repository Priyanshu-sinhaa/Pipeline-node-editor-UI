import { useState, useRef, useCallback } from 'react';
import {useFeedback} from './hooks/FeedbackProvider';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BaseEdge,
  EdgeLabelRenderer,
  ControlButton,
  getSmoothStepPath,
} from 'reactflow';
import { X, Sparkles, Lock, Unlock } from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';
import { submitPipeline } from './submit';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { PromptNode } from './nodes/promptNode';
import { APINode } from './nodes/apiNode';
import { FilterNode } from './nodes/filterNode';
import { TransformNode } from './nodes/transformNode';
import { ConditionNode } from './nodes/conditionNode';
import { MergeNode } from './nodes/mergeNode';
import { NoteNode } from './nodes/noteNode';
import 'reactflow/dist/style.css';


const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  prompt: PromptNode,
  api: APINode,
  filter: FilterNode,
  transform: TransformNode,
  condition: ConditionNode,
  merge: MergeNode,
  note: NoteNode,
};



const getMiniMapColor = (node) => {
  switch (node.type) {
    case 'customInput':
      return '#ffe28a';
    case 'llm':
      return '#d9e0ff';
    case 'customOutput':
      return '#c8f5ee';
    case 'text':
      return '#ffdced';
    case 'prompt':
      return '#f8deff';
    case 'api':
      return '#d4f3ff';
    case 'filter':
      return '#e4edff';
    case 'transform':
      return '#dde8ff';
    case 'condition':
      return '#ece7ff';
    case 'merge':
      return '#d9f7f1';
    case 'note':
      return '#ffecc7';
    default:
      return '#e6ebf8';
  }
};

const getMiniMapStroke = (node) => {
  switch (node.type) {
    case 'customInput':
      return '#d4a300';
    case 'llm':
      return '#6d7ff2';
    case 'customOutput':
      return '#1f9d8f';
    case 'text':
      return '#d26a98';
    case 'prompt':
      return '#b26ee5';
    case 'api':
      return '#3297c8';
    case 'filter':
      return '#6e86d6';
    case 'transform':
      return '#5a78d6';
    case 'condition':
      return '#7a69d6';
    case 'merge':
      return '#239b8f';
    case 'note':
      return '#d08a1f';
    default:
      return '#9da8c7';
  }
};


const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  removeEdge: state.removeEdge,
});

const DeletableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) => {
  const removeEdge = useStore((state) => state.removeEdge);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: '#7d86a2', strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 1000,
          }}
        >
          <button
            type="button"
            className="vs-edge-delete"
            onClick={(event) => {
              event.stopPropagation();
              removeEdge(id);
            }}
          >
            <X size={12} strokeWidth={2.4} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const edgeTypes = {
  deletable: DeletableEdge,
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isLayoutLocked, setIsLayoutLocked] = useState(false);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const { showToast, showModal } = useFeedback();

  const handleSubmit = async () => {
    try {
      const result = await submitPipeline(nodes, edges);

      showToast({
        tone: 'success',
        title: 'Pipeline submitted',
        message: 'Your workflow was parsed successfully.',
      });

      showModal(result);
    } catch (error) {
      console.error(error);

      showToast({
        tone: 'error',
        title: 'Submission failed',
        message: 'Could not reach the backend. Make sure FastAPI is running on localhost:8000.',
        duration: 5000,
      });
    }
  };



  const getInitNodeData = (nodeID, type) => ({
    id: nodeID,
    nodeType: type,
  });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event?.dataTransfer?.getData('application/reactflow');

      if (!raw || !reactFlowInstance) return;

      let type = null;

      try {
        const parsed = JSON.parse(raw);
        type = parsed?.nodeType;
      } catch {
        type = raw;
      }

      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);

      const newNode = {
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      };

      addNode(newNode);
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  return (
    <div className="vs-canvas" ref={reactFlowWrapper}>
      <div className="vs-canvas__header">
        <div>
          <h3 className="vs-canvas__title">Pipeline editor</h3>
        </div>

        <div className="vs-canvas__actions">
          <div className="vs-canvas__hint">
            {isLayoutLocked
              ? 'Node positions locked · editing still enabled'
              : 'Connect nodes from left to right'}
          </div>
          <button type="button" className="vs-submitButton" onClick={handleSubmit}>
            <span className="vs-submitButton__icon">
              <Sparkles size={14} strokeWidth={2.4} />
            </span>
            <span>Submit pipeline</span>
          </button>
        </div>
      </div>

      <div className="vs-canvas__surface">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView = {{padding : 0.16}}
          minZoom={0.35}
          maxZoom={1.5}
          snapToGrid
          snapGrid={[gridSize, gridSize]}
          proOptions={proOptions}
          deleteKeyCode={['Backspace', 'Delete']}
          nodesDraggable={!isLayoutLocked}
        >
          <Background
            variant="dots"
            color="#cfd5e6"
            gap={22}
            size={1.4}
          />
          
          <MiniMap
            pannable
            zoomable
            position="bottom-right"
            className="vs-minimap"
            nodeColor={getMiniMapColor}
            nodeStrokeColor={getMiniMapStroke}
            nodeBorderRadius={16}
            nodeStrokeWidth={2}
            maskColor="rgba(28, 34, 58, 0.12)"
            bgColor="rgba(240, 244, 255, 0.92)"
            zoomStep={12}
            ariaLabel="Pipeline overview"
          />

          <Controls showInteractive={false}>
            <ControlButton
              onClick={() => setIsLayoutLocked((prev) => !prev)}
              title={isLayoutLocked ? 'Unlock node positions' : 'Lock node positions'}
              aria-label={isLayoutLocked ? 'Unlock node positions' : 'Lock node positions'}
            >
              {isLayoutLocked ? (
                <Lock size={16} strokeWidth={2.2} />
              ) : (
                <Unlock size={16} strokeWidth={2.2} />
              )}
            </ControlButton>
          </Controls>
        </ReactFlow>
      </div>
    </div>
  );
};

