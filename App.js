import React, { useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Profile() {
    return (
        <header className = "profile">
            <h1> Profile!!! </h1>
        </header>
    );
}

function Settings() {
    return (
        <header className = "settings">
            <h1> Settings!!! </h1>
        </header>
    );
}

//Display inventory page
function Inventory() {
    const { data } = useFetchInventory();

    return (
        <header className="inventory">
            <h1> Inventory!!! </h1>
            <div>
                {data.map((yarn, index) => (
                    <div key={index}>
                        <h3>{yarn["Yarn name"]}</h3>
                    </div>
                ))}
            </div>
        </header>
    )
}

function Patterns() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //Locate to specific pattern page when image is pressed
    const ImgClick = (row) => {
        navigate('/' + row["Project id"], { state: row });
    }

    //Fetches patterns to be displayed from backend
    useEffect(() => {
        fetch('http://localhost:5000/fetchpatterns')
            .then(res => {
                console.log("Response Status:", res.status);  // Check the status code
                return res.json();
            })
            .then(data => {
                console.log('Data received:', data);
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setLoading(false);
            });
    }, []);

    return (
        //Display the recommended patterns in a grid
        <header className="patterns">
            <h1> Patterns </h1>
            <div className="gallery">
            {data.map((row, index) => (
                <div key={index} className="galleryItem">
                    <img src={row.Photo} alt={row["Project name"]} onClick={() => ImgClick(row)} />
                    <div className="galleryCaption">{row["Project name"]}</div>
                </div>
            ))}
        </div>
        </header>
    );
}

function Pattern() {
    // Gets the passed row data
    const location = useLocation();
    const pattern = location.state;
    const { yarnData } = useFetchInventory();

    //If pattern cannot be retreived from data
    if (!pattern) return (
        <header className="patterns">
            <h1> {"Project not found"}</h1>
        </header>
    );

    //sort yarn data based on yarn type
    //sort based on yardage
    //Enough yarn better than the correct fibre type

    //Display pattern information
    return( 
        <header className="patterns">
            <h1> {pattern["Project name"]}</h1>
            <h3 style={{ fontSize: '24px' }}>{pattern['url']}</h3>
            <img className="patternImg" src={pattern.Photo} alt={pattern["Project name"]} />
            <div className="patternText">
                <p>
                    Difficulty: {pattern["Difficulty average"]} <br />
                    Yarn name: {pattern["Yarn name"]} <br />
                    Ply: {pattern["ply"]} <br />
                    Wpi: {pattern["wpi"]} <br />
                    Categories: {pattern["Categories"]}
                </p>
            </div>
            <div className="yarnContainer">
                <h3> Available Yarn:</h3>
                
            </div>
        </header>
    )
}

//Get yarn inventory
function useFetchInventory() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/fetchYarn')
            .then(res => {
                console.log("Response Status:", res.status);  // Check the status code
                return res.json();
            })
            .then(data => {
                console.log('Data received:', data);
                setData(data);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    }, []);

    return { data }
}

function Header() {
    const navigate = useNavigate();
    return (
        <>
            <header className="homepage">
                <h1> SmartStash </h1>
                <button className="settings-btn" onClick={() => navigate('/settings')}>Settings</button>
                <button className="profile-btn" onClick={() => navigate('/profile')}>Profile</button>
                <button className="patterns-btn" onClick={() => navigate('/patterns')}>Patterns</button>
                <button className="inv-btn" onClick={() => navigate('/inventory')}>Inventory</button>
            </header>
        </>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/:id" element={<Pattern />} />
            <Route path="/inventory" element={<Inventory /> }/>
        </Routes>
    );
}

export default App;
