// Mic.jsx
import { useState, useRef } from "react";


function Mic({ setPrompt, getReply, setFromVoice }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleMicClick = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) =>
          chunksRef.current.push(event.data);

        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("audio", blob, "recording.webm");

          try {
            const res = await fetch("http://localhost:8080/api/voice-to-text", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            if (data.text) {
              setPrompt(data.text);
              setFromVoice(true);
              setTimeout(() => getReply(), 200);
            }
          } catch (err) {
            console.error("Voice API error:", err);
          }
        };

        mediaRecorderRef.current.start();
        setRecording(true);
      } catch (err) {
        console.error("Mic access denied:", err);
      }
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div id="submit-mic" onClick={handleMicClick}>
      <i className={`fa-solid ${recording ? "fa-stop" : "fa-microphone"}`}></i>
    </div>
  );
}

export default Mic;
