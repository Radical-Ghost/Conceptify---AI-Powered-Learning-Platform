// styles.js
export const styles = {
  // Base styles
  container: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    width: '100%',
    minHeight: '100vh',
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  
  // Global loader
  globalLoader: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  
  // Enhanced Landing Page styles
  landingPage: {
    minHeight: '100vh',
    height: '100%',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #4338ca 100%)',
    color: 'white',
    padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  landingContainer: {
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  landingHeader: {
    textAlign: 'center',
    marginBottom: 'clamp(2rem, 5vw, 4rem)',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'clamp(1rem, 3vw, 2rem)',
    flexWrap: 'wrap',
  },
  brandTitle: {
    fontSize: 'clamp(2rem, 6vw, 4rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginLeft: 'clamp(0.5rem, 2vw, 1rem)',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
    color: '#e0e7ff',
    maxWidth: '90%',
    margin: '0 auto',
    lineHeight: '1.6',
    padding: '0 1rem',
    fontWeight: '300',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
    gap: 'clamp(1rem, 3vw, 2rem)',
    marginBottom: 'clamp(2rem, 5vw, 4rem)',
    padding: '0 clamp(0.5rem, 2vw, 1rem)',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    borderRadius: 'clamp(12px, 2vw, 20px)',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    textAlign: 'center',
    minHeight: 'clamp(200px, 25vh, 300px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
    }
  },
  featureIcon: {
    margin: '0 auto 1rem auto',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
  },
  featureTitle: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    fontWeight: '600',
    marginBottom: '0.75rem',
  },
  featureDescription: {
    color: '#d1d5db',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    lineHeight: '1.5',
  },
  buttonContainer: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    flexWrap: 'wrap',
    padding: '0 1rem',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: 'clamp(8px, 1.5vw, 12px)',
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: 'clamp(120px, 25vw, 160px)',
    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)',
    '&:hover': {
      backgroundColor: '#1d4ed8',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(37, 99, 235, 0.4)',
    }
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: 'clamp(8px, 1.5vw, 12px)',
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    fontWeight: '600',
    border: '2px solid #60a5fa',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: 'clamp(120px, 25vw, 160px)',
    '&:hover': {
      backgroundColor: 'rgba(96, 165, 250, 0.2)',
      transform: 'translateY(-2px)',
    }
  },

  // Enhanced Auth page styles
  authPage: {
    minHeight: '100vh',
    height: '100%',
    background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1rem, 3vw, 2rem)',
    position: 'relative',
    overflow: 'hidden',
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    borderRadius: 'clamp(12px, 2vw, 20px)',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    width: '100%',
    maxWidth: 'min(450px, 90vw)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
    color: 'white',
  },
  authTitle: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: '700',
    marginBottom: '0.75rem',
  },
  authSubtitle: {
    color: '#e0e7ff',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    fontWeight: '300',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(1rem, 2.5vw, 1.5rem)',
  },
  input: {
    width: '100%',
    padding: 'clamp(0.875rem, 2vw, 1rem)',
    borderRadius: 'clamp(8px, 1.5vw, 12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: 'rgba(96, 165, 250, 0.8)',
      boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.2)',
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)',
    }
  },
  authButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: 'clamp(0.875rem, 2vw, 1rem)',
    borderRadius: 'clamp(8px, 1.5vw, 12px)',
    fontWeight: '600',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)',
    '&:hover': {
      backgroundColor: '#1d4ed8',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(37, 99, 235, 0.4)',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none',
    }
  },
  authLinks: {
    textAlign: 'center',
    marginTop: 'clamp(1rem, 2.5vw, 2rem)',
  },
  authLink: {
    color: '#93c5fd',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#60a5fa',
    }
  },

  // Enhanced Dashboard styles
  dashboard: {
    minHeight: '100vh',
    height: '100%',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0 clamp(1rem, 3vw, 2rem)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'clamp(3.5rem, 8vh, 5rem)',
    flexWrap: 'wrap',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
    minWidth: '200px',
  },
  navTitle: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: '0.75rem',
  },
  navUser: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    flexWrap: 'wrap',
  },
  navButton: {
    color: '#64748b',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#334155',
      backgroundColor: '#f1f5f9',
    }
  },
  dashboardContent: {
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
    textAlign: 'center',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))',
    gap: 'clamp(1.5rem, 3vw, 2.5rem)',
    justifyItems: 'center',
  },
  dashboardCard: {
    backgroundColor: 'white',
    borderRadius: 'clamp(12px, 2vw, 16px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderLeft: '4px solid',
    width: '100%',
    maxWidth: '500px',
    minHeight: 'clamp(220px, 25vh, 320px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
    }
  },
  dashboardCardBlue: {
    borderLeftColor: '#3b82f6',
  },
  dashboardCardPurple: {
    borderLeftColor: '#8b5cf6',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)',
    flexWrap: 'wrap',
  },
  cardIcon: {
    marginRight: 'clamp(0.75rem, 2vw, 1.25rem)',
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  cardSubtitle: {
    color: '#64748b',
    margin: 0,
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
  },
  cardDescription: {
    color: '#475569',
    lineHeight: '1.6',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
  },

  // Enhanced Chat styles
  chatPage: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
  },
  chatContainer: {
    flex: 1,
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '1rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  chatCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  },
  chatMessages: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  chatEmpty: {
    textAlign: 'center',
    color: '#64748b',
    margin: 'auto',
    padding: '2rem',
  },
  chatEmptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#334155',
  },
  messageContainer: {
    display: 'flex',
    marginBottom: '1rem',
    animation: 'fadeIn 0.3s ease',
  },
  messageUser: {
    justifyContent: 'flex-end',
  },
  messageAi: {
    justifyContent: 'flex-start',
  },
  message: {
    maxWidth: '75%',
    padding: '0.875rem 1.25rem',
    borderRadius: '12px',
    lineHeight: '1.5',
    wordWrap: 'break-word',
    animation: 'slideIn 0.3s ease',
  },
  messageUserBubble: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  messageAiBubble: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    borderBottomLeftRadius: '4px',
  },
  chatInput: {
    borderTop: '1px solid #e2e8f0',
    padding: '1.25rem',
    backgroundColor: '#f8fafc',
  },
  chatInputContainer: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  chatInputField: {
    flex: 1,
    padding: '0.875rem 1.25rem',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
    }
  },
  chatSendButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.875rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#2563eb',
      transform: 'scale(1.05)',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none',
    }
  },

  // Enhanced OCR styles
  ocrPage: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
  },
  ocrContainer: {
    flex: 1,
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '2rem 1rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  ocrHeader: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  ocrTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
  },
  ocrSubtitle: {
    color: '#64748b',
    fontSize: '1.125rem',
  },
  ocrProcessing: {
    textAlign: 'center',
    padding: '3rem 1rem',
  },
  spinner: {
    width: '4rem',
    height: '4rem',
    border: '3px solid #f1f5f9',
    borderTop: '3px solid #8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1.5rem auto',
  },
  processingTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.75rem',
  },
  processingText: {
    color: '#64748b',
  },
  uploadArea: {
    border: '2px dashed #cbd5e1',
    borderRadius: '16px',
    padding: '3.5rem 2rem',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#8b5cf6',
      backgroundColor: '#f8fafc',
    }
  },
  uploadAreaHover: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f5f3ff',
  },
  uploadIcon: {
    margin: '0 auto 1.5rem auto',
    color: '#94a3b8',
  },
  uploadTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.75rem',
  },
  uploadDescription: {
    color: '#64748b',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },
  uploadButton: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    padding: '0.875rem 1.75rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#7c3aed',
      transform: 'translateY(-2px)',
    }
  },
  hiddenInput: {
    display: 'none',
  },

  // Enhanced OCR Result styles
  ocrResultPage: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
  },
  ocrResultContainer: {
    flex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem',
    width: '100%',
    overflow: 'auto',
  },
  ocrResultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(500px, 100%), 1fr))',
    gap: '2rem',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
    padding: '1.75rem',
    height: 'fit-content',
  },
  resultTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #f1f5f9',
  },
  extractedText: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '1.25rem',
    maxHeight: '24rem',
    overflowY: 'auto',
    color: '#475569',
    lineHeight: '1.6',
    fontSize: '0.95rem',
  },
  analysisSection: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.75rem',
    fontSize: '1.1rem',
  },
  conceptTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  conceptTag: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.375rem 0.875rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  difficultyTag: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '0.375rem 0.875rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'inline-block',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
    padding: '1.75rem',
  },
  actionButton: {
    width: '100%',
    textAlign: 'left',
    padding: '1.25rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '1rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    '&:last-child': {
      marginBottom: '0',
    }
  },
  actionButtonBlue: {
    backgroundColor: '#eff6ff',
    '&:hover': {
      backgroundColor: '#dbeafe',
    }
  },
  actionButtonGreen: {
    backgroundColor: '#f0fdf4',
    '&:hover': {
      backgroundColor: '#dcfce7',
    }
  },
  actionContent: {
    display: 'flex',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: '1rem',
    flexShrink: 0,
  },
  actionTitle: {
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
    fontSize: '1.05rem',
  },
  actionDescription: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: 0,
  },

  // Navigation styles
  navBackButton: {
    marginRight: '1rem',
    color: '#64748b',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#334155',
      backgroundColor: '#f1f5f9',
    }
  },
};

// Add keyframe animations
export const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;