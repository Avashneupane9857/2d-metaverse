import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const connectedClients: Map<string, WebSocket> = new Map();

wss.on('connection', (ws: WebSocket) => {
  console.log('A new client connected');

  ws.on('message', (data: string) => {
    const message = JSON.parse(data.toString());

    switch (message.type) {
      case 'join':
        handleJoinEvent(message.payload, ws);
        break;
      case 'move':
        handleMoveEvent(message.payload, ws);
        break;
      default:
        console.log('Unhandled event type:', message.type);
    }
  });

  ws.on('close', () => {
    console.log('A client disconnected');
    for (const [userId, client] of connectedClients) {
      if (client === ws) {
        connectedClients.delete(userId);
        break;
      }
    }
  });
});

function handleJoinEvent(payload: any, ws: WebSocket) {
  const { spaceId, token } = payload;

  if (validateToken(token) && validateSpaceId(spaceId)) {
    const userId = generateUserId();
    connectedClients.set(userId, ws);
    broadcastSpaceJoinedEvent(spaceId, userId);
  } else {
    sendErrorMessage(ws, 'Invalid token or space ID');
  }
}

function handleMoveEvent(payload: any, ws: WebSocket) {
  const { x, y } = payload;

  if (validateMovement(x, y)) {
    broadcastMovementEvent(x, y, getClientId(ws));
  } else {
    sendMovementRejectedEvent(ws, 2, 3);
  }
}

function validateToken(token: string): boolean {
  return token === 'valid_token';
}

function validateSpaceId(spaceId: string): boolean {
  return spaceId === '123';
}

function generateUserId(): string {
  return 'user_id_1';
}

function getClientId(ws: WebSocket): string {
  for (const [userId, client] of connectedClients) {
    if (client === ws) {
      return userId;
    }
  }
  return '';
}

function broadcastSpaceJoinedEvent(spaceId: string, userId: string) {
  for (const client of connectedClients.values()) {
    sendSpaceJoinedEvent(client, { x: 2, y: 3 }, [{ id: userId }]);
  }
}

function broadcastMovementEvent(x: number, y: number, userId: string) {
  for (const [clientId, client] of connectedClients) {
    if (clientId !== userId) {
      sendMovementEvent(client, x, y, userId);
    }
  }
}

function sendSpaceJoinedEvent(ws: WebSocket, spawn: { x: number; y: number }, users: { id: string }[]) {
  ws.send(
    JSON.stringify({
      type: 'space-joined',
      payload: {
        spawn,
        users,
      },
    })
  );
}

function sendMovementEvent(ws: WebSocket, x: number, y: number, userId: string) {
  ws.send(
    JSON.stringify({
      type: 'movement',
      payload: {
        x,
        y,
        userId,
      },
    })
  );
}

function sendMovementRejectedEvent(ws: WebSocket, x: number, y: number) {
  ws.send(
    JSON.stringify({
      type: 'movement-rejected',
      payload: {
        x,
        y,
      },
    })
  );
}

function sendErrorMessage(ws: WebSocket, message: string) {
  ws.send(
    JSON.stringify({
      type: 'error',
      payload: {
        message,
      },
    })
  );
}
