import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (input.trim() !== '' || file) {
      setMessages([...messages, { text: input || 'File attached', user: 'user' }]);
      const userMessage = input;
      setLoading(true);
      setInput('');
      setFile(null);

      try {
        const formData = new FormData();
        formData.append('message', userMessage);
        if (file) {
          formData.append('file', file);
        }

        const response = await fetch('http://localhost:3000/ai', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          setMessages(prevMessages => [...prevMessages, { text: data.text, user: 'bot' }]);
        } else {
          setMessages(prevMessages => [...prevMessages, { text: 'Error: Unable to get response', user: 'bot' }]);
        }
      } catch (error) {
        console.error("Error connecting to the server:", error);
        setMessages(prevMessages => [...prevMessages, { text: 'Error: Unable to connect to the server', user: 'bot' }]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='flex-col justify-center items-center mb-7 bg-gray-800 min-h-[100vh] min-w-[100vw]'>
      <div className='text-4xl gap-6 text-white flex justify-center'>
        <p>AI Chatbot</p>
      </div>
      <div className="h-screen bg-gray-800 flex items-center justify-center">
        <div className="w-full max-w-lg p-6 bg-gray-900 rounded-lg shadow-lg">
          <div id="chatContainer" className="flex flex-col mb-4 h-[55vh] overflow-y-auto border border-gray-700 rounded-lg p-4 bg-gray-800">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.user === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-4 py-2 rounded-lg ${message.user === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'} transition-all duration-300 ease-in-out`}>
                  {message.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="mb-2 text-left">
                <span className="inline-block px-4 py-2 rounded-lg bg-gray-700 text-white transition-all duration-300 ease-in-out loading">
                  
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <textarea
              className="flex-1 p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 mb-2"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // Prevent default behavior of Enter key
                  sendMessage();
                }
              }}
              rows={3}
            />
            <input
              className="p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 mb-2"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
