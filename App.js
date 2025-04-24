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

    //Navigates to add new yarn
    const AddYarn = () => {
        navigate('/addyarn');
    }

    //Delete yarn from inventory
    const DeleteInv = (data) => {
        useSend('/deleteinv', data)
        window.location.reload();
    };

    return (
        <header className="inventory">
            <button className="back-btn" onClick={() => navigate('/')} >Back</button>
            <h1> Inventory </h1>
            <button className="add-btn" onClick={() => AddYarn()}>Add Yarn</button>

            <div className = "yarnContainer">
                {data.map((yarn, index) => (
                    <div key={index} className="yarnText">
                        <p>
                            Name: {yarn['Yarn name']} <br />
                            Total yardage: {yarn["Total yardage"]} <br />
                            Ply: {yarn["ply"]} <br />
                            Wpi: {yarn["wpi"]} <br />
                        </p>
                        <button className="patternSavedBtn" onClick={() => DeleteInv(yarn)} >Delete</button>
                        <button className="patternSavedBtn" onClick={() => navigate('/edityarn', {state: yarn})}>Edit</button>
                    </div>
                ))}
            </div>
        </header>
    )
}

function AddYarn() {
    const navigate = useNavigate();

    const UpdateInventory = (event) => {
        event.preventDefault();
        const form = event.target;
        const newItem = {
            'Yarn name': form.name.value, 'Total yardage': form.yardage.value, ply: form.ply.value, wpi: form.wpi.value
        };
        useSend('/getinv', newItem)
    }

    return (
        <header className="inventory">
            <button className="back-btn" onClick={() => navigate('/inventory')} >Back</button>
            <h1> Add Yarn </h1>
            <form className="form" onSubmit={UpdateInventory}>
                <label> Name:
                    <input name = "name" type="text" />
                </label><br />
                <label> Total yardage:
                    <input name = "yardage" type="number" />
                </label><br />
                <label> Ply:
                    <input name = "ply" type="number" />
                </label><br />
                <label> Wpi:
                    <input name = "wpi" type="number" />
                </label>
                <input type="submit"/>
            </form>
        </header>
    );
}

function EditYarn() {
    const navigate = useNavigate();
    const location = useLocation();
    const yarn = location.state;

    const UpdateInventory = (event) => {
        event.preventDefault();
        const form = event.target;
        const newItem = {
            'Yarn name': yarn['Yarn name'], 'Total yardage': form.amountChanged.value, ply: yarn['ply'], wpi: yarn['wpi']
        };
        useSend('/getinv', newItem)
    }

    return (
        <header className="inventory">
            <button className="back-btn" onClick={() => navigate('/inventory')} >Back</button>
            <h1> Edit Yarn </h1>
            <form className="form" onSubmit={UpdateInventory}>
                <label> Name: {yarn['Yarn name']} </label><br />
                <label> Current yardage: {yarn['Total yardage'] } </label><br />
                <label> Ply: {yarn['ply'] }  </label><br />
                <label> Wpi: {yarn['wpi'] } </label>
                <label> Add/remove yardage:
                    <input name="amountChanged" type="number" />
                </label>
                <input type="submit" />
            </form>
        </header>
    );
}
    
function Saved() {
    const { data } = useFetch('fetchsaved');
    const navigate = useNavigate();
    const ImgClick = (row) => {
        navigate('/' + row["Project id"], { state: row });
    };
    const DeleteSaved = (data) => {
        useSend('/deletesaved', data)
        window.location.reload();
    };

    return (
        <header className="inventory">
            <button className="back-btn" onClick={() => navigate('/')} >Back</button>
            <h1> Saved </h1>
            <div className="gallery">
                {data.map((pattern, index) => (
                    <div key={index} className="galleryItem">
                        <img src={pattern.Photo} alt={pattern["Project name"]} onClick={() => ImgClick(pattern)} />
                        <div className="galleryCaption">{pattern["Project name"]}</div>
                        <button className="patternSavedBtn" onClick={() => DeleteSaved(pattern)}>Delete</button>
                    </div>
                ))}
            </div>
        </header>
    )
}

