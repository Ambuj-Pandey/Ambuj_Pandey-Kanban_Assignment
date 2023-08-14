import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './Board.css';

const Board = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]); 
  const [grouping, setGrouping] = useState(localStorage.getItem('grouping') || 'status');
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'priority');
  const [isDisplaying, setIsDisplaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://apimocha.com/quicksell/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const responseData = await response.json();
        
        setTickets(responseData.tickets || []);
        setUsers(responseData.users || []); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('sortBy', sortBy);
  }, [grouping, sortBy]);

  useEffect(() => {
    const handleOutsideClick = event => {
      if (!event.target.closest('.dropdown')) {
        setIsDisplaying(false);
      }
    };

    if (isDisplaying) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isDisplaying]);

  const renderGroupHeading = (groupValue, ticketCount) => {
    groupValue = groupValue.toString();
    let icon = null;
  
    if (grouping === 'status') {
      if (groupValue === 'Backlog') {
        icon = <i className="fa fa-file-code-o" style={{ fontSize: '15px',color: 'blue' }}></i>;
      } else if (groupValue === 'In progress') {
        icon = <i className="fa fa-clock-o" style={{ fontSize: '15px' }}></i>;
      } else if (groupValue === 'Todo') {
        icon = <i className="fa fa-edit" style={{ fontSize: '15px',color: 'green' }}></i>;
      }
    } else if (grouping === 'priority') {
      if (groupValue === 'Urgent') {
        icon = <i className="fa fa-exclamation-triangle" style={{ fontSize: '15px', color: 'red' }}></i>;
      } else if (groupValue === 'High') {
        icon = <i className="fa fa-battery-full" style={{ fontSize: '15px', color: 'orange' }}></i>;
      } else if (groupValue === 'Medium') {
        icon = <i className="fa fa-battery-half" style={{ fontSize: '15px', color: 'blue' }}></i>;
      } else if (groupValue === 'Low') {
        icon = <i className="fa fa-battery-empty" style={{ fontSize: '15px', color: 'green' }}></i>;
      } else if (groupValue === 'No priority') {
        icon = <i className="fa fa-minus"></i>;
      }
    }
    return (
      <h2 className="group-heading">
        {icon && <span className="group-icon">{icon}</span>}
        {groupValue}
        <span className="group-ticket-count"> {ticketCount} </span>
      </h2>
    );
  };
  
  

  const priorityMapping = {
    4: 'Urgent',
    3: 'High',
    2: 'Medium',
    1: 'Low',
    0: 'No priority',
  };

  const priorityOrder = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];

  const handleGroupingChange = event => {
    setGrouping(event.target.value);
  };

  const handleSortByChange = event => {
    setSortBy(event.target.value);
  };

  const handleDisplayClick = () => {
    setIsDisplaying(!isDisplaying);
  };

  const groupedTickets = tickets.reduce((groups, ticket) => {
    const key = grouping === 'user' ? ticket.userId : ticket[grouping];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(ticket);
    return groups;
  }, {});

  const columns = Object.keys(groupedTickets)
    .sort((a, b) => {
      if (grouping === 'user') {
        return users.find(user => user.id === a)?.name.localeCompare(users.find(user => user.id === b)?.name);
      } else if (grouping === 'priority') {
        const aPriorityIndex = priorityOrder.indexOf(priorityMapping[a]);
        const bPriorityIndex = priorityOrder.indexOf(priorityMapping[b]);
        return aPriorityIndex - bPriorityIndex;
      } else {
        return a.localeCompare(b);
      }
    })
    .map(key => {
      const group = groupedTickets[key];
      const sortedGroup = group.sort((a, b) => {
        if (sortBy === 'priority') {
          const aPriorityIndex = priorityOrder.indexOf(priorityMapping[a.priority]);
          const bPriorityIndex = priorityOrder.indexOf(priorityMapping[b.priority]);
          return aPriorityIndex - bPriorityIndex;
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else {
          return 0;
        }
      });
      return (
        <div key={key} className="column">
          {renderGroupHeading(grouping === 'user'
           ? users.find(user => user.id === key)?.name
          : grouping === 'priority' ? priorityMapping[key] : key, group.length)}
          {sortedGroup.map(ticket => (
            <div key={ticket.id} className="ticket">
              <Card key={ticket.id} ticket={ticket} User={users.find(user => user.id === ticket.userId)?.name} />
            </div>
          ))}
        </div>
      );
    });

  return (
    <div className="App">
      <div className="dropdown">
        <button className="dropdown-btn" onClick={handleDisplayClick}>
          <i className="fa fa-sliders"></i>
            Display
          <i className="fa fa-sort-desc" id='icon'></i>
        </button>
        {isDisplaying && (
          <div className="dropdown-content">
            <div className="dropdown">
              <label htmlFor="grouping" className='group'>Grouping:<select id="grouping" onChange={handleGroupingChange} value={grouping}>
                <option value="status" >Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select></label>
              
            </div>
            <div className="dropdown">
              <label htmlFor="sortBy" className='sort'>Ordering:<select id="sortBy" onChange={handleSortByChange} value={sortBy}>
                <option value="priority">Priority</option>
                <option value="title"> Title</option>
              </select></label>
              
            </div>
          </div>
        )}
      </div>
      <div className="kanban-board">
        {columns}
      </div>
    </div>
  );
};

export default Board;