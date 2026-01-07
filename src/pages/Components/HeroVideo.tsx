import React from "react";

const HeroVideo = () => {
  return (
    <section className="company-video-section">
      <style>
        {`.company-video-section {
  background: #0f0b1e;
  padding: 100px 20px;
  display: flex;
  justify-content: center;
}

/* Center container */
.video-container {
  width: 100%;
  max-width: 1200px;
}

/* Responsive video */
.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 ratio */
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
}

/* iframe full fit */
.video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Mobile spacing */
@media (max-width: 768px) {
  .company-video-section {
    padding: 70px 15px;
  }

  .video-wrapper {
    border-radius: 14px;
  }
}
`}
      </style>
      <div className="video-container">
        <div
          className="video-wrapper"
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <iframe
            src="https://www.youtube.com/embed/P_ifqxH3d_4?si=QBOWio59Dc5Pl5nx"
            title="Cybite Services"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
