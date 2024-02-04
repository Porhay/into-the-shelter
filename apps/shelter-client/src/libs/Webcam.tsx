import Webcam from "react-webcam";

const CustomWebcam = () => {
  return (
    <div className="container">
      <Webcam height={200} mirrored={true} />
    </div>
  );
};

export default CustomWebcam;