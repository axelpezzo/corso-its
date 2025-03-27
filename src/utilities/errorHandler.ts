import { ZodError } from "zod";

export const validationError = (error: ZodError) => {
    console.log("Validation Error: ", error.errors);
    let errors: string = "";
    error.errors.forEach((err) => {
        errors += `Path:  ${err.path.join(".")}`;
        errors += `Message: ${err.message}`;
    });

    return error;
};