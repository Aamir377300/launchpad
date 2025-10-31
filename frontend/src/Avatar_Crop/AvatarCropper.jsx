import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import "./AvatarCropper.css";

const AvatarCropper = ({ onSave, onCancel, initialImage }) => {
  const editorRef = useRef(null);
  const [image, setImage] = useState(initialImage || null);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "avatar.png", { type: "image/png" });
          onSave(croppedFile);
        }
      });
    }
  };

  return (
    <div className="avatar-cropper-overlay">
      <div className="avatar-cropper-modal">
        <div className="avatar-cropper-header">
          <h3>Edit Profile Picture</h3>
          <button onClick={onCancel} className="close-btn"><FaTimes /></button>
        </div>
        <div className="avatar-cropper-body">
          {!image ? (
            <div className="upload-prompt">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="avatar-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="avatar-upload" className="upload-label">
                <FaPlus size={40} />
                <p>Click to select an image</p>
              </label>
            </div>
          ) : (
            <>
              <div className="editor-container">
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={250}
                  height={250}
                  border={50}
                  borderRadius={125}
                  color={[255, 255, 255, 0.7]}
                  scale={scale}
                  rotate={rotate}
                />
              </div>
              <div className="controls">
                <div className="control-group">
                  <label>Zoom</label>
                  <div className="slider-container">
                    <button onClick={() => setScale(Math.max(1, scale - 0.1))}><FaMinus /></button>
                    <input type="range" min="1" max="3" step="0.01" value={scale} onChange={e => setScale(parseFloat(e.target.value))} />
                    <button onClick={() => setScale(Math.min(3, scale + 0.1))}><FaPlus /></button>
                  </div>
                </div>
                <div className="control-group">
                  <label>Rotate</label>
                  <input type="range" min="0" max="360" step="1" value={rotate} onChange={e => setRotate(parseInt(e.target.value))} />
                  <span>{rotate}°</span>
                </div>
                <div className="change-image">
                  <input type="file" accept="image/*" onChange={handleFileChange} id="change-avatar" style={{ display: "none" }} />
                  <label htmlFor="change-avatar" className="change-image-btn">Change Image</label>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="avatar-cropper-footer">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn" disabled={!image}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropper;
