import Canvas from './engine/canvas/Canvas';
import NetworkGameClient from './client/NetworkGameClient';

const canvas = new Canvas();
canvas.create(1080, 1920);

const client = new NetworkGameClient('127.0.0.1', canvas, true, 41234);
