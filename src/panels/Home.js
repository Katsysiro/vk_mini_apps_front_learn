import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, CardGrid, ContentCard, FixedLayout, Separator, WriteBar, WriteBarIcon } from '@vkontakte/vkui';

const Home = ({ id, go, fetchedUser, messages, sendMessage }) => {
	// локальное состояние для текста сообщения
	const [text, setText] = useState("")

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
	
	return (
		<Panel id={id}>
			<PanelHeader>Чатик</PanelHeader>

			{/*fetchedUser &&
			<Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
				<Cell
					before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
					description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
				>
					{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
				</Cell>
			</Group>*/}

			{/*<Group header={<Header mode="secondary">Navigation Example</Header>}>
				<Div>
					<Button stretched size="l" mode="secondary" onClick={go} data-to="persik">
						Show me the Persik, please
					</Button>
				</Div>
			</Group>*/}

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
};

Home.propTypes = {
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
};

export default Home;
