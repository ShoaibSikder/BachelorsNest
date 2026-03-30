// ChatBox.jsx
import { useEffect, useRef, useState } from "react";
import { getConversation } from "../../api/chatApi";

const ChatBox = ({ activeUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const wsRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Prevent crash if currentUser not loaded
  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading user...
      </div>
    );
  }

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle activeUser change
  useEffect(() => {
    if (!activeUser) {
      setMessages([]);
      wsRef.current?.close();
      return;
    }

    // Fetch conversation history
    const fetchMessages = async () => {
      try {
        const res = await getConversation(activeUser.id);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to fetch conversation", err);
        setMessages([]);
      }
    };
    fetchMessages();

    // Connect WebSocket with JWT token
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("No JWT token found for WebSocket");
      return;
    }

    const socket = new WebSocket(
      `${wsProtocol}://127.0.0.1:8000/ws/chat/${activeUser.id}/?token=${token}`,
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Prevent duplicate messages for sender
        setMessages((prev) => {
          // Only add if it doesn't already exist
          if (
            prev.length > 0 &&
            prev[prev.length - 1].id === data.id &&
            data.id
          ) {
            return prev;
          }
          return [...prev, data];
        });
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = (e) => {
      console.log("WebSocket disconnected", e.code);
      setWsConnected(false);
    };

    wsRef.current = socket;

    return () => socket.close();
  }, [activeUser, currentUser]);

  // Send message via WebSocket
  const sendMessage = () => {
    if (!input.trim() || !activeUser || !currentUser || !wsRef.current) return;

    const wsClient = wsRef.current;

    if (wsClient.readyState === WebSocket.OPEN) {
      const messageData = {
        sender: currentUser.id,
        receiver: activeUser.id,
        content: input,
      };

      wsClient.send(JSON.stringify(messageData));

      // Optimistically add to messages so sender sees it instantly
      setMessages((prev) => [
        ...prev,
        { ...messageData, timestamp: new Date().toISOString() },
      ]);
      setInput(""); // clear input immediately
    } else {
      console.warn("WebSocket is not open");
    }
  };

  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 font-bold text-gray-800 dark:text-white border-b">
        Chat with {activeUser?.username || "User"}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === currentUser.id;
            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-2 rounded max-w-xs break-words ${
                    isMe
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
                  }`}
                >
                  {msg.content || ""}
                  <div className="text-xs mt-1 opacity-70">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="flex p-4 gap-2 border-t bg-gray-200 dark:bg-gray-800 sticky bottom-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className={`px-4 rounded text-white ${
            wsConnected ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!wsConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
