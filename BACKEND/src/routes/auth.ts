import { Router } from "express";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../schemas/registerSchema";
import { register} from "../controllers/auth.controller";
import checkUserExist from "../controllers/checkUserExist.controller";
import { updateUserSchema } from "../schemas/updateUser.schema";
import { updateUser } from "../controllers/auth.controller";
import { login } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/register", validate(registerSchema), checkUserExist, register);
router.patch("/update", validate(updateUserSchema), updateUser);
router.post("/login",login);


export default router;
