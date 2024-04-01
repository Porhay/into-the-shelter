import React from 'react';
import '../styles/Timeline.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const Timeline = () => {
  const app = useSelector((state: RootState) => state.app);
  const lobby = useSelector((state: RootState) => state.lobby);

  const isVisible = app.showTimeline ? 'timeline' : 'timeline invisible';

  let stages = lobby.stages || [];
  if (stages.length === 0) {
    stages = [
      { title: 'Open', isActive: false },
      { title: 'Kick', isActive: false },
      { title: 'Open', isActive: false },
      { title: 'Kick', isActive: false },
    ];
  }

  return (
    <div className={isVisible}>
      {stages.map((stage: any, index: number) => (
        <React.Fragment key={index}>
          <div className="timeline-dot">
            <div
              className={`timeline-dot-text ${stage.isActive ? 'active' : ''}`}
            >
              {' '}
              {stage.title}
            </div>
          </div>
          {index < stages.length - 1 && <div className="timeline-line" />}
        </React.Fragment>
      ))}
    </div>
  );
};
