import { useEffect, useRef, useState } from "react";
import { getConversation } from "../../api/chatApi";

const ChatBox = ({ activeUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState(false);
  const [online, setOnline] = useState(false);

  const bottomRef = useRef(null);
  const wsRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center">Loading...</div>
    );
  }

  // Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeUser) return;

    const fetchMessages = async () => {
      const res = await getConversation(activeUser.id);
      setMessages(res.data || []);
    };
    fetchMessages();

    const token = localStorage.getItem("access_token");
    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${activeUser.id}/?token=${token}`,
    );

    ws.onopen = () => setWsConnected(true);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "typing") {
        setTypingUser(data.typing);
        return;
      }

      if (data.type === "status") {
        setOnline(data.status === "online");
        return;
      }

      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.timestamp === data.timestamp && msg.sender === data.sender,
        );
        return exists ? prev : [...prev, data];
      });
    };

    ws.onclose = () => setWsConnected(false);

    wsRef.current = ws;
    return () => ws.close();
  }, [activeUser]);

  const sendMessage = () => {
    if (!input.trim()) return;

    wsRef.current.send(JSON.stringify({ message: input }));
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);

    wsRef.current.send(JSON.stringify({ typing: true }));

    setTimeout(() => {
      wsRef.current.send(JSON.stringify({ typing: false }));
    }, 1000);
  };

  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a user
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 font-bold border-b flex justify-between">
        <span>Chat with {activeUser.username}</span>
        <span className={online ? "text-green-500" : "text-gray-400"}>
          {online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => {
          const isMe = msg.sender === currentUser.id;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded max-w-xs ${
                  isMe ? "bg-blue-700 text-white" : "bg-blue-400 text-white"
                }`}
              >
                {msg.content}

                <div className="text-xs mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}

                  {isMe && (
                    <span className="ml-2">
                      {msg.is_read ? "✓✓" : msg.delivered ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {typingUser && <p className="text-sm text-gray-500">Typing...</p>}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2 bg-gray-200 dark:bg-gray-800">
        <input
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          disabled={!wsConnected}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
