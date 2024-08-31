import EErrors from "../../services/errors/enums.js";

const errorHandler = (error, req, res, next) => {
    console.error(error.cause);

    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).json({ status: "error", error: error.message });
            break;
        default:
            res.status(500).json({ status: "error", error: "Unhandled error" });
    }
};

export default errorHandler;
