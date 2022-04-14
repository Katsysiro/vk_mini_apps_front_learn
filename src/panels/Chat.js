import React, { useState, useEffect, useRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Panel, PanelHeader, PanelHeaderBack, Group, Avatar, CardGrid, ContentCard, FixedLayout, Separator, WriteBar, WriteBarIcon } from '@vkontakte/vkui'

const Chat = ({ id, go, fetchedUser, socket }) => {
	// локальное состояние для сообщений
	const [messages, setMessages] = useState([])
	// локальное состояние для текста сообщения
	const [text, setText] = useState("")

	// функция отправки сообщения
	// принимает объект с текстом сообщения и именем отправителя
	const sendMessage = ({ messageText, senderName }) => {
		// добавляем в объект id пользователя при отправке на сервер
		socket.emit('message:add', {
			userId: fetchedUser.id,
			messageText,
			senderName,
			avatar: fetchedUser.photo_200
		})
	}

	// обрабатываем изменение текста
	const handleChangeText = (e) => {
		setText(e.target.value)
	}

	// обрабатываем отправку сообщения
	const handleSendMessage = (e) => {
		e.preventDefault()
		const trimmed = text.trim()
		if (trimmed) {
		  	sendMessage({ 
			  messageText: text, 
			  senderName: `${fetchedUser.first_name} ${fetchedUser.last_name}` 
			})
		  	setText('')
		}
	}

	socket.on('messages', (messages) => {
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
	
	return (
		<Panel id={id}>
			<PanelHeader
				left={<PanelHeaderBack onClick={go} data-to="home"/>}
			>
				Чатик
			</PanelHeader>
			
			<Group>
				<CardGrid size="l" 
					style={{marginBottom:54}}>
					{messages.map((msg) => (
						<ContentCard
							style={{
								backgroundColor: msg.currentUser ? '#fff000' : '#ffffff',
						  	}}
							subtitle={
								msg.avatar ? 
									<Avatar src={msg.avatar}/> : null
							}
							key={msg.messageId}
							header={msg.senderName}
							text={msg.messageText}
							caption={msg.createdAt}
						/>
					))}
				</CardGrid>
			</Group>

			<FixedLayout vertical="bottom">
            	<Separator wide />
				<WriteBar
					after={
						<Fragment>
							{<WriteBarIcon 
								mode="send" 
								onClick={handleSendMessage}
							/>}
						</Fragment>
					}
					value={text}
					onChange={handleChangeText}
					placeholder="Сообщение"
				/>
        	</FixedLayout>
			
		</Panel>
	)
}

Chat.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
}

export default Chat
