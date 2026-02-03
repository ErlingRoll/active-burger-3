from asyncio import create_task
from typing import Any, List
from pydantic import BaseModel, ConfigDict
from aiohttp.web import WebSocketResponse

from src.generators.world import Realm


class GameEvent(BaseModel):
    event: str
    payload: dict[str, Any] = {}
    log: List[str] = []


class ConnectionInfo(BaseModel):
    ws: WebSocketResponse
    connection_id: str
    realm: Realm
    model_config = ConfigDict(arbitrary_types_allowed=True)


class ConnectionManager(BaseModel):

    connection_counter: int = 0  # Total connections since server start
    connections: dict = {}
    connections_account_map: dict[str, Any] = {}
    model_config = ConfigDict(arbitrary_types_allowed=True, extra="allow")

    def add_connection(self, ws):
        self.connection_counter += 1
        connection_id = self.connection_counter
        self.connections[str(connection_id)] = ws
        return connection_id

    def update_account_map(self, account_id, ws, realm: Realm):
        self.connections_account_map[account_id] = {
            "ws": ws,
            "connection_id": str(ws.id),
            "realm": realm
        }
        self.clean_connections_account_map()
        print(f"Account map updated. Total mapped accounts: {len(self.connections_account_map)}")

    async def set_account_realm(self, account_id: str, realm: Realm):
        con = self.connections_account_map.get(account_id)
        if not con:
            print(f"[set_account_realm] No connection found for account {account_id}")
            self.connections_account_map[account_id] = {"ws": None, "connection_id": None, "realm": None}
            con = self.connections_account_map.get(account_id)
            if not con:
                return print(f"[set_account_realm] Failed to create connection entry for account {account_id}")

        con["realm"] = realm

        realm_update_event = GameEvent(
            event="realm_update",
            payload={"realm": realm}
        )

        ws = con.get("ws", None)
        if not ws or ws.closed:
            return print(f"[set_account_realm] No active WebSocket for account {account_id}")

        await ws.send_json(realm_update_event.model_dump())

    def clean_connections_account_map(self):
        closed_connections = []
        for account_id, con in self.connections_account_map.items():
            if con.get("ws", None) is None or con["ws"].closed:
                closed_connections.append(account_id)
        for account_id in closed_connections:
            del self.connections_account_map[account_id]
            print(f"Removed closed connection for account {account_id}")

    def remove_connection(self, connection_id):
        if connection_id in self.connections:
            del self.connections[connection_id]
        self.clean_connections_account_map()

    async def send(self, account_id, event: GameEvent):
        con = self.connections_account_map.get(account_id)
        ws = self.connections.get(con.get("connection_id")) if con else None

        if ws is not None and not ws.closed:
            try:
                await ws.send_json(event.model_dump())
            except Exception as e:
                print(f"Error sending to account {account_id}: {e}")

        else:
            print(f"[send/{event.event}] No active WebSocket for account {account_id}")
            self.remove_connection(account_id)

    async def broadcast_realmed_event(self, event: GameEvent, realmed_payload: dict):
        # Broadcast event to all active WebSocket connections. Payload is diveded by realm.
        inactive_connections = []
        for connection_id, ws in self.connections.items():
            if not ws.closed:
                try:
                    create_task(ws.send_json(event.model_dump()))
                except Exception as e:
                    print(f"Error sending to connection {connection_id}: {e}")
            else:
                inactive_connections.append(connection_id)
        for connection_id in inactive_connections:
            self.remove_connection(connection_id)
        if inactive_connections:
            print(f"Removed {len(inactive_connections)} inactive connections. Total connections: {len(self.connections)}")

    def get_account_connections(self) -> dict[str, Any]:
        active_connections = {}
        inactive_connections = []
        connection_id_account_id_map = {con["connection_id"]: {**con, "account_id": account_id} for account_id, con in self.connections_account_map.items()}
        for connection_id, ws in self.connections.items():
            if not ws.closed:
                con = connection_id_account_id_map.get(connection_id, None)
                if con is not None and con["account_id"]:
                    active_connections[con["account_id"]] = con
            else:
                inactive_connections.append(connection_id)
        for connection_id in inactive_connections:
            self.remove_connection(connection_id)
        if inactive_connections:
            print(f"Removed {len(inactive_connections)} inactive connections. Total connections: {len(self.connections)}")
        return active_connections

    async def broadcast(self, event: GameEvent):
        # Broadcast event to all active WebSocket connections
        inactive_connections = []
        for connection_id, ws in self.connections.items():
            if not ws.closed:
                try:
                    create_task(ws.send_json(event.model_dump()))
                except Exception as e:
                    print(f"Error sending to connection {connection_id}: {e}")
            else:
                inactive_connections.append(connection_id)
        for connection_id in inactive_connections:
            self.remove_connection(connection_id)
        if inactive_connections:
            print(f"Removed {len(inactive_connections)} inactive connections. Total connections: {len(self.connections)}")
