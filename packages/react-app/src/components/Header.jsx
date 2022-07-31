import React from "react";
import MovingComponent from "react-moving-text";

// displays a page header

export default function Header({ ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      <div style={{ display: "flex", flex: 1, alignItems: "start" }}>
        <img style={{ width: "66px", zIndex: "9" }} src="/logo.png" />
        <MovingComponent
          type="slideInFromRight"
          duration="1200ms"
          delay="0s"
          direction="normal"
          timing="ease-in"
          iteration="1"
          fillMode="none">
          <span style={{ fontSize: "21px", lineHeight: "66px", zIndex: "1", paddingLeft: "15px" }}>CryptoIn - SocialFi in a professional way</span>
        </MovingComponent>
      </div>
      {props.children}
    </div>
  );
}

