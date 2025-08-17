import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function About() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const IMAGE_URL =
    queryParams.get("image_url") ||
    "https://arcrobot.ru/public/images/photo_2025-08-10_16-39-35.jpg";

  const imgRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    catalog_id: 5,
    title: "",
    description: "",
    top: 0,
    left_pos: 0,
    image: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [activePoint, setActivePoint] = useState(null);

  const fetchPoints = async () => {
    try {
      const { data } = await axios.get(
        `https://arcrobot.ru/api/image-position/${encodeURIComponent(
          IMAGE_URL
        )}`
      );
      setPoints(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const handleImgClick = (e) => {
    if (!isAddMode) return;
    const rect = imgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const percentLeft = (clickX / rect.width) * 100;
    const percentTop = (clickY / rect.height) * 100;

    setFormData({
      ...formData,
      top: percentTop.toFixed(2),
      left_pos: percentLeft.toFixed(2),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("catalog_id", formData.catalog_id);
    data.append("image_url", IMAGE_URL);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("top", formData.top);
    data.append("left_pos", formData.left_pos);
    data.append("image", formData.image);

    try {
      await axios.post("https://arcrobot.ru/api/image-position/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setFormData({ ...formData, title: "", description: "", image: null });
      fetchPoints();
      setIsAddMode(false);
    } catch (err) {
      console.error(err.message);
      alert("Ошибка при сохранении!");
    }
  };

  return (
    <>
      <style>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: "Comic Sans MS", cursive, sans-serif;
        }
        .mode-button {
          padding: 10px 24px;
          background: linear-gradient(135deg, #ff6b6b, #ffd93d);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
          margin-bottom: 25px;
        }
        .mode-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .mode-button.add {
          background: linear-gradient(45deg, #1fa2ff, #12d8fa, #a6ffcb);
        }
        .image-wrapper {
          position: relative;
          display: inline-block;
        }
        .main-image {
          width: 700px;
          border-radius: 18px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .main-image.crosshair {
          cursor: crosshair;
        }
        .point {
          position: absolute;
          transform: translate(-50%, -50%);
          background: #ff6b6b;
          color: white;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.15s;
        }
        .point:hover {
          transform: translate(-50%, -50%) scale(1.2);
        }
        .preview {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: #1fa2ff;
          border-radius: 50%;
          box-shadow: 0 0 0 8px rgba(31, 162, 255, 0.4);
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.3); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .form {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 340px;
        }
        .form input,
        .form textarea {
          padding: 10px;
          border-radius: 12px;
          border: 2px solid #ffd93d;
          font-size: 15px;
        }
        .save {
          padding: 12px;
          background: linear-gradient(45deg, #12d8fa, #a6ffcb);
          border: none;
          border-radius: 20px;
          color: #333;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
        .save:hover {
          background: linear-gradient(45deg, #a6ffcb, #12d8fa);
        }
        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal {
          background: white;
          padding: 25px 30px;
          border-radius: 16px;
          max-width: 400px;
          width: 88%;
        }
        .modal h3 { margin-top: 0; }
      `}</style>

      <div className="container pt-32">
        <button
          onClick={() => setIsAddMode(!isAddMode)}
          className={`mode-button ${isAddMode ? "add" : ""}`}
        >
          {isAddMode ? "Режим просмотра" : "Добавить точку"}
        </button>

        <div className="image-wrapper">
          <img
            ref={imgRef}
            src={IMAGE_URL}
            alt="Hotspot"
            onClick={handleImgClick}
            className={`main-image ${isAddMode ? "crosshair" : ""}`}
          />
          {points.map((p, i) => (
            <div
              key={p.id}
              onClick={() => {
                if (!isAddMode) {
                  setActivePoint(p);
                  setShowModal(true);
                }
              }}
              className="point"
              style={{
                top: `${p.top}%`,
                left: `${p.left_pos}%`,
                cursor: isAddMode ? "not-allowed" : "pointer",
              }}
            >
              {i + 1}
            </div>
          ))}
          {isAddMode && (
            <div
              className="preview"
              style={{
                top: `${formData.top}%`,
                left: `${formData.left_pos}%`,
              }}
            />
          )}
        </div>

        {isAddMode && (
          <form onSubmit={handleSubmit} className="form">
            <input
              value={formData.title}
              placeholder="Название"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />
            <button type="submit" className="save">
              Сохранить
            </button>
          </form>
        )}

        {showModal && (
          <div className="backdrop" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "black" }}>{activePoint?.title}</h3>
              <p style={{ color: "black" }}>{activePoint?.description}</p>
              {activePoint?.image && (
                <img
                  src={activePoint.image}
                  alt=""
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default About;
