from websockets.server import serve
import asyncio
from time import sleep

WAITING_TIME = 0.1
buffer =[[]*2]*1
websockets_list = []
client_list = []

class Client:
    def __init__(self, id, ws):
        print("Client ",id," init.")
        self.id = id
        self.mywebsocket = ws
        websockets_list.append(ws)
        self.iteration_count = 0

    async def on_message(self):
        if len(websockets_list) == 2:
            data = websockets_list[self.id].recv() # GB A
            print("Received ",data, " ... storing for GB [", self.id,"]")
            buffer[(self.id-1)%1].append(data) # to GB B
        else:
            print("Waiting for another GameBoy....")

    async def clearing_buffer(self):
        if(len(buffer[self.id]) > 0) and len(websockets_list) == 2:
            data = buffer[self.id].pop()
            print("Sending ", data, " to GB [", (self.id),"]")
            websockets_list[self.id].send(data)
        else:
            print("Waiting for another GameBoy or buffer to be filled....")

    async def run(self):
        while True:
            print("-> run iteration : ", self.iteration_count)
            self.iteration_count += 1
            await self.on_message()
            await self.clearing_buffer()
            sleep(WAITING_TIME)

async def serve_for_good(websocket):
    print("-> Client connected")
    c = Client(len(websockets_list), websocket)
    client_list.append(c)
    await c.run()

async def main():
    async with serve(serve_for_good, "172.232.55.9", 888):
        print("Serving ...")
        await asyncio.Future() # loop
asyncio.run(main())

