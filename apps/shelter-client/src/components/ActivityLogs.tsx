import '../styles/ActivityLogs.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getActivityLogsByLobbyId } from '../api/requests';
import { formatCreatedAt } from '../helpers';

interface IState {
  activityLogs: any;
}

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const app = useSelector((state: RootState) => state.app);
  const lobby = useSelector((state: RootState) => state.lobby);
  const activityLogsRef = useRef<HTMLDivElement>(null);

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState({
    activityLogs: [],
  });

  if (activityLogsRef.current) {
    activityLogsRef.current.scrollTop = activityLogsRef.current.scrollHeight;
  }

  useEffect(() => {
    handleGetActivityLogs();
  }, []);

  // FUNCTIONS
  const handleGetActivityLogs = async () => {
    const data =
      (await getActivityLogsByLobbyId(user.userId, lobby.lobbyKey)) || [];
    updateState({ activityLogs: data });
    return;
  };

  return (
    <div className="modal-info-wrapper">
      <div className="info-title">
        <h3>Activity Logs</h3>
      </div>
      <div className="activity-logs-wraper" ref={activityLogsRef}>
        {state.activityLogs.map((data: { payload: any; createdAt: string }) => {
          return (
            <div className="activity-logs-block">
              <p className="log">{formatCreatedAt(data.createdAt, true)}</p>
              <p>{data.payload.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityLogs;
