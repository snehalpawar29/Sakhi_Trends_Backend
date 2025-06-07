import React from "react";
import Layout from "../components/Layout/Layout";
import contactus from "../components/Assets/contactus.jpeg";
import { BiMailSend ,BiPhoneCall,BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout>
      <div className="row contactus">
        <div className="col-md-6">
          <img src={contactus} alt="contactus" style={{width:"100%"}}/>
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 ml-5 text-white text-center">CONTACT US</h1>
          <p className="text-justify ml-5 mt-2">
            any query and info about product feel free to call anytime we 24X7 available
          </p>
          <p className="mt-3  ml-5 ">
            <BiMailSend /> : www.help@spinningwheels.com
          </p>
          <p className="mt-3 ml-5 ">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3 ml-5 ">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
