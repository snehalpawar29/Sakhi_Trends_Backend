import React from "react";
import Layout from "../components/Layout/Layout";
import aboutus from "../components/Assets/about.jpeg";
const About = () => {
  return (
    <Layout>
      <div className="row contactus">
        <div className="col-md-6">
          <img src={aboutus} alt="contactus" style={{ width: "100%" }} />
        </div>
        <div className="col-md-4">
          <p>Spinning Wheels is dedicated to fueling the passion for cycling by offering premium bicycles and accessories. With a commitment to quality and innovation, we strive to provide riders of all levels with the tools they need to thrive on two wheels. Our knowledgeable team is here to support cyclists in finding the perfect fit for their riding style and goals. At Spinning Wheels, we believe in fostering a vibrant cycling community through our products and events. Join us in the journey to explore the world one pedal stroke at a time.</p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
