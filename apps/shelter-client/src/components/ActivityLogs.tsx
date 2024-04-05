import '../styles/ActivityLogs.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface IState {}

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const app = useSelector((state: RootState) => state.app);

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState({});

  useEffect(() => {}, []);

  // FUNCTIONS
  // ...

  return (
    <div className="modal-info-wrapper">
      <div className="info-title">
        <h3>Activity Logs</h3>
      </div>
      <div className="activity-logs-wraper">halo</div>
    </div>
  );
};

export default ActivityLogs;
