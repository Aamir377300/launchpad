import React, { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaPlus,
  FaCamera,
  FaTimes,
  FaMinus,
} from "react-icons/fa";
import { MapPin } from "lucide-react";
import AvatarEditor from "react-avatar-editor";
import Navbar from "../components/Navbar";
import AvatarCropper from "../Avatar_Crop/AvatarCropper";

import "./Dashboard.css";

// Update your API URL setup as needed
const apiUrl = import.meta.env.VITE_API_URL;

const SKILL_OPTIONS = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "Python",
  "Java",
  "C++",
  "UI/UX",
  "Figma",
  "Machine Learning",
  "SQL",
];

// Avatar Cropper Modal Component -- Can be moved to its own file!
// function AvatarCropper({ onSave, onCancel, initialImage }) {
//   const editorRef = React.useRef(null);
//   const [image, setImage] = useState(initialImage || null);
//   const [scale, setScale] = useState(1.2);
//   const [rotate, setRotate] = useState(0);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setImage(file);
//   };

//   const handleSave = () => {
//     if (editorRef.current) {
//       const canvas = editorRef.current.getImageScaledToCanvas();
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const croppedFile = new File([blob], "avatar.png", {
//             type: "image/png",
//           });
//           onSave(croppedFile);
//         }
//       });
//     }
//   };

//   return (
//     <div className="avatar-cropper-overlay">
//       <div className="avatar-cropper-modal">
//         <div className="avatar-cropper-header">
//           <h3>Edit Profile Picture</h3>
//           <button onClick={onCancel} className="close-btn">
//             <FaTimes />
//           </button>
//         </div>
//         <div className="avatar-cropper-body">
//           {!image ? (
//             <div className="upload-prompt">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 id="avatar-upload"
//                 style={{ display: "none" }}
//               />
//               <label htmlFor="avatar-upload" className="upload-label">
//                 <FaPlus size={36} />
//                 <p>Click to select an image</p>
//               </label>
//             </div>
//           ) : (
//             <>
//               <div className="editor-container">
//                 <AvatarEditor
//                   ref={editorRef}
//                   image={image}
//                   width={250}
//                   height={250}
//                   border={50}
//                   borderRadius={125}
//                   color={[255, 255, 255, 0.7]}
//                   scale={scale}
//                   rotate={rotate}
//                 />
//               </div>
//               <div className="controls">
//                 <div className="control-group">
//                   <label>Zoom</label>
//                   <div className="slider-container">
//                     <button onClick={() => setScale(Math.max(1, scale - 0.1))}>
//                       <FaMinus />
//                     </button>
//                     <input
//                       type="range"
//                       min="1"
//                       max="3"
//                       step="0.01"
//                       value={scale}
//                       onChange={(e) => setScale(parseFloat(e.target.value))}
//                     />
//                     <button onClick={() => setScale(Math.min(3, scale + 0.1))}>
//                       <FaPlus />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="control-group">
//                   <label>Rotate</label>
//                   <input
//                     type="range"
//                     min="0"
//                     max="360"
//                     step="1"
//                     value={rotate}
//                     onChange={(e) => setRotate(parseInt(e.target.value))}
//                   />
//                   <span>{rotate}°</span>
//                 </div>
//                 <div className="change-image">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     id="change-avatar"
//                     style={{ display: "none" }}
//                   />
//                   <label htmlFor="change-avatar" className="change-image-btn">
//                     Change Image
//                   </label>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//         <div className="avatar-cropper-footer">
//           <button onClick={onCancel} className="cancel-btn">
//             Cancel
//           </button>
//           <button onClick={handleSave} className="save-btn" disabled={!image}>
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({
    motivation: "",
    skills: [],
    careerGoals: "",
    dreamCompany: "",
    favoriteProject: "",
  });

  // Resume states
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  // Avatar cropper modal states
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${apiUrl}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({
          bio: data.bio || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          avatar: data.avatar || "",
          location: data.location || "",
        });
        if (
          !data.motivation ||
          !data.skills ||
          !data.careerGoals ||
          !data.dreamCompany ||
          !data.favoriteProject
        ) {
          setOnboarding(true);
          setOnboardingForm({
            motivation: data.motivation || "",
            skills: data.skills || [],
            careerGoals: data.careerGoals || "",
            dreamCompany: data.dreamCompany || "",
            favoriteProject: data.favoriteProject || "",
          });
        }
      });
  }, []);

  // Form Editing Handlers
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiUrl}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setProfile(data);
    setEdit(false);
    setLoading(false);
  };

  // Resume Upload Handler
  const handleSetResumeFile = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please select a PDF file");
      return;
    }
    if (resumeFile.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      await fetch(`${apiUrl}/api/profile/resume-file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // No content-type!
        body: formData,
      });
      const res = await fetch(`${apiUrl}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(await res.json());
      setResumeFile(null);
      setShowResumeForm(false);
      alert("Resume uploaded/updated successfully!");
    } catch (err) {
      alert("Failed to upload/update resume");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSave = async (croppedFile) => {
    setUploadingAvatar(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", croppedFile);
  
    try {
      const response = await fetch(`${apiUrl}/api/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
  
      // Read the body once and store it
      const bodyText = await response.text();
      let responseData;
  
      // Try to parse as JSON
      try {
        responseData = JSON.parse(bodyText);
      } catch (parseErr) {
        // If not JSON, use the raw text
        console.warn("Response is not JSON:", bodyText);
      }
  
      if (!response.ok) {
        const errorMessage = responseData?.error || bodyText || "Unknown server error";
        alert("Upload failed: " + errorMessage);
        return;
      }
  
      setProfile(responseData.user);
      setShowAvatarCropper(false);
      alert("Profile picture updated successfully!");
    } catch (err) {
      alert("Failed to upload profile picture: " + err.message);
      console.error("Avatar upload exception:", err);
    } finally {
      setUploadingAvatar(false);
    }
  };
  
  

  // Onboarding Handlers
  const handleOnboardingChange = (e) =>
    setOnboardingForm({ ...onboardingForm, [e.target.name]: e.target.value });

  const handleSkillToggle = (skill) => {
    setOnboardingForm((form) => ({
      ...form,
      skills: form.skills.includes(skill)
        ? form.skills.filter((s) => s !== skill)
        : [...form.skills, skill],
    }));
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiUrl}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(onboardingForm),
    });
    const data = await res.json();
    setProfile(data);
    setOnboarding(false);
    setLoading(false);
  };

  if (!profile) return <div className="dashboard-loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="dashboard-main-container">
        {/* Left Box */}
        <div className="dashboard-left-box">
          <h1 className="dashboard-title">Profile Details</h1>
          <div
            className="avatar-container"
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: 20,
            }}
          >
            <img
              src={
                profile.avatar?.url ||
                "https://randomuser.me/api/portraits/lego/1.jpg"
              }
              alt="Avatar"
              className="dashboard-avatar"
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                objectFit: "cover",
                border: "5px solid #e0eafc",
                background: "#f8fafc",
              }}
            />
            <button
              className="avatar-edit-btn"
              onClick={() => setShowAvatarCropper(true)}
              type="button"
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                background: "#007bff",
                border: "3px solid white",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                transition: "all 0.3s ease",
              }}
            >
              <FaCamera size={16} />
            </button>
          </div>

          <h2 className="dashboard-name">{profile.name}</h2>
          <p className="dashboard-email">{profile.email}</p>
          {profile.bio && (
            <div className="dashboard-bio-section">
              <p className="dashboard-bio">{profile.bio}</p>
            </div>
          )}
          <div className="dashboard-social-rects">
            {profile.github && (
              <a
                href={
                  profile.github.startsWith("http")
                    ? profile.github
                    : `https://${profile.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="rect-link"
              >
                <FaGithub size={22} />
                <span>{profile.github}</span>
              </a>
            )}
            {profile.linkedin && (
              <a
                href={
                  profile.linkedin.startsWith("http")
                    ? profile.linkedin
                    : `https://${profile.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="rect-link"
              >
                <FaLinkedin size={22} color="#0077b5" />
                <span>{profile.linkedin}</span>
              </a>
            )}
          </div>
          {profile.location && (
            <div className="dashboard-location-box">
              <MapPin
                size={18}
                style={{ marginRight: 6, verticalAlign: "middle" }}
              />
              <span>{profile.location}</span>
            </div>
          )}
          {edit ? (
            <form className="dashboard-form" onSubmit={handleSave}>
              <label>
                Avatar URL
                <input
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                />
              </label>
              <label>
                Bio / About
                <textarea name="bio" value={form.bio} onChange={handleChange} />
              </label>
              <label>
                GitHub
                <input
                  className="input-box"
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/yourname"
                />
              </label>
              <label>
                LinkedIn
                <input
                  className="input-box"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourname"
                />
              </label>
              <label>
                Location
                <input
                  className="input-box"
                  name="location"
                  value={form.location || ""}
                  onChange={handleChange}
                  placeholder="Your city, country"
                />
              </label>
              <button
                type="submit"
                className="dashboard-save-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          ) : (
            <button
              className="dashboard-edit-btn"
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
        {/* Right Box: Onboarding, Resume Only */}
        <div className="dashboard-right-box">
          {onboarding ? (
            <form className="onboarding-form" onSubmit={handleOnboardingSubmit}>
              <h2 className="Complete-Your-Profile">Complete Your Profile</h2>
              <label>
                What is your motivation?
                <textarea
                  name="motivation"
                  value={onboardingForm.motivation}
                  onChange={handleOnboardingChange}
                />
              </label>
              <label>
                What are your top skills?
                <div className="skills-chips">
                  {SKILL_OPTIONS.map((skill) => (
                    <span
                      key={skill}
                      className={`chip ${
                        onboardingForm.skills.includes(skill) ? "selected" : ""
                      }`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </label>
              <label>
                What are your career goals?
                <textarea
                  name="careerGoals"
                  value={onboardingForm.careerGoals}
                  onChange={handleOnboardingChange}
                />
              </label>
              <label>
                What is your dream company?
                <input
                  className="input-box"
                  name="dreamCompany"
                  value={onboardingForm.dreamCompany}
                  onChange={handleOnboardingChange}
                />
              </label>
              <label>
                What is your favorite project so far?
                <input
                  className="input-box"
                  name="favoriteProject"
                  value={onboardingForm.favoriteProject}
                  onChange={handleOnboardingChange}
                />
              </label>
              <button
                type="submit"
                className="dashboard-save-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          ) : (
            <div className="onboarding-summary">
              <h2>About You</h2>
              <p>
                <strong>Motivation:</strong> {profile.motivation}
              </p>
              <p>
                <strong>Skills:</strong> {(profile.skills || []).join(", ")}
              </p>
              <p>
                <strong>Career Goals:</strong> {profile.careerGoals}
              </p>
              <p>
                <strong>Dream Company:</strong> {profile.dreamCompany}
              </p>
              <p>
                <strong>Favorite Project:</strong> {profile.favoriteProject}
              </p>
            </div>
          )}
          {/* Resume Section */}
          <div style={{ marginTop: "2rem" }}>
            <h3>Resume</h3>
            {profile.resume ? (
              <>
                <a
                  href={profile.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dashboard-resume-link"
                  style={{
                    background: "#f8fafc",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    color: "#007bff",
                    fontWeight: 500,
                    display: "inline-block",
                    marginBottom: "0.7rem",
                  }}
                >
                  View Resume PDF
                </a>
                {!showResumeForm && (
                  <button
                    className="dashboard-add-btn"
                    onClick={() => setShowResumeForm(true)}
                    style={{
                      background: "#f8fafc",
                      border: "1.5px solid #e0eafc",
                      borderRadius: "8px",
                      padding: "0.6rem 1.2rem",
                      color: "#007bff",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.7rem",
                      cursor: "pointer",
                    }}
                  >
                    <FaPlus /> Update Resume
                  </button>
                )}
              </>
            ) : (
              !showResumeForm && (
                <button
                  className="dashboard-add-btn"
                  onClick={() => setShowResumeForm(true)}
                  style={{
                    background: "#f8fafc",
                    border: "1.5px solid #e0eafc",
                    borderRadius: "8px",
                    padding: "0.6rem 1.2rem",
                    color: "#007bff",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  <FaPlus /> Add Resume
                </button>
              )
            )}
            {showResumeForm && (
              <form
                onSubmit={handleSetResumeFile}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginTop: "0.7rem",
                }}
              >
                <input
                  className="input-box"
                  type="file"
                  accept="application/pdf"
                  style={{
                    borderRadius: 6,
                    border: "1.5px solid #e0eafc",
                    padding: "0.5rem",
                  }}
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  required
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="dashboard-save-btn"
                    type="submit"
                    style={{ padding: "0.5rem 1.2rem" }}
                    disabled={loading}
                  >
                    {loading
                      ? profile.resume
                        ? "Updating..."
                        : "Uploading..."
                      : profile.resume
                      ? "Update"
                      : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResumeForm(false);
                      setResumeFile(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#888",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {showAvatarCropper && (
        <AvatarCropper
          onSave={handleAvatarSave}
          onCancel={() => setShowAvatarCropper(false)}
        />
      )}
    </>
  );
}
