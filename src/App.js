import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css'

// получаем класс IO
import io from 'socket.io-client'

import Home from './panels/Home'
import Chat from './panels/Chat'
import Persik from './panels/Persik'
import Race from './panels/Race'

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	// локальное состояние для сообщений
	const [messages, setMessages] = useState([])

	// адрес сервера
	// требуется перенаправление запросов - смотрите ниже
	const SERVER_URL = 'https://5.188.141.101:5000'

	// useRef() используется не только для получения доступа к DOM-элементам,
  	// но и для хранения любых мутирующих значений в течение всего жизненного цикла компонента
  	const socket = useRef(null)

	useEffect(async () => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		let user = null
		
		async function fetchData() {
			user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);

			// создаем экземпляр сокета, передаем ему адрес сервера
			// и записываем объект с названием комнаты в строку запроса "рукопожатия"
			// socket.handshake.query.roomId
			/*socket.current = io(SERVER_URL)

			// отправляем запрос на получение сообщений
			socket.current.emit('message:get')*/
		}

		await fetchData();

		// обрабатываем получение сообщений
		/*socket.current.on('messages', (messages) => {
			// определяем, какие сообщения были отправлены данным пользователем,
			// если значение свойства "userId" объекта сообщения совпадает с id пользователя,
			// то добавляем в объект сообщения свойство "currentUser" со значением "true",
			// иначе, просто возвращаем объект сообщения
			const newMessages = messages.map((msg) =>
			  msg.userId === user.id ? { ...msg, currentUser: true } : msg
			)
			// обновляем массив сообщений
			setMessages(newMessages)
		})*/

		return () => {
		  	// при размонтировании компонента выполняем отключение сокета
		  	//socket.current.disconnect()
		}
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};	

	// функция отправки сообщения
	// принимает объект с текстом сообщения и именем отправителя
	const sendMessage = ({ messageText, senderName }) => {
		// добавляем в объект id пользователя при отправке на сервер
		
		console.log(fetchedUser)

		socket.current.emit('message:add', {
			userId: fetchedUser.id,
			messageText,
			senderName,
			avatar: fetchedUser.photo_200
		})
	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home 
						id='home' 
						fetchedUser={fetchedUser} 
						go={go} 
						messages={messages} 
						sendMessage={sendMessage}
					/>
					<Chat 
						id='chat' 
						fetchedUser={fetchedUser} 
						go={go} 
						messages={messages} 
						sendMessage={sendMessage}
					/>
					<Race 
						id='race' 
						go={go} 
					/>
					<Persik 
						id='persik' 
						go={go} 
					/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
