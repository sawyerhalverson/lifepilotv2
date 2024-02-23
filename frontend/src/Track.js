import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function Track() {
    const [activity, setActivity] = useState("");
    const [customActivity, setCustomActivity] = useState("");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [predefinedActivities, setPredefinedActivities] = useState([]);
    const [predefinedCategories, setPredefinedCategories] = useState([]);

    useEffect(() => {
        // Fetch predefined activities from the server
        axios.get('http://localhost:8081/activities')
            .then(res => setPredefinedActivities(res.data))
            .catch(err => console.error("Error fetching activities:", err));

        // Fetch predefined categories from the server
        axios.get('http://localhost:8081/categories')
            .then(res => setPredefinedCategories(res.data))
            .catch(err => console.error("Error fetching categories:", err));

        // Fetch most recent end_time from the server
        axios.get('http://localhost:8081/most-recent-end-time')
            .then(res => {
                const mostRecentEndTime = res.data.mostRecentEndTime; // Adjust based on actual response structure
                const formattedStartTime = mostRecentEndTime.slice(0, -8); // Remove milliseconds and timezone

                setStartTime(formattedStartTime);
            })
            .catch(err => console.error("Error fetching most recent end time:", err));
    }, []);


    
    const handleActivityChange = (event) => {
        const selectedActivity = event.target.value;
        setActivity(selectedActivity);

        if (selectedActivity === "custom") {
            setCustomActivity("");
        }
    };

    const handleCustomActivityChange = (event) => {
        setCustomActivity(event.target.value);
    };

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        setCategory(selectedCategory);

        if (selectedCategory === "custom") {
            setCustomCategory("");
        }
    };

    const handleCustomCategoryChange = (event) => {
        setCustomCategory(event.target.value);
    };

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
    
        if (!endTime || (!activity && !customActivity) || (!category && !customCategory)) {
            alert("Please fill in all required fields (end time, activity, and category).");
            return;
        }
    
        const selectedCategoryValue = category === "custom" ? customCategory : category;
        const selectedActivityValue = activity === "custom" ? customActivity : activity;
    
        const convertToISOString = (dateString) => {
            if (!dateString) return null;
            const date = new Date(dateString);
            const isoString = date.toISOString();
            return isoString.slice(0, 16); // Keep only the first 16 characters (yyyy-MM-ddThh:mm)
        };
        
    
        const formData = {
            start_time: convertToISOString(startTime),
            end_time: convertToISOString(endTime),
            description: selectedActivityValue,
            category: selectedCategoryValue,
        };
    
        axios.post('http://localhost:8081/track', JSON.stringify(formData), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            console.log(res.data);
            setActivity("");
            setCustomActivity("");
            setCategory("");
            setCustomCategory("");
            setEndTime(""); // Clear endTime as it has been submitted
        })
        .catch(err => {
            console.error("Error:", err);
        })
        .finally(() => {
            // Fetch most recent end_time again
            axios.get('http://localhost:8081/most-recent-end-time')
                .then(res => {
                    const mostRecentEndTime = res.data.mostRecentEndTime; // Adjust based on actual response structure
                    const formattedStartTime = mostRecentEndTime.slice(0, -8); // Remove milliseconds and timezone
    
                    setStartTime(formattedStartTime);
                })
                .catch(err => console.error("Error fetching most recent end time:", err));
        });
    };
    
    
    
    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>

            <div className='w-50 bg-white rounded p-4'>
            <Link to="/">Back to Home</Link>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="activity">Activity</label>
                        <select id="activity" value={activity} onChange={handleActivityChange} className="form-control">
                            <option value="">Select or enter an activity</option>
                            {predefinedActivities.map((activity, index) => (
                                <option key={index} value={activity}>{activity}</option>
                            ))}
                            <option value="custom">Enter a new activity</option>
                        </select>

                        {activity === "custom" && (
                            <div>
                                <label htmlFor="customActivity">Enter a new activity</label>
                                <input type="text" id="customActivity" value={customActivity} onChange={handleCustomActivityChange} className="form-control" />
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="category">Category</label>
                        <select id="category" value={category} onChange={handleCategoryChange} className="form-control">
                            <option value="">Select or enter a category</option>
                            {predefinedCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                            <option value="custom">Enter a new category</option>
                        </select>

                        {category === "custom" && (
                            <div>
                                <label htmlFor="customCategory">Enter a new category</label>
                                <input type="text" id="customCategory" value={customCategory} onChange={handleCustomCategoryChange} className="form-control" />
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="startTime">When did you start that activity?</label>
                        <input type="datetime-local" id="startTime" value={startTime} onChange={handleStartTimeChange} className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="endTime">When did you finish that activity?</label>
                        <input type="datetime-local" id="endTime" value={endTime} onChange={handleEndTimeChange} className="form-control" />
                    </div>

                    <button type="submit" className='btn btn-primary'>Track</button>
                </form>
            </div>
        </div>
    );
}

export default Track;
