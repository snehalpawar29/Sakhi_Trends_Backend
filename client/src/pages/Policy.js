import React from "react";
import Layout from "../components/Layout/Layout";
import contactus from "../components/Assets/contactus.jpeg";
const Policy = () => {
  return (
    <Layout>
       <div className="row contactus">
        <div className="col-md-6">
          <img src={contactus} alt="contactus" style={{width:"100%"}}/>
        </div>
        <div className="col-md-4">
          <p>
          "At Spinning Wheels, we prioritize the privacy and security of our customers' information. We collect only necessary personal data for order processing and customer service purposes. Your information is stored securely and never shared with third parties without your consent. We use industry-standard encryption and security measures to safeguard your data. By using our services, you agree to our privacy policy and understand your rights regarding your personal information."
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
