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
    const { data } = useFetch('fetchyarn');

    const navigate = useNavigate();
    const AddYarn = () => {
        navigate('/addyarn');
    }

    return (
        <header className="inventory">
            <h1> Inventory </h1>
            <button className="add-btn" onClick={() => AddYarn()}>Add Yarn</button>

            <div>
                {data.map((yarn, index) => (
                    <div key={index} className="patternText">
                        <p>
                            Name: {yarn['Yarn name']} <br />
                            Total yardage: {yarn["Total yardage"]} <br />
                            Ply: {yarn["ply"]} <br />
                            Wpi: {yarn["wpi"]} <br />
                        </p>
                    </div>
                ))}
            </div>
        </header>
    )
}

function AddYarn() {
    return (
        <header className="inventory">
            <h1> Add Yarn </h1>
            <form className = "form">
                <label> Name:   
                    <input type="text" />
                </label><br />
                <label> Total yardage:
                    <input type="number" />
                </label><br />
                <label> Ply:
                    <input type="number" />
                </label><br />
                <label> Wpi:
                    <input type="number" />
                </label>
                <input type="submit" />
            </form>
        </header>
    );
}

function Saved() {
    const { data } = useFetch('fetchsaved');
    return (
        <header className="inventory">
            <h1> Saved </h1>
            <div className="gallery">
                {data.map((pattern, index) => (
                    <div key={index} className="galleryItem">
                        <img src={pattern.Photo} alt={pattern["Project name"]} />
                        <div className="galleryCaption">{pattern["Project name"]}</div>
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

// Single pattern data display
function Pattern() {
    // Gets the passed row data
    const location = useLocation();
    const pattern = location.state;
    const { yarnData } = useFetch('fetchyarn');

    //If pattern cannot be retreived from data
    if (!pattern) return (
        <header className="patterns">
            <h1> {"Project not found"}</h1>
        </header>
    );

    const SavedClick = (data) =>{
        useSend('/getsaved', data)
    }

    //sort yarn data based on yarn type
    //sort based on yardage
    //Enough yarn better than the correct fibre type

    //Display pattern information
    return( 
        <header className="patterns">
            <h1> {pattern["Project name"]}</h1>
            <h3 style={{ fontSize: '24px' }}>{pattern['url']}</h3>
            <img className="patternImg" src={pattern.Photo} alt={pattern["Project name"]} />
            <button className="patternSavedBtn" onClick={() => SavedClick(pattern) } >Save Pattern</button>
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

function useFetch(url) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/' + url)
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

//URl - specifies whether adding to inventory or saved
//DATA - info to be added the the defined json
function useSend(url, data) {

    fetch('http://localhost:5000/' + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })   
}


function Header() {
    const navigate = useNavigate();
    return (
        <>
            <header className="homepage">
                <h1> SmartStash </h1>
                <button className="profile-btn" onClick={() => navigate('/saved')}>Saved</button>
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
            <Route path="/saved" element={<Saved />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/:id" element={<Pattern />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/addyarn" element={<AddYarn />} />
        </Routes>
    );
}

export default App;
