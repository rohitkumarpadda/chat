/// <reference types="node" />
import '~/config/dotenv';
import http from 'http';
declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export default server;
//# sourceMappingURL=server.d.ts.map