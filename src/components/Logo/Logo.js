import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css'
import logo from './Logo.png'

const Logo = () => {
	return(
		<div className='divLogo ma4 mt0 w5'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 60 }} style={{ height: 150, width: 150 }} >
			 	<div className="Tilt-inner pa3"> <img style={{paddingTop: '5px'}} src={logo} alt='logo' /> </div>
			</Tilt>
		</div>
		);
}

export default Logo;