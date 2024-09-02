import React, { useState } from 'react';
import './CreateEventPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';

function CreateEventPage() {
  // State to manage form inputs
  const [activity, setActivity] = useState<string>('hiking');
  const [date, setDate] = useState<{ time: string; day: string; month: string; year: string }>({
    time: '00:00',
    day: '1',
    month: '1',
    year: '2024',
  });
  const [address, setAddress] = useState<string>('');
  const [participants, setParticipants] = useState<string>('');

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can handle the form submission, such as sending data to an API
    console.log({ activity, date, address, participants });
    alert('Event Created Successfully!');
  };

  return (
    <div className="createeventpage-container">
      <div className="back-button">
        <Link to="/eventpage"><IoIosArrowBack /></Link>
      </div>
      
      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="activity">What Activity?</label>
          <div className="activity-options">
            <label>
              <input 
                type="radio" 
                value="hiking" 
                checked={activity === 'hiking'} 
                onChange={(e) => setActivity(e.target.value)} 
              />
              Hiking
            </label>
            <label>
              <input 
                type="radio" 
                value="running" 
                checked={activity === 'running'} 
                onChange={(e) => setActivity(e.target.value)} 
              />
              Running
            </label>
            <label>
              <input 
                type="radio" 
                value="cycling" 
                checked={activity === 'cycling'} 
                onChange={(e) => setActivity(e.target.value)} 
              />
              Cycling
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Which Date?</label>
          <div className="date-selection">
            <select value={date.time} onChange={(e) => setDate({ ...date, time: e.target.value })}>
              <option value="00:00">00:00</option>
              <option value="06:00">06:00</option>
              <option value="12:00">12:00</option>
              <option value="18:00">18:00</option>
            </select>
            <select value={date.day} onChange={(e) => setDate({ ...date, day: e.target.value })}>
              {[...Array(31).keys()].map(day => (
                <option key={day + 1} value={day + 1}>{day + 1}</option>
              ))}
            </select>
            <select value={date.month} onChange={(e) => setDate({ ...date, month: e.target.value })}>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                <option key={index + 1} value={index + 1}>{month}</option>
              ))}
            </select>
            <select value={date.year} onChange={(e) => setDate({ ...date, year: e.target.value })}>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">What Address?</label>
          <input 
            type="text" 
            id="address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Enter the event address" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="participants">Who Can Join?</label>
          <input 
            type="text" 
            id="participants" 
            value={participants} 
            onChange={(e) => setParticipants(e.target.value)} 
            placeholder="Enter participant details" 
          />
        </div>

        <button type="submit" className="submit-button">Done</button>
      </form>
    </div>
  );
}

export default CreateEventPage;
