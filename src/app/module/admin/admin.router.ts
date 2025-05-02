import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constants";
import { adminController } from "./admin.controller";
import { RentalControllers } from "../order/order.controller";
import { multerUpload } from "../../config/multer.config";
import { ProductControllers } from "../rentalHouse/rentalHouse.controller";
import { parseBody } from "../../middlewares/bodyParser";

const adminRouter = Router();

adminRouter.get(
  "/listings",
  auth(USER_ROLE.admin),
  adminController.getAllHousesByAdmin
);

adminRouter.get(
  "/users",
  auth(USER_ROLE.admin),
  adminController.getAllUsersByAdmin
);

adminRouter.patch(
  "/user/:id",
  auth(USER_ROLE.admin),
  adminController.userDeleteByAdmin
);

// adminRouter.patch(
//   "/listings/:id",
//   auth(USER_ROLE.admin),
//   multerUpload.fields([{ name: "images" }]),
//   parseBody,
//   ProductControllers.updateProduct
// );

adminRouter.delete(
  "/listings/:productId",
  auth(USER_ROLE.admin),
  ProductControllers.deleteProduct
);

export default adminRouter;
