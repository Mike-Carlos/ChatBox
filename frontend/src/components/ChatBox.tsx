import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import authService from "../services/authService";
import axios from "axios";
import "../assets/ChatBox.css";
import notificationSound from "../assets/longnotif.mp3";

const ChatBox = () => {

    type User = {
        id: string;
        username: string;
    };
    
    type Message = {
        id: string;
        sender: User;
        content: string;
        timestamp: string;
    };

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [lastSentByUser, setLastSentByUser] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef(new Audio(notificationSound));
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await authService.getUserInfo();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, []);

     useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get("http://192.168.40.118:5000/messages", {
                    headers: authService.getAuthHeaders(),
                });

                if (messages.length > 0 && response.data.length > messages.length) {
                    const newMsg = response.data[response.data.length - 1];
                    
                    if (newMsg.sender?.id !== user?.id) {
                        audioRef.current.play(); // Play sound for other user's message
                    }
                }

                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, [messages, user]);


    useEffect(() => {
        // 🔹 Scroll only if the last message was sent by the current user
        if (lastSentByUser) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setLastSentByUser(false); // Reset flag after scrolling
        }
    }, [messages]); 

    // const sendMessage = async () => {
    //     if (newMessage.trim() === "" || !user) return;
    //     try {
    //         setLastSentByUser(true); // Ensure scrolling will happen after messages update
    //         await axios.post("http://192.168.40.118:5000/messages", { content: newMessage }, {
    //             headers: authService.getAuthHeaders(),
    //         });
    //         setNewMessage("");
    //     } catch (error) {
    //         console.error("Error sending message:", error);
    //     }
    // };

    const sendMessage = async () => {
        if ((!newMessage.trim() && !selectedFile) || !user) return;
    
        const formData = new FormData();
        formData.append("content", newMessage);
        if (selectedFile) formData.append("image", selectedFile); // ✅ Send image as FormData
    
        const headers = {
            ...authService.getAuthHeaders(),
            // Axios automatically sets 'Content-Type' for FormData
        };
    
        try {
            setLastSentByUser(true);
            const response = await axios.post("http://192.168.40.118:5000/messages", formData, { headers });
            console.log("Message Sent:", response.data);
            setNewMessage("");
            setSelectedFile(null);
        } catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    // const fetchMessages = async () => {
    //     try {
    //         const response = await axios.get("http://192.168.40.118:5000/messages", {
    //             headers: authService.getAuthHeaders(),
    //         });

    //         if (messages.length > 0 && response.data.length > messages.length) {
    //             const newMsg = response.data[response.data.length - 1];

    //             if (newMsg.sender?.id !== user?.id) {
    //                 audioRef.current.play(); // Play sound for other user's message
    //             }
    //         }

    //         setMessages(response.data);
    //     } catch (error) {
    //         console.error("Error fetching messages:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchMessages(); // Fetch once when component mounts
    // }, [user]);

    // const sendMessage = async () => {
    //     if (newMessage.trim() === "" || !user) return;
    //     try {
    //         setLastSentByUser(true);
    //         await axios.post("http://192.168.40.118:5000/messages", { content: newMessage }, {
    //             headers: authService.getAuthHeaders(),
    //         });

    //         setNewMessage("");
    //         fetchMessages(); // ✅ Now fetchMessages is defined, no error
    //     } catch (error) {
    //         console.error("Error sending message:", error);
    //     }
    // };



    
    // Press Enter Key to send a message
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter"){
            e.preventDefault();
            sendMessage();
        }
    }

    const getImageSrc = (imageData: string | null) => {
        if (!imageData) return null;
        return `data:image/png;base64,${imageData}`; // ✅ Convert BLOB to base64
    };

    return (
        <div className="container mt-3">
            <div className="card">
                <div className="card-header bg-primary text-white text-center">
                    IKAW SI <b>{user ? user.username : "Guest"}</b>
                </div>
                <div className="card-body" style={{ height: "600px",overflowY: "auto" }}>
                    {/* {messages.map((msg, index) => {
                        const isCurrentUser = msg.sender?.id === user?.id;
                        return (
                            <div key={index} className={`d-flex ${isCurrentUser ? "justify-content-end" : "justify-content-start"} mb-2`}>
                                <div className={`message-container ${isCurrentUser ? "current-user" : "other-user"}`}>
                                    <strong>{msg.sender?.username}</strong>: {msg.content}
                                    <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })} */}

                
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.sender?.id === user?.id;
                    return (
                        <div key={index} className={`d-flex ${isCurrentUser ? "justify-content-end" : "justify-content-start"} mb-2`}>
                            <div className={`message-container ${isCurrentUser ? "current-user" : "other-user"}`}>
                                <strong>{msg.sender?.username}</strong>:
                                {msg.content && <p>{msg.content}</p>}
                                {msg.imageData && <img src={getImageSrc(msg.imageData)} alt="Message" />}
                                <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                    );
                })}
                    <div ref={messagesEndRef}></div>
                </div>
                <input type="file" className="form-control mt-2" onChange={handleFileChange} />

                <div className="card-footer">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleEnter}
                        disabled={!user}
                        maxLength={2000}
                    />
                    <small className="text-muted">{newMessage.length}/2000 characters remaining</small>
                    <br/>
                    <button className="btn btn-primary mt-2" onClick={sendMessage} disabled={!user}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
