import '../styles/Loader.scss';
import { Triangle } from 'react-loader-spinner';

const Loader = (props: { color?: string }) => {
  return (
    <div className="loader-container">
      <Triangle
        visible={true}
        height="80"
        width="80"
        color={props.color || '#fac978'}
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};
export default Loader;
