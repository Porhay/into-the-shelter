import React from "react";
import '../styles/Timeline.scss'

export const Timeline = ({ stages, visible }: any) => {
    const isVisible = visible ? "timeline" : "timeline invisible"
    return (
      <div className={isVisible}>
        {stages.map((stage: any, index: number) => (
          <React.Fragment key={index}>
            <div className="timeline-dot" />
            {index < stages.length - 1 && <div className="timeline-line" />}
          </React.Fragment>
        ))}
      </div>
    );
  };