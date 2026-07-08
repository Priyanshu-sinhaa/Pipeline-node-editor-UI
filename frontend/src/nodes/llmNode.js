import { useMemo, useState } from 'react';
import { BaseNode } from './BaseNode';
import { providerLogos } from '../providerLogos';

const PROVIDERS = {
  OpenAI: {
    tone: 'vs-providerBadge--openai',
    models: ['GPT-4.1', 'GPT-4o', 'GPT-4 Turbo'],
  },
  Anthropic: {
    tone: 'vs-providerBadge--anthropic',
    models: ['Claude 3.5 Sonnet', 'Claude 3 Opus'],
  },
  Google: {
    tone: 'vs-providerBadge--google',
    models: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash'],
  },
  Meta: {
    tone: 'vs-providerBadge--meta',
    models: ['Llama 3 70B', 'Llama 3 8B'],
  },
};

export const LLMNode = ({ id, data }) => {
  const [provider, setProvider] = useState(data?.provider || 'OpenAI');
  const [model, setModel] = useState(data?.model || 'GPT-4.1');

  const providerMeta = PROVIDERS[provider];
  const providerLogo = providerLogos[provider];

  const inputs = useMemo(
    () => [
      { id: `${id}-system`, position: 'left', top: '38%', label: 'system' },
      { id: `${id}-prompt`, position: 'left', top: '68%', label: 'prompt' },
    ],
    [id]
  );

  const outputs = useMemo(
    () => [{ id: `${id}-response`, position: 'right', label: 'response' }],
    [id]
  );

  const handleProviderChange = (event) => {
    const nextProvider = event.target.value;
    setProvider(nextProvider);
    setModel(PROVIDERS[nextProvider].models[0]);
  };

  return (
    <BaseNode
      id={id}
      title="LLM"
      subtitle="Model"
      variant="blue"
      inputs={inputs}
      outputs={outputs}
    >
      <div className={`vs-providerBadge ${providerMeta.tone}`}>
        {providerLogo ? (
          <img
            src={providerLogo}
            alt={`${provider} logo`}
            className="vs-providerBadge__logo"
          />
        ) : null}
        <span>{provider}</span>
      </div>

      <label className="vs-field">
        <span className="vs-field__label">Provider</span>
        <div className="vs-selectWrap vs-selectWrap--select">
          <select
            className="vs-input vs-input--select"
            value={provider}
            onChange={handleProviderChange}
          >
            {Object.keys(PROVIDERS).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className="vs-field">
        <span className="vs-field__label">Model</span>
        <div className="vs-selectWrap vs-selectWrap--select">
          <select
            className="vs-input vs-input--select"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          >
            {providerMeta.models.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </label>
    </BaseNode>
  );
};