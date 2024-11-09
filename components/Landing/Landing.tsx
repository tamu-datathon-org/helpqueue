import React from "react";
// import Image from "next/image";
import CSS from "csstype";
import {signIn} from "next-auth/react";

const backgroundProps: CSS.Properties = {
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover"
};

const questionBearProps: CSS.Properties = {
    backgroundImage: "url(../images/landing_img.svg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "500px",
    height: "250px",
};

const center: CSS.Properties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

export default function Landing() {
  return (<div className="md:items-center h-screen flex justify-center" style={backgroundProps}>
    <div className="welcomem mt-48 md:mt-0">
    <div style={center}><div style={questionBearProps}></div></div>
      <p className="text-center relative bottom-[20px] font-bold text-4xl sm:text-[65px] pb-6">
        Welcome to Datathon&apos;s Help Queue!
      </p>
      <p className="text-center font-medium pb-8 text-lg sm:text-2xl">
        Your go-to destination for assistance and inquiries.
      </p>
      <div className="flex relative justify-center items-center top-[10px]">
        <a onClick={(e) => {
          e.preventDefault()
          signIn("google")}}
          className="py-4 px-8 bg-blue-500 text-white font-bold rounded-xl shadow-xl cursor-pointer">
          Log in with Google
        </a>
      </div>
    </div>
  </div>);
}
