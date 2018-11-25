import React from 'react'
import {Link} from 'react-router-dom';
import Signature from './Signature';

const NewPage = () => (
    <div>
        <Link to="/create">New Game</Link>
        <Link to="/join">Join Game</Link>
        <Signature />
    </div>
)

export default NewPage;