import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = (props) => (
  <ContentLoader
    speed={2}
    width="100%" // Adjusted width to 100%
    height={413}
    viewBox="100%" // Adjusted viewBox to maintain the aspect ratio
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="-6" y="0" rx="0" ry="0" width="100%" height="413" />
  </ContentLoader>
);

export default MyLoader;
{
  /* <ContentLoader
speed={2}
width={200}
height={413}
viewBox="0 0 200 413"
backgroundColor="#f3f3f3"
foregroundColor="#ecebeb"
{...props}
> */
}
