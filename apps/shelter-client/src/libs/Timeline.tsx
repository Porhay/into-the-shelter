import React from "react";
import '../styles/Timeline.scss'

export const Timeline = ({ stages }: any) => {
    return (
      <div className="timeline">
        {stages.map((stage: any, index: number) => (
          <React.Fragment key={index}>
            <div className="timeline-dot" />
            {index < stages.length - 1 && <div className="timeline-line" />}
          </React.Fragment>
        ))}
      </div>
    );
  };