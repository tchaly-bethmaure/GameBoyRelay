from aiohttp import web
import socketio

sio = socketio.AsyncServer(cors_allowed_origins="*")
app = web.Application()
sio.attach(app)

'''async def my_message(data):
    print("Received ", data, " from ", sid)
    sio.emit("message", data, )'''

# TODO : count room and give an id. We count joined peer 2 by 2 and assigning a room for 2 peer.

@sio.event
async def gb_com(sid, message):
    print("[+] GameBoy Communication ", message["data"]," to room ",message['room']," received.")
    await sio.emit('gb_com', {'data': message['data']}, room=message["room"], skip_sid=sid)

@sio.event
async def my_room_event(sid, message):
    print("[+] Message ", message["data"]," to room ",message['room']," received.")
    await sio.emit('my_response', {'data': message['data']}, room=message['room']) # skip sid bug ? , skip_sid=sid

@sio.event
async def join(sid, message):
    print("[+] Room ", message["room"]," joined. For ", sid)
    await sio.enter_room(sid, message['room'])
    await sio.emit('my_response', {'data': 'Entered room: ' + message['room']},
                   room=sid)

@sio.event
async def connect(sid, environ):
    print("[+] SID ",sid," connected.")
    await sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)

if __name__ == '__main__':
    web.run_app(app)