function Patterns() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [craft, setCraft] = useState('')
  
    const navigate = useNavigate();

    //Locate to specific pattern page when image is pressed
    const ImgClick = (row) => {
        navigate('/' + row["Project id"], { state: row });
    };


    const Refresh = (event) => {
        setLoading(true);
        setData([]);

        event.preventDefault();
        const form = event.target;
        const query = {
            'Query': form.query.value, "Craft": craft};

        fetch('http://localhost:5000/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
            })
            .then(res => {
                console.log("Response Status:", res.status);  // Check the status code
                return res.json();
            })
            .then(data => {
                FetchPatterns();
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const FetchPatterns = () => {
        fetch('http://localhost:5000/fetchpatterns')
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
    };

    const selectCraft = (event) => {
        setCraft(event.target.value);
    }


    //Fetches patterns to be displayed from backend
    useEffect(() => {
        FetchPatterns();
    }, []);

    return (
        //Display the recommended patterns in a grid
        <header className="patterns">
            <button className="back-btn" onClick={() => navigate('/')} >Back</button>
            <h1> Patterns </h1>
            <form className="searchForm" onSubmit={Refresh }>
                <label>Search:
                    <input className = "inputText" name="query" type="text" />
                </label>
                <label>Craft: </label>
                <select className = "inputText"value={craft} onChange={selectCraft }>
                    <option value="either">No preference</option>
                    <option value="crochet">Crochet</option>
                    <option value="knitting">Knitting</option>
                </select>
                <button className="refresh-btn" disabled={loading}> {loading ? 'Loading...' : 'Refresh'}</button>
            </form>
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
    const navigate = useNavigate();
    const [yarnData, setYarnData] = useState([]);
    var terminology = "UK";

    if (pattern['UK'] == null) {
        terminology = 'US';
    }

    const SavedClick = (data) => {
        useSend('/getsaved', data)
    };

    useEffect(() => {
        if (!pattern) return;
        const fetchYarn = async () => {
            const response = await fetch('http://localhost:5000/specificyarn', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(pattern)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch yarn data');
            }

            const yarnData = await response.json();
            setYarnData(yarnData);
        };
        fetchYarn();
    }, [pattern]);

    //If pattern cannot be retreived from data
    if (!pattern) return (
        <header className="patterns">
            <h1> {"Project not found"}</h1>
        </header>
    );

    //Display pattern information
    return( 
        <header className="patterns">
            <button className="back-btn" onClick={() => navigate(-1)} >Back</button>
            <h1> {pattern["Project name"]}</h1>
            <h3 style={{ fontSize: '24px' }}>{pattern['url']}</h3>
            <img className="patternImg" src={pattern.Photo} alt={pattern["Project name"]} />
            <button className="patternSavedBtn" onClick={() => SavedClick(pattern) } >Save Pattern</button>
            <div className="patternText">
                <p>
                    Difficulty: {pattern["Difficulty average"]} <br />
                    Yarn name: {pattern["Yarn name"]} <br />
                    Minimum yardage: {pattern["Min yardage"]} <br />
                    Maximum yardage: {pattern["Max yardage"]} <br />
                    Ply: {pattern["ply"]} <br />
                    Wpi: {pattern["wpi"]} <br />
                    Terminology: {terminology} <br />
                    Categories: {pattern["Categories"]}<br />
                </p>
            </div>
            <h3 className="yarnHeading"> Available Yarn:</h3>
            <div className="yarnContainer">
                
                {yarnData.map((yarn, index) => (
                    <div key={index} className="yarnText">
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
                <h1> SmartStitch </h1>
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
            <Route path="/edityarn" element={<EditYarn />} />
        </Routes>
    );
}

export default App;