import { Response } from "./interface";

class Utils {
    public static prepareResponse(statusCode: number, body: string): Response {
        return {
            statusCode,
            body
        };
    }
}
export default Utils;
