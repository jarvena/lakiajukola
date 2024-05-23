import React from 'react';
import './navbar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function Navbar(){
  return (
    <div className="heading">
      <h1>Lakiajukola karttaselain</h1>
      <div className="download-button">
        <a href="./data/lakiajukola_kilpailualuekartta.pdf">
        <FontAwesomeIcon icon={faFilePdf} />
        </a>
      </div>
    </div>
  );
}