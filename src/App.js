import React, { useState, useEffect, useRef } from 'react'
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import '@vkontakte/vkui/dist/vkui.css'

// получаем класс IO
import io from 'socket.io-client'

import Home from './panels/Home'
import Chat from './panels/Chat'
import Persik from './panels/Persik'
import Ads from './panels/Ads'
import Race from './panels/Race'

const App = () => {
	const [activePanel, setActivePanel] = useState('home')
	const [fetchedUser, setUser] = useState(null)
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />)

	// адрес сервера
	// требуется перенаправление запросов - смотрите ниже
	const SERVER_URL = 'https://localhost:5000'

	// useRef() используется не только для получения доступа к DOM-элементам,
  	// но и для хранения любых мутирующих значений в течение всего жизненного цикла компонента
  	const socket = useRef(null)

	useEffect(async () => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme')
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light'
				document.body.attributes.setNamedItem(schemeAttribute)
			}
		})
		
		async function fetchData() {
			let user = await bridge.send('VKWebAppGetUserInfo')
			setUser(user)
			setPopout(null)

			// создаем экземпляр сокета, передаем ему адрес сервера
			// и записываем объект с названием комнаты в строку запроса "рукопожатия"
			// socket.handshake.query.roomId
			socket.current = io(SERVER_URL)
		}

		await fetchData()

		return () => {
		  	// при размонтировании компонента выполняем отключение сокета
		  	socket.current.disconnect()
		}
	}, [])	

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to)
	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home 
						id='home' 
						fetchedUser={fetchedUser} 
						go={go}
						socket={socket.current} 
					/>
					<Chat 
						id='chat' 
						fetchedUser={fetchedUser} 
						go={go}
						socket={socket.current} 
					/>
					<Race 
						id='race' 
						go={go} 
						fetchedUser={fetchedUser} 
						socket={socket.current} 
					/>
					<Ads
						id='ads' 
						go={go} 
					/>
					<Persik 
						id='persik' 
						go={go} 
					/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	)
}

export default App
