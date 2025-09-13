import { io } from "socket.io-client";
const socket = io("http://localhost:5000"); // Change to Render URL when hosted
export default socket;
