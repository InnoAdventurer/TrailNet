// frontend\src\Page\CreateEventPage\CreateEventPage.tsx

import React, { useState, useEffect } from 'react';
import './CreateEventPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from 'axios';

function CreateEventPage() {
  // State to manage form inputs
  const [activity, setActivity] = useState<string>('hiking');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [participants, setParticipants] = useState<string>('');
  const [loading, setLoading] = useState(false); // For managing the loading state
  const [error, setError] = useState(''); // For managing errors
  const [success, setSuccess] = useState(''); // For managing success messages

  // Function to round minutes to the next closest 15-minute interval
  const roundMinutes = (date: Date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    if (roundedMinutes === 60) {
      date.setHours(date.getHours() + 1);
      date.setMinutes(0);
    } else {
      date.setMinutes(roundedMinutes);
    }
    return date;
  };

  useEffect(() => {
    const now = new Date();
    const roundedNow = roundMinutes(now);
    const currentDate = roundedNow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const currentTime = roundedNow.toTimeString().substring(0, 5); // Format as HH:MM

    setDate(currentDate);
    setTime(currentTime);
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const eventDateTimeString = `${date}T${time}:00`;
    const eventDateTime = new Date(eventDateTimeString);

    // Get the current time from the server for comparison
    const response = await axios.get('/backend_api/api/time/current');
    const serverTime = new Date(response.data.currentTime);

    if (isNaN(eventDateTime.getTime())) {
      setError('Invalid event date or time.');
      setLoading(false);
      return;
    } else if (eventDateTime < serverTime) {
      setError('Event date and time must be in the future.');
      setLoading(false);
      return;
    }

    const eventDetails = {
      event_name: activity,
      description: `Event for ${activity}`,
      event_date: date, // Format the date as YYYY-MM-DD
      start_time: time,
      end_time: null, // If you have an end_time, you can set it here
      location: address,
      trail_id: null, // Assuming trail_id is optional; otherwise, set it accordingly
    };

    try {
      const response = await axios.post('/backend_api/api/events/create', eventDetails);

      if (response.status === 201) {
        setSuccess('Event Created Successfully!');
      } else {
        setError('Failed to create event.');
      }
    } catch (err: any) {
      setError('An error occurred while creating the event. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <label htmlFor="date">Which Date?</label>
          <input 
            type="date" 
            id="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">What Time?</label>
          <input 
            type="time" 
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            step="900" // 900 seconds = 15 minutes
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">What Address?</label>
          <input 
            type="text" 
            id="address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Enter the event address" 
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="participants">Who Can Join?</label>
          <div className="activity-options">
            <label>
              <input 
                type="radio" 
                value="all_users" 
                checked={participants === 'all_users'} 
                onChange={(e) => setParticipants(e.target.value)} 
              />
              All Users
            </label>
            <label>
              <input 
                type="radio" 
                value="followers" 
                checked={participants === 'followers'} 
                onChange={(e) => setParticipants(e.target.value)} 
              />
              Only Followers
            </label>
            <label>
              <input 
                type="radio" 
                value="only_me" 
                checked={participants === 'only_me'} 
                onChange={(e) => setParticipants(e.target.value)} 
              />
              Only Me
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default CreateEventPage;
