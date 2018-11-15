import React from 'react'
import {Link} from 'react-router-dom';

const NewPage = () => (
    <div>
        <Link to="/create">New Game</Link>
        <Link to="/join">Join Game</Link>
    </div>
)

export default NewPage;