import React from 'react'
import PropTypes from 'prop-types'
import { usePlatform, getClassName } from "@vkontakte/vkui"
import { Panel, PanelHeader, PanelHeaderBack, Div } from '@vkontakte/vkui'

import useWindowDimensions from './hooks/useWindowDimensions'

import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import { Joystick } from 'react-joystick-component'

import Game from './Race/state/Game'

const Race = ({ id, go }) => {
	const platform = usePlatform()
	console.log(platform)

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
		  	height: `${(height - 63) / height * 100}%`,
		  	type: Phaser.AUTO,
			physics: {
    			default: "arcade",
    			arcade: {
      				debug: true
    			}
  			},
		  	scene: Game,
			//stage: {}
		}
	}

	const onMove = (stick) => {
        //setManualTiltAngle([stick.y, stick.x]);
		//console.log(stick)
		stickState = stick
    }

    const onStop = () => {
        //setManualTiltAngle([0, 0]);
		stickState.y = 0
		stickState.x = 0
    }

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
}

export default Race
