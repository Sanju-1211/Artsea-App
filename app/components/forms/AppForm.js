import React from "react";
import { Formik } from "formik";

function AppForm({ initialValues, onSubmit, validationSchema, children }) {
    console.log("inside app form");
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {() => <>{children}</>}
        </Formik>
    );
}

export default AppForm;
