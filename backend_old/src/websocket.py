import json
from aiohttp.web import Request, WSMsgType, WebSocketResponse
from asyncio import CancelledError, create_task
from .action_handler import handle_action


async def websocket_handler(request: Request):
    connection_manager = request.app["connection_manager"]

    ws = WebSocketResponse()

    await ws.prepare(request)

    connection_id = connection_manager.add_connection(ws)
    ws.id = str(connection_id)

    print(f"WebSocket connected: {request.remote}")

    # Start a separate task for receiving messages
    async def receive_messages():
        try:
            async for msg in ws:
                if msg.type == WSMsgType.TEXT:

                    # Parse data as json
                    try:
                        data = json.loads(msg.data)
                        # f"Parsed JSON data: {data}")
                    except json.JSONDecodeError:
                        print(f"Failed to parse JSON: {msg.data}")

                    if not data.get("action"):
                        await ws.send_str("Error: 'action' field is required.")
                        continue  # Skip to next message

                    action = data.get("action")

                    create_task(handle_action(request, ws, data, action))

                elif msg.type == WSMsgType.CLOSE:
                    print(f"WebSocket closed by client: {request.remote}")
                    break

                elif msg.type == WSMsgType.ERROR:
                    print(
                        f"WebSocket connection closed with exception: {ws.exception()}")
        except CancelledError:
            print(f"Receive task for {request.remote} cancelled.")
        finally:
            print(f"Receive task for {request.remote} finished.")

    await create_task(receive_messages())

    print(f"WebSocket disconnected: {request.remote}")

    # Clean up event listener
    connection_manager.remove_connection(connection_id)

    return ws
