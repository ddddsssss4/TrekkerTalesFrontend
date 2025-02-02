import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Previous functions remain the same until sendAudioToServer
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);

        setAudioBlob(audioBlob);
        setAudioURL(audioURL);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Failed to access microphone. Please check your permissions.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };


  async function convertTo16000HzMono(blob) {
    const audioContext = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
    // Resample to 16,000 Hz
    const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();
  
    const resampledBuffer = await offlineContext.startRendering();
  
    // Encode to WAV
    return encodeWAV(resampledBuffer);
  }
  
  
  function encodeWAV(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels; // Number of channels (should be 1 for mono)
    const sampleRate = 16000; // Target sample rate (16,000 Hz)
  
    // Calculate buffer size: 44 bytes for WAV header + audio data (2 bytes per sample)
    const length = audioBuffer.length * numChannels * 2 + 44; 
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
  
    // Helper function to write strings
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
  
    // WAV header
    let offset = 0;
    writeString(view, offset, "RIFF"); // ChunkID
    offset += 4;
    view.setUint32(offset, 36 + audioBuffer.length * numChannels * 2, true); // ChunkSize
    offset += 4;
    writeString(view, offset, "WAVE"); // Format
    offset += 4;
    writeString(view, offset, "fmt "); // Subchunk1ID
    offset += 4;
    view.setUint32(offset, 16, true); // Subchunk1Size (16 for PCM)
    offset += 4;
    view.setUint16(offset, 1, true); // AudioFormat (1 for PCM)
    offset += 2;
    view.setUint16(offset, numChannels, true); // NumChannels
    offset += 2;
    view.setUint32(offset, sampleRate, true); // SampleRate
    offset += 4;
    view.setUint32(offset, sampleRate * numChannels * 2, true); // ByteRate
    offset += 4;
    view.setUint16(offset, numChannels * 2, true); // BlockAlign
    offset += 2;
    view.setUint16(offset, 16, true); // BitsPerSample
    offset += 2;
    writeString(view, offset, "data"); // Subchunk2ID
    offset += 4;
    view.setUint32(offset, audioBuffer.length * numChannels * 2, true); // Subchunk2Size
    offset += 4;
  
    // Write PCM data
    const channelData = audioBuffer.getChannelData(0); // Mono (1 channel)
    for (let i = 0; i < channelData.length; i++, offset += 2) {
      // Scale the audio sample to 16-bit PCM range and write to DataView
      const sample = Math.max(-1, Math.min(1, channelData[i])); // Clamp between -1 and 1
      view.setInt16(offset, sample * 0x7fff, true); // Convert to 16-bit PCM
    }
  
    // Return the WAV Blob
    return new Blob([buffer], { type: "audio/wav" });
  }
  

  const sendAudioToServer = async () => {
    if (!audioBlob) {
      setError("No audio recorded!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const processedBlob = await convertTo16000HzMono(audioBlob);
      const formData = new FormData();
      formData.append("audio", processedBlob, "recording.wav");
      formData.append("text", textInput);

      const response = await fetch("http://localhost:3000/analyze-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      setAssessmentResult(result); // Set the assessment result state
    } catch (error) {
      console.error("Error sending audio to server:", error);
      setError("Failed to analyze audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Keep the convertTo16000HzMono and encodeWAV functions the same

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Audio Recorder</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <textarea
          placeholder="Enter what you want to say..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded-lg mb-6 resize-none focus:outline-none focus:ring focus:ring-blue-300"
        />

        <div className="space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Start Recording
            </button>
          ) : (
            <>
              <button
                onClick={pauseRecording}
                disabled={isPaused}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  isPaused
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
              >
                Pause
              </button>
              <button
                onClick={resumeRecording}
                disabled={!isPaused}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  !isPaused
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Resume
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition"
              >
                Stop Recording
              </button>
            </>
          )}
        </div>

        {audioURL && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Preview:</h3>
            <audio src={audioURL} controls className="mt-3 w-full" />
            <button
              onClick={sendAudioToServer}
              disabled={isLoading}
              className={`mt-4 px-6 py-3 rounded-lg font-medium transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isLoading ? "Analyzing..." : "Send to Server"}
            </button>
          </div>
        )}

        {assessmentResult && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Assessment Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessmentResult.result.slice(3, 8).map((score, index) => {
                const [label, value] = score.split(": ");
                return (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-blue-600">{value}</p>
                  </div>
                );
              })}
            </div>
            
            {assessmentResult.result.length > 8 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Word-Level Details:</h4>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <ul className="space-y-2">
                    {assessmentResult.result.slice(8).map((word, idx) => (
                      <li key={idx} className="text-sm text-gray-600 border-b border-gray-100 py-2">
                        {word}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;