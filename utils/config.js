const { JWT_SECRET } = process.env;

if (!JWT_SECRET || JWT_SECRET === "super-strong-secret") {
	if (process.env.NODE_ENV === "production") {
		throw new Error("A strong JWT_SECRET must be set in production environment");
	}
}

module.exports = {
	JWT_SECRET,
};