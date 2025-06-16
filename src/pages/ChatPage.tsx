import React from 'react';
import VariablesPanel from '../components/VariablesPanel';
import ChatAssistantPanel from '../components/ChatAssistantPanel';
import SavedDocumentsPanel from '../components/SavedDocumentsPanel';
import type { SavedDocument } from '../stores/useSavedDocumentsStore';

const ChatPage: React.FC = () => {
  const handleDocumentSelect = (document: SavedDocument) => {
    if (document.type === 'analysis') {
      // Load analysis content into chat
      console.log('Loading analysis:', document);
      // TODO: Implement analysis loading logic
    }
  };

  return (
    <div className="h-full flex">
      {/* Saved Documents Panel */}
      <SavedDocumentsPanel 
        currentPageType="analysis"
        onDocumentSelect={handleDocumentSelect}
      />

      {/* Main Content Area with Centered Chat */}
      <div className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-[720px] h-full flex justify-center">
          <ChatAssistantPanel 
            isExpanded={true}
            onToggle={() => {}} // No toggle needed since this is the main content
            mainMode={true} // Hide header and close button
            className="h-full w-full max-w-[720px]"
          />
        </div>
      </div>

      {/* Variables Panel */}
      <VariablesPanel />
    </div>
  );
};

export default ChatPage; 