import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getConversation } from "../../api/chatApi";
import { getWebSocketUrl } from "../../config";

const ChatBox = ({ activeUser, currentUser, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState(false);
  const [online, setOnline] = useState(false);

  const bottomRef = useRef(null);
  const wsRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeUser || !currentUser) return;

    const fetchMessages = async () => {
      setMessages([]);
      const res = await getConversation(activeUser.id);
      setMessages(res.data || []);
    };
    fetchMessages();

    const token = localStorage.getItem("access_token");
    const ws = new WebSocket(
      getWebSocketUrl(`ws/chat/${activeUser.id}/?token=${encodeURIComponent(token || "")}`),
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
    return () => {
      wsRef.current = null;
      ws.close();
    };
  }, [activeUser, currentUser]);

  const sendMessage = () => {
    if (
      !input.trim() ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    wsRef.current.send(JSON.stringify({ message: input }));
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ typing: true }));

    setTimeout(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(JSON.stringify({ typing: false }));
    }, 1000);
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-[18rem] flex-1 items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="flex min-h-[18rem] flex-1 items-center justify-center">
        Select a user
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gray-100 dark:bg-gray-900 lg:h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b p-3 font-bold sm:p-4">
        <div className="flex min-w-0 items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full p-2 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Back to chats"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <span className="min-w-0 truncate">Chat with {activeUser.username}</span>
        </div>
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
                className={`max-w-[85%] rounded p-2 sm:max-w-xs ${
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
      <div className="flex gap-2 border-t bg-gray-200 p-3 dark:bg-gray-800 sm:p-4">
        <input
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="min-w-0 flex-1 rounded border bg-white p-2 text-black"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          disabled={!wsConnected}
          className="rounded bg-blue-500 px-4 text-white disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
