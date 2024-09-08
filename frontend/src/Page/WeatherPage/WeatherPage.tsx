import './WeatherPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';

function WeatherPage() {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date();
  const todayDate = today.getDate();
  
  // Generate dates for the week starting from Monday
  const getWeekDates = () => {
    // Clone today's date to avoid modifying the original `today` object
    const todayClone = new Date(today);
    
    // Calculate the start of the week (Monday)
    const dayIndex = todayClone.getDay(); // 0 for Sunday, 6 for Saturday
    const startOfWeek = new Date(todayClone);
    startOfWeek.setDate(todayClone.getDate() - (dayIndex === 0 ? 6 : dayIndex - 1)); // Adjust so Monday is the start
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      weekDates.push(currentDay.getDate());
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="weatherpage-container">
      <div className="header-container">
        <div className="back">
          <Link to="/homepage"><IoIosArrowBack /></Link>
        </div>
        <h2>Weather Conditions</h2>
      </div>

      <div className="week-table">
        <div className="week-days">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="day">
              {day}
            </div>
          ))}
        </div>
        <div className="week-dates">
          {weekDates.map((date, index) => (
            <div key={index} className={`date ${date === todayDate ? 'active' : ''}`}>
              {date}
            </div>
          ))}
        </div>
      </div>

      <div className="weather-container">
        <div>Weather API here</div>
      </div>
    </div>
  );
}

export default WeatherPage;
