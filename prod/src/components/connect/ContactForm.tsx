import { useState, useEffect } from 'react';
import type { FormFields, ContactFormData } from '../../types';

interface ContactFormProps {
  formFields: FormFields;
  formspreeId?: string;
}

export default function ContactForm({ formFields, formspreeId }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setShowStamp(true), 300);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = formspreeId
        ? `https://formspree.io/f/${formspreeId}`
        : '#';

      if (!formspreeId) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitted(true);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
          _subject: `New message from ${formData.name}`
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch {
      setError('Something went wrong. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    const formattedValue = field === 'phone' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  if (submitted) {
    return (
      <div className="call-sheet-success">
        <div className={`stamp-container ${showStamp ? 'stamp-visible' : ''}`}>
          <div className="approved-stamp">
            <span className="stamp-text">APPROVED</span>
            <span className="stamp-date">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
          </div>
        </div>
        <div className="success-content">
          <h3>Request Submitted</h3>
          <p>Your booking request has been logged. Expect a response within 24-48 hours.</p>
          <div className="confirmation-number">
            <span className="conf-label">CONFIRMATION</span>
            <span className="conf-value">#{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
          </div>
        </div>

        <style>{`
          .call-sheet-success {
            position: relative;
            padding: 3rem 1.5rem;
            text-align: center;
            min-height: 280px;
          }

          .stamp-container {
            position: absolute;
            top: 1rem;
            right: 1rem;
            transform: rotate(12deg) scale(0);
            opacity: 0;
            transition: transform 0.15s ease-out, opacity 0.15s ease-out;
          }

          .stamp-container.stamp-visible {
            transform: rotate(12deg) scale(1);
            opacity: 1;
          }

          .approved-stamp {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.5rem 1rem;
            border: 3px solid #228b22;
            border-radius: 4px;
            background: rgba(34, 139, 34, 0.05);
          }

          .stamp-text {
            font-family: var(--font-mono);
            font-size: 1.25rem;
            font-weight: 900;
            letter-spacing: 0.2em;
            color: #228b22;
          }

          .stamp-date {
            font-family: var(--font-mono);
            font-size: 0.6rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            color: #228b22;
            opacity: 0.8;
          }

          .success-content h3 {
            font-family: var(--font-mono);
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: #1a1a1a;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
          }

          :global(.dark) .success-content h3 {
            color: #f5f5f4;
          }

          .success-content p {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 1.5rem;
          }

          :global(.dark) .success-content p {
            color: #a8a29e;
          }

          .confirmation-number {
            display: inline-flex;
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.75rem 1.5rem;
            background: rgba(0, 0, 0, 0.03);
            border: 1px dashed #ccc;
          }

          :global(.dark) .confirmation-number {
            background: rgba(255, 255, 255, 0.03);
            border-color: #444;
          }

          .conf-label {
            font-family: var(--font-mono);
            font-size: 0.6rem;
            font-weight: 600;
            letter-spacing: 0.15em;
            color: #888;
          }

          .conf-value {
            font-family: var(--font-mono);
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: #1a1a1a;
          }

          :global(.dark) .conf-value {
            color: #f5f5f4;
          }

          @media (prefers-reduced-motion: reduce) {
            .stamp-container {
              transition: none;
            }
            .stamp-container.stamp-visible {
              transform: rotate(12deg) scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="call-sheet-form">
      <div className="form-section">
        <div className="section-header">
          <span className="section-number">01</span>
          <span className="section-title">CONTACT INFORMATION</span>
        </div>

        <div className="ruled-field">
          <label htmlFor="name">
            {formFields.name.label.toUpperCase()}
            {formFields.name.required && <span className="required">*</span>}
          </label>
          <input
            type="text"
            id="name"
            required={formFields.name.required}
            placeholder={formFields.name.placeholder}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <div className="field-underline" />
        </div>

        <div className="ruled-field">
          <label htmlFor="email">
            {formFields.email.label.toUpperCase()}
            {formFields.email.required && <span className="required">*</span>}
          </label>
          <input
            type="email"
            id="email"
            required={formFields.email.required}
            placeholder={formFields.email.placeholder}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          <div className="field-underline" />
        </div>

        <div className="ruled-field">
          <label htmlFor="phone">
            {formFields.phone.label.toUpperCase()}
          </label>
          <input
            type="tel"
            id="phone"
            placeholder={formFields.phone.placeholder}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          <div className="field-underline" />
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <span className="section-number">02</span>
          <span className="section-title">PROJECT DETAILS</span>
        </div>

        <div className="ruled-field textarea-field">
          <label htmlFor="message">
            {formFields.message.label.toUpperCase()}
            {formFields.message.required && <span className="required">*</span>}
          </label>
          <textarea
            id="message"
            required={formFields.message.required}
            placeholder={formFields.message.placeholder}
            rows={5}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
          {error}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="submit-button">
        <span className="rec-indicator" aria-hidden="true" />
        {isSubmitting ? 'TRANSMITTING...' : 'SUBMIT REQUEST'}
      </button>

      <style>{`
        .call-sheet-form {
          font-family: var(--font-mono);
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #1a1a1a;
        }

        :global(.dark) .section-header {
          border-bottom-color: #444;
        }

        .section-number {
          font-size: 0.7rem;
          font-weight: 700;
          color: #888;
          padding: 0.125rem 0.375rem;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 2px;
        }

        :global(.dark) .section-number {
          background: rgba(255, 255, 255, 0.1);
          color: #a8a29e;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #1a1a1a;
        }

        :global(.dark) .section-title {
          color: #f5f5f4;
        }

        .ruled-field {
          position: relative;
          margin-bottom: 1.25rem;
        }

        .ruled-field label {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #666;
          margin-bottom: 0.375rem;
        }

        :global(.dark) .ruled-field label {
          color: #a8a29e;
        }

        .required {
          color: #8b0000;
          margin-left: 0.25rem;
        }

        .ruled-field input,
        .ruled-field textarea {
          width: 100%;
          padding: 0.625rem 0;
          background: transparent;
          border: none;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: #1a1a1a;
          outline: none;
        }

        :global(.dark) .ruled-field input,
        :global(.dark) .ruled-field textarea {
          color: #f5f5f4;
        }

        .ruled-field input::placeholder,
        .ruled-field textarea::placeholder {
          color: #aaa;
          font-style: italic;
        }

        :global(.dark) .ruled-field input::placeholder,
        :global(.dark) .ruled-field textarea::placeholder {
          color: #666;
        }

        .field-underline {
          height: 1px;
          background: repeating-linear-gradient(
            90deg,
            #ccc 0px,
            #ccc 4px,
            transparent 4px,
            transparent 8px
          );
        }

        :global(.dark) .field-underline {
          background: repeating-linear-gradient(
            90deg,
            #444 0px,
            #444 4px,
            transparent 4px,
            transparent 8px
          );
        }

        .ruled-field input:focus ~ .field-underline,
        .ruled-field textarea:focus ~ .field-underline {
          background: #1a1a1a;
        }

        :global(.dark) .ruled-field input:focus ~ .field-underline,
        :global(.dark) .ruled-field textarea:focus ~ .field-underline {
          background: #d4af37;
        }

        .textarea-field textarea {
          resize: none;
          padding: 0.75rem;
          border: 1px dashed #ccc;
          background: rgba(0, 0, 0, 0.01);
          min-height: 120px;
        }

        :global(.dark) .textarea-field textarea {
          border-color: #444;
          background: rgba(255, 255, 255, 0.02);
        }

        .textarea-field textarea:focus {
          border-style: solid;
          border-color: #1a1a1a;
        }

        :global(.dark) .textarea-field textarea:focus {
          border-color: #d4af37;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(139, 0, 0, 0.05);
          border: 1px solid rgba(139, 0, 0, 0.2);
          color: #8b0000;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        :global(.dark) .error-message {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .error-message svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .submit-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
          border: none;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
          transform: translateY(-1px);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .rec-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: rec-blink 1s ease-in-out infinite;
        }

        .submit-button:disabled .rec-indicator {
          animation: none;
          background: #666;
          box-shadow: none;
        }

        @keyframes rec-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rec-indicator {
            animation: none;
          }
        }
      `}</style>
    </form>
  );
}
