import authRoutes from "./auth";
import activitiesRoute from "./activities";

export default (app) => {

    app.use('/v1/auth', authRoutes);
    app.use('/v1/activities', activitiesRoute);
}