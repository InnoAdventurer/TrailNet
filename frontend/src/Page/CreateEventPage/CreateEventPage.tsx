// frontend\src\Page\CreateEventPage\CreateEventPage.tsx

import React, { useState, useEffect, useRef } from 'react';
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
  const [privacy, setPrivacy] = useState<string>('all_users'); // Privacy state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // For managing the loading state
  const [error, setError] = useState(''); // For managing errors
  const [success, setSuccess] = useState(''); // For managing success messages

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Fetch address suggestions
  const fetchSuggestions = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await axios.get('/backend_api/api/map/search', {
          params: { query }
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAddress(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear the previous timeout
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(query); // Fetch suggestions after 0.5s delay
    }, 500);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setAddress(suggestion.display_name); // Set the selected suggestion to the input
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setSuggestions([]); // Clear suggestions after selection
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Check if latitude and longitude are set
    if (latitude === null || longitude === null) {
      setError('Please select a valid address from the suggestions.');
      setLoading(false);
      return;
    }
    
    const eventDateTimeString = `${date}T${time}:00`;
    const eventDateTime = new Date(eventDateTimeString);

    // Calculate end time as 4 hours later
    const endDateTime = new Date(eventDateTime);
    endDateTime.setHours(eventDateTime.getHours() + 4);

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
      end_time: endDateTime.toTimeString().substring(0, 5), // Format as HH:MM
      location: address,
      latitude: latitude,
      longitude: longitude,
      privacy: privacy,
      trail_id: null, // Assuming trail_id is optional; otherwise, set it accordingly
    };

    try {
      const createResponse = await axios.post('/backend_api/api/events/create', eventDetails);

      if (createResponse.status === 201) {
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
            onChange={handleSearchChange} 
            placeholder="Enter the event address" 
            required
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="privacy">Who Can Join?</label>
          <div className="activity-options">
            <label>
              <input 
                type="radio" 
                value="all_users" 
                checked={privacy === 'all_users'} 
                onChange={(e) => setPrivacy(e.target.value)} 
              />
              All Users
            </label>
            <label>
              <input 
                type="radio" 
                value="followers" 
                checked={privacy === 'followers'} 
                onChange={(e) => setPrivacy(e.target.value)} 
              />
              Only Followers
            </label>
            <label>
              <input 
                type="radio" 
                value="only_me" 
                checked={privacy === 'only_me'} 
                onChange={(e) => setPrivacy(e.target.value)} 
              />
              Only Me
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating...' : 'Done'}
        </button>
      </form>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default CreateEventPage;
