"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("./app/module/user/user.router"));
const auth_router_1 = __importDefault(require("./app/module/auth/auth.router"));
const order_routes_1 = require("./app/module/order/order.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const admin_router_1 = __importDefault(require("./app/module/admin/admin.router"));
const rentalHouse_routes_1 = require("./app/module/rentalHouse/rentalHouse.routes");
const rentalRequest_routes_1 = require("./app/module/rentalRequest/rentalRequest.routes");
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://property-pro-client.vercel.app",
    ],
    credentials: true,
}));
// middleware
app.use(express_1.default.json());
app.use("/auth", auth_router_1.default);
app.use("/landlords", rentalHouse_routes_1.RentalHouseRoutes);
app.use("/admin", admin_router_1.default);
app.use("/user", user_router_1.default);
app.use("/rental-requests", rentalRequest_routes_1.RentalRequestRoutes);
app.use("/order", order_routes_1.OrderRoutes);
app.get("/", (req, res) => {
    res.send({
        status: true,
        message: "Hello",
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.default);
exports.default = app;
//push
