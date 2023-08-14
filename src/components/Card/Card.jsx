import React from 'react';
import './Card.css';

const statusIcons = {
  "Backlog": <i className="fa fa-file-code-o" style={{ color: 'blue' }}></i>,
  "In progress": <i className="fa fa-clock-o"></i>,
  "Todo": <i className="fa fa-edit" style={{ color: 'green' }}></i>
};

const priorityIcons = {
  4: <i className="fa fa-exclamation-triangle" style={{ color: 'red' }}></i>,
  3: <i className="fa fa-battery-full" style={{ color: 'orange' }}></i>,
  2: <i className="fa fa-battery-half" style={{ color: 'blue' }}></i>,
  1: <i className="fa fa-battery-empty" style={{ color: 'green' }}></i>,
  0: <i className="fa fa-minus"></i>
};

const Card = ({ ticket }) => {
  const priorityIcon = priorityIcons[ticket.priority];
  const statusIcon = statusIcons[ticket.status];

  return (
    <div className="card">
      <div className="ticket-id">{ticket.id}</div>
      <div className="ticket-status-title">
        <span className="ticket-status">{statusIcon}</span>
        <h4 className="ticket-title">{ticket.title}</h4>
      </div>
      <div className="ticket-priority-tag">
        <span className="priority-icon">{priorityIcon}</span>
        <span className="ticket-tag">{ticket.tag}</span>
      </div>
    </div>
  );
};

export default Card;
