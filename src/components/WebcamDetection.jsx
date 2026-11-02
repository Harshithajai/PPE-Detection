import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import AlertSystem from '../utils/AlertSystem';

const WebcamDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [ws, setWs] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isCompliant, setIsCompliant] = useState(true);
  const [missingPPE, setMissingPPE] = useState([]);
  const [selectedModel, setSelectedModel] = useState('yolov8');
  const [isConnected, setIsConnected] = useState(false);
  const alertSystem = useRef(new AlertSystem());

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/detect');
    socket.onopen = () => {
      setWs(socket);
      setIsConnected(true);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetections(data.detections || []);
      setIsCompliant(data.is_compliant);
      setMissingPPE(data.missing_ppe || []);
      if (!data.is_compliant && data.missing_ppe.length > 0) {
        alertSystem.current.triggerAlert(data.missing_ppe);
      }
    };
    socket.onerror = () => setIsConnected(false);
    socket.onclose = () => setIsConnected(false);
    return () => { if (socket) socket.close(); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && ws && ws.readyState === WebSocket.OPEN) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          ws.send(JSON.stringify({
            frame: imageSrc,
            model: selectedModel
          }));
        }
      }
    }, 33);
    return () => clearInterval(interval);
  }, [ws, selectedModel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.bbox;
      const color = isCompliant ? '#10B981' : '#EF4444';
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      const label = `${det.class_name} ${(det.confidence * 100).toFixed(1)}%`;
      ctx.font = 'bold 18px Arial';
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = color;
      ctx.fillRect(x1, y1 - 30, textWidth + 10, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, x1 + 5, y1 - 8);
    });
  }, [detections, isCompliant]);

  return (
    <div className="relative">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full rounded-lg"
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: 'user'
        }}
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
      {/* Model selection (Only for supported models) */}
      <div className="absolute left-4 top-4 space-x-2 z-50">
        {['yolov8', 'faster_rcnn'].map((model) => (
          <button
            key={model}
            onClick={() => setSelectedModel(model)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedModel === model
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {model === 'faster_rcnn' ? 'Faster R-CNN' : model.toUpperCase()}
          </button>
        ))}
      </div>
      {!isCompliant && missingPPE.length > 0 && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          <p className="font-bold text-lg">⚠️ PPE Violation!</p>
          <p className="text-sm mt-1">Missing: {missingPPE.join(', ')}</p>
        </div>
      )}
      {isCompliant && detections.length > 0 && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="font-bold text-lg">✓ Compliant</p>
          <p className="text-sm mt-1">All PPE detected</p>
        </div>
      )}
    </div>
  );
};

export default WebcamDetection;
