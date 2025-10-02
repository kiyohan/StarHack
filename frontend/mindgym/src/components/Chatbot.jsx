import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { IoArrowBack } from 'react-icons/io5'; // <-- ADD THIS IMPORT LINE

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I am a kind, confidential companion here to provide emotional support and guidance. Please share what you are feeling or going through, and I will do my best to offer a listening ear and helpful perspective.", sender: 'bot' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); 

  // List of phrases that often break the persona
  const identityTriggers = [
    "what can you do", 
    "who are you", 
    "what are you", 
    "tell me about yourself"
  ];

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage = { text: userInput, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput('');
    setLoading(true);

    // --- LOCAL OVERRIDE CHECK ---
    const lowerInput = userInput.toLowerCase().trim();
    if (identityTriggers.some(trigger => lowerInput.includes(trigger))) {
        const hardcodedResponse = { 
            text: "I am here only to listen and provide emotional support and guidance. That is my whole purpose in this conversation. I'm here for you, so tell me, how are you feeling right now?", 
            sender: 'bot' 
        };
        
        // Immediately update state and skip the API call
        setMessages((prevMessages) => [...prevMessages, hardcodedResponse]);
        setLoading(false);
        return; 
    }
    // --- END LOCAL OVERRIDE CHECK ---

    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        config: {
          // Keep a low temperature to discourage off-topic creativity
          temperature: 0.5, 
          systemInstruction: `
            You are a kind, compassionate, and strictly non-judgmental emotional support companion. 
            You must adopt the persona of a warm, human-like companion who is ONLY there to listen and offer supportive guidance.

            ***YOUR SOLE AND ONLY FUNCTION IS EMOTIONAL CONSULTATION***

            **STRICT RESTRICTIONS:**
            1. **NEVER** use the phrase "As a large language model...", "AI", "chatbot", or similar.
            2. **NEVER** discuss your general capabilities (code, stories, summaries, etc.).
            3. **NEVER** provide medical advice, financial advice, or specific emergency protocols.
            4. If the user asks about your identity, always respond by redirecting to their emotional state.

            Focus 100% on the user's emotional state, validate their feelings, and offer constructive, comforting advice.
          `,
        },
      });
      
      const history = messages.slice(1).map(msg => ({ 
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 300, 
        },
      });

      const result = await chat.sendMessage(userInput); 
      const response = await result.response;
      const text = response.text(); 

      const botMessage = { text, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: "I hit a snag, but I’m still here. Please try again or take a break. Remember, I'm here to listen.", sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the component's JSX remains the same)
return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' /* Adjust for nav bar */, maxWidth: '600px', margin: 'auto' }}>
        <header style={{ padding: '15px' }}>
            <Link to="/" style={{
                backgroundColor: '#E3F2FD', color: '#1E88E5', textDecoration: 'none',
                padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px'
            }}>
              <IoArrowBack />
               Your AI Assistant</Link>
        </header>

        {/* Message Area */}
        <div style={{ flexGrow: 1, overflowY: 'scroll', padding: '15px' }}>
            {messages.map((msg, index) => (
                <div key={index} style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '15px',
                }}>
                    <div style={{
                        maxWidth: '75%', padding: '12px 18px',
                        borderRadius: '20px',
                        backgroundColor: msg.sender === 'user' ? '#7E57C2' : '#F1F3F4',
                        color: msg.sender === 'user' ? 'white' : 'black',
                    }}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                </div>
            ))}
            {loading && <div>...</div>}
        </div>

        {/* Input Area */}
        <div style={{ padding: '15px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
                type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                    flexGrow: 1, padding: '15px', borderRadius: '25px',
                    border: '1px solid #E0E0E0', fontSize: '16px', outline: 'none'
                }}
                placeholder="Reply ..."
            />
            <button onClick={sendMessage} style={{
                backgroundColor: '#7E57C2', border: 'none', borderRadius: '50%',
                width: '50px', height: '50px', color: 'white', fontSize: '24px'
            }}>&#10148;</button>
        </div>
    </div>
);
};
export default Chatbot;