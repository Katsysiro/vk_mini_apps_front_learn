import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, PanelHeaderBack, Div } from '@vkontakte/vkui';

import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import { Joystick } from 'react-joystick-component'

import useWindowDimensions from './hooks/useWindowDimensions';

const Race = ({ id, go }) => {

	const { height, width } = useWindowDimensions()
	let stickState = {
		x: 0,
		y: 0
	}

	let state = 
	{
		initialize: true,
		game: {
		  	width: "100%",
		  	height: `${(height - 61) / height * 100}%`,
		  	type: Phaser.AUTO,
		  	scene: {
				init: function() {
			  		this.cameras.main.setBackgroundColor('#24252A')
				},
				create: function() {
			  		this.helloWorld = this.add.text(
						this.cameras.main.centerX, 
						this.cameras.main.centerY, 
						"Hello World", { 
							font: "40px Arial", 
							fill: "#ffffff" 
						}
			  		);
			  		this.helloWorld.setOrigin(0.5);
				},
				update: function() {
			  		this.helloWorld.angle += stickState.x/10;
				}
		  	}
		}
	}

	const onMove = (stick) => {
        //setManualTiltAngle([stick.y, stick.x]);
		//console.log(stick)
		stickState = stick
    };

    const onStop = () => {
        //setManualTiltAngle([0, 0]);
		stickState.y = 0;
		stickState.x = 0;
    };

	const { initialize, game } = state

	return (
		<Panel id={id}>
			<PanelHeader
				left={<PanelHeaderBack onClick={go} data-to="home"/>}
			>
				Гоночки
			</PanelHeader>
			<IonPhaser 
				style={{
					height: 'calc(100% - 75px)'
				}}
				game={game} 
				initialize={initialize} 
			/>
			<Div
				style={{
					position: 'absolute',
					bottom: '100px',
					left: 'calc(50% - 75px)'
				}}
			>
				<Joystick				
					size={100} 
					sticky={true} 
					move={onMove} 
					stop={onStop}
				></Joystick>
			</Div>
			
		</Panel>
	)
}

Race.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Race;
