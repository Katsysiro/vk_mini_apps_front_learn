import React from 'react'
import PropTypes from 'prop-types'

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui'

const Home = ({ id, go, fetchedUser, socket }) => (
	<Panel id={id}>
		<PanelHeader>Example</PanelHeader>
		{fetchedUser &&
		<Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
			<Cell
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
			>
				{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
			</Cell>
		</Group>}

		<Group header={<Header mode="secondary">Navigation Example</Header>}>
			<Div>
				<Button stretched size="l" mode="secondary" onClick={go} data-to="persik">
					Show me the Persik, please
				</Button>
			</Div>
			<Div>
				<Button stretched size="l" mode="secondary" onClick={() => {
					//socket.current.emit('join', {
					//	room: 'chat'
					//})
					go({
						currentTarget : {
							dataset: {
								to: 'chat'
							}
						}
					})
					// отправляем запрос на получение сообщений
					//socket.current.emit('message:get')
				}} data-to="chat">
					Чатик
				</Button>
			</Div>
			<Div>
				<Button stretched size="l" mode="secondary" onClick={go} data-to="race">
					Гоночки
				</Button>
			</Div>
			<Div>
				<Button stretched size="l" mode="secondary" onClick={go} data-to="ads">
					Поддержите проект
				</Button>
			</Div>
		</Group>
	</Panel>
)

export default Home
