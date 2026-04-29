import { useState } from 'react';
import { auth } from '../lib/firebase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let idToken;
      const currentUser = auth.currentUser;
      if (currentUser) {
        idToken = await currentUser.getIdToken();
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          idToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setMessages([...newMessages, data]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    isOpen,
    toggleChat,
    sendMessage,
    setMessages
  };
}
