import Webcam from "react-webcam";

const CustomWebcam = (props: any) => {
  const videoConstraints = {
    width: 260,
    height: 200,
  };

  return (
    <div className="container">
      <Webcam 
        mirrored={true}
        height={props.height || 200}
        width={props.width || 260}
        videoConstraints={props.videoConstraints || videoConstraints}
      />
    </div>
  );
};

export default CustomWebcam;