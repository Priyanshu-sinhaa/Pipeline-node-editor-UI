import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const FeedbackContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export const FeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, tone = 'info', duration = 3600 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((current) => [...current, { id, title, message, tone }]);

    window.setTimeout(() => {
      dismissToast(id);
    }, duration);

    return id;
  }, [dismissToast]);

  const showModal = useCallback((payload) => {
    setModal(payload);
  }, []);

  const hideModal = useCallback(() => {
    setModal(null);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      showModal,
      hideModal,
    }),
    [showToast, showModal, hideModal]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div className="vs-toastStack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone] || Info;

          return (
            <div key={toast.id} className={`vs-toast vs-toast--${toast.tone}`}>
              <div className="vs-toast__icon">
                <Icon size={16} strokeWidth={2.2} />
              </div>

              <div className="vs-toast__content">
                <div className="vs-toast__title">{toast.title}</div>
                {toast.message ? <p className="vs-toast__message">{toast.message}</p> : null}
              </div>

              <button
                type="button"
                className="vs-toast__close"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={14} strokeWidth={2.4} />
              </button>
            </div>
          );
        })}
      </div>

      {modal ? (
        <div className="vs-modalBackdrop" onClick={hideModal}>
          <div
            className="vs-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pipeline-result-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="vs-modal__header">
              <div>
                <div className="vs-modal__eyebrow">Pipeline parsed</div>
                <h3 className="vs-modal__title" id="pipeline-result-title">
                  Submission result
                </h3>
              </div>

              <button
                type="button"
                className="vs-modal__close"
                onClick={hideModal}
                aria-label="Close result modal"
              >
                <X size={16} strokeWidth={2.4} />
              </button>
            </div>

            <p className="vs-modal__text">
              The backend parsed your pipeline successfully and returned the current graph summary.
            </p>

            <div className="vs-resultGrid">
              <div className="vs-resultCard">
                <span className="vs-resultCard__label">Nodes</span>
                <strong className="vs-resultCard__value">{modal.num_nodes}</strong>
              </div>

              <div className="vs-resultCard">
                <span className="vs-resultCard__label">Edges</span>
                <strong className="vs-resultCard__value">{modal.num_edges}</strong>
              </div>

              <div className={`vs-resultCard ${modal.is_dag ? 'is-success' : 'is-warning'}`}>
                <span className="vs-resultCard__label">Graph status</span>
                <strong className="vs-resultCard__value">
                  {modal.is_dag ? 'Valid DAG' : 'Contains cycle'}
                </strong>
              </div>
            </div>

            <div className="vs-modal__footer">
              <button type="button" className="vs-button vs-button--secondary" onClick={hideModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }

  return context;
};