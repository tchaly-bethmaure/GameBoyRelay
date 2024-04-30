from aiohttp import web
import socketio


async def my_message(data):
    print("Received ", data, " from ", sid)
    sio.emit("message", data, room='chat_users', skip_sid=sid)

sio = socketio.AsyncServer(cors_allowed_origins=['https://172.232.55.9:3000'])
app = web.Application()
app.add_routes([web.get('/', my_message)])
sio.attach(app)


if __name__ == '__main__':
    web.run_app(app)
