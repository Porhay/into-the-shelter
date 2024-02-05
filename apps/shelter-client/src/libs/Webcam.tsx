import Webcam from "react-webcam";

const CustomWebcam = () => {
  const videoConstraints = {
    width: 260,
    height: 200,
  };

  return (
    <div className="container">
      <Webcam mirrored={true} height={200} width={260} videoConstraints={videoConstraints} />
    </div>
  );
};

export default CustomWebcam;