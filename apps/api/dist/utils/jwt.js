"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.issueJWT = exports.verifyJWT = exports.getJWTPrivateKey = exports.getJWTPublicKey = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//get our public key file
var getJWTPublicKey = function () {
    var pathToKey = path_1["default"].resolve(__dirname, "../../public.pem");
    var publicKey = fs_1["default"].readFileSync(pathToKey, "utf8");
    if (!publicKey) {
        throw new Error("Public key not found");
    }
    return publicKey;
};
exports.getJWTPublicKey = getJWTPublicKey;
//get our private key file from the path
var getJWTPrivateKey = function () {
    var pathToKey = path_1["default"].resolve(__dirname, "../../private.pem");
    var privateKey = fs_1["default"].readFileSync(pathToKey, "utf8");
    if (!privateKey) {
        throw new Error("Private key not found");
    }
    return privateKey;
};
exports.getJWTPrivateKey = getJWTPrivateKey;
//Used to verify the token
var verifyJWT = function (token) {
    var publicKey = (0, exports.getJWTPublicKey)();
    //Were we use our public key to verify the token
    var decoded = jsonwebtoken_1["default"].verify(token, publicKey, {
        algorithms: ["RS256"]
    });
    return decoded;
};
exports.verifyJWT = verifyJWT;
//Issue the JWT to the user
var issueJWT = function (_a) {
    var user = _a.user, res = _a.res;
    //issue the JWT
    var _id = user._id;
    var expiresIn = "14d"; //Expire in 2 weeks, to mitigate if the JWT is stolen
    var payload = {
        sub: _id,
        iat: Date.now(),
        //include some info for our frontend (actually we are not using this)
        user: {
            email: user.email,
            name: user.name,
            username: user.username,
            id: user._id
        }
    };
    //Here we sign the JWT using our private key
    var token = jsonwebtoken_1["default"].sign(payload, (0, exports.getJWTPrivateKey)(), {
        expiresIn: expiresIn,
        algorithm: "RS256"
    });
    //set the JWT in the cookie in httpOnly mode so that it cannot be accessed by the client to avoid XSS attacks
    res.cookie("access-token", token, {
        httpOnly: false,
        secure: false,
        //expires in 2 weeks
        maxAge: 1000 * 60 * 60 * 24 * 14
    });
};
exports.issueJWT = issueJWT;
