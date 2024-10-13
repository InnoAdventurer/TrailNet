// frontend/src/Page/CreateEventPage/CreateEventPage.tsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import './CreateEventPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ErrorContext } from '../../contexts/ErrorContext'; // Import ErrorContext

const apiUrl = process.env.VITE_BACKEND_URL;

function CreateEventPage() {
  const { error, setError } = useContext(ErrorContext); // Use both error and setError from context
  const navigate = useNavigate(); // Initialize navigate from react-router-dom

  // State to manage form inputs
  const [activity, setActivity] = useState<string>('Hiking');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [privacy, setPrivacy] = useState<string>('all_users'); // Privacy state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // For managing the loading state
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
        const response = await axios.get(`${apiUrl}/api/map/search`, {
          params: { query }
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Error fetching suggestions. Please try again.');
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAddress(query);
    setLatitude(null);
    setLongitude(null);

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

  const handleActivityChange = (activityOption: string) => {
    setActivity(activityOption);
  };

  const handlePrivacyChange = (privacyOption: string) => {
    setPrivacy(privacyOption);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);  // Reset error state before submitting
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

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token found');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const eventDetails = {
        event_name: activity,
        description: `Event for ${activity}`,
        event_date: date,
        start_time: time,
        end_time: endDateTime.toTimeString().substring(0, 5),
        location: address,
        latitude,
        longitude,
        privacy,
        activity_type: activity,
        trail_id: null,
      };

      const createResponse = await axios.post(`${apiUrl}/api/events/create`, eventDetails, config);

      if (createResponse.status === 201) {
        const eventId = createResponse.data.event_id;
        setSuccess('Event Created Successfully! Redirecting...');

        setTimeout(() => {
          navigate(`/joineventpage3/${eventId}`);
        }, 3000); // 3-second delay before redirect
      } else {
        setError('Failed to create event.');
      }
    } catch (err) {
      console.error('Error creating event:', err);
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
          <div className="options">
            {['Hiking', 'Jogging', 'Cycling'].map(option => (
              <button
                key={option}
                type="button"
                className={`option-button ${activity === option ? 'selected' : ''}`}
                onClick={() => handleActivityChange(option)}
              >
                {option}
              </button>
            ))}
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
          <div className="options">
            {['all_users', 'followers', 'only_me'].map(option => (
              <button
                key={option}
                type="button"
                className={`option-button ${privacy === option ? 'selected' : ''}`}
                onClick={() => handlePrivacyChange(option)}
              >
                {option === 'all_users' ? 'All Users' : option === 'followers' ? 'Only Followers' : 'Only Me'}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>

        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
}

export default CreateEventPage;
