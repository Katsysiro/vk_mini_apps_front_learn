import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

// получаем класс IO
import io from 'socket.io-client'

import Home from './panels/Home';
import Persik from './panels/Persik';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	// локальное состояние для сообщений
	const [messages, setMessages] = useState([])

	// адрес сервера
	// требуется перенаправление запросов - смотрите ниже
	const SERVER_URL = 'http://localhost:5000'

	// useRef() используется не только для получения доступа к DOM-элементам,
  	// но и для хранения любых мутирующих значений в течение всего жизненного цикла компонента
  	const socket = useRef(null)

	useEffect(() => {
		console.log('useEffect App')

		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);


		// отправляем запрос на получение сообщений
		socket.current.emit('message:get')
		}
		fetchData();
		
		// создаем экземпляр сокета, передаем ему адрес сервера
		// и записываем объект с названием комнаты в строку запроса "рукопожатия"
		// socket.handshake.query.roomId
		socket.current = io(SERVER_URL)
		

		// обрабатываем получение сообщений
		socket.current.on('messages', (messages) => {
			console.log('on messages')
			console.log(messages)

			console.log(fetchedUser)

			// определяем, какие сообщения были отправлены данным пользователем,
			// если значение свойства "userId" объекта сообщения совпадает с id пользователя,
			// то добавляем в объект сообщения свойство "currentUser" со значением "true",
			// иначе, просто возвращаем объект сообщения
			const newMessages = messages.map((msg) =>
			  msg.userId === fetchedUser.id ? { ...msg, currentUser: true } : msg
			)
			// обновляем массив сообщений
			setMessages(newMessages)
		})

		return () => {
		  // при размонтировании компонента выполняем отключение сокета
		  socket.current.disconnect()
		}
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};	

	// функция отправки сообщения
	// принимает объект с текстом сообщения и именем отправителя
	const sendMessage = ({ messageText, senderName }) => {
		// добавляем в объект id пользователя при отправке на сервер
		socket.current.emit('message:add', {
			userId,
			messageText,
			senderName
		})
	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home id='home' fetchedUser={fetchedUser} go={go} messages={messages} sendMessage={sendMessage}/>
					<Persik id='persik' go={go} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
