import React from "react";
import { Helmet } from "react-helmet-async";

// This is mainly a utility component with no visual elements,
// but we can enhance the functionality while keeping it simple
const Title = ({
  title = "Chat App",
  description = "this is the Chat App called Kiksy",
  themeColor = "#15616D", // Using the blue from palette as default theme color
  favicon = "/favicon.ico", // In case we want to specify a custom favicon
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content={themeColor} />
      {/* Open Graph tags for better social media sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {/* Add favicon if provided */}
      {favicon && <link rel="icon" href={favicon} />}
      {/* Add animation-friendly viewport settings */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </Helmet>
  );
};

export default Title;