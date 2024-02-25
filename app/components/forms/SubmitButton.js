import React from "react";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";

function SubmitButton({ title , buttonStyle , buttonTextStyle, onPress}) {
    const { handleSubmit } = useFormikContext();

    return <AppButton text={title} buttonStyle={buttonStyle} buttonTextStyle={buttonTextStyle} onPress={onPress}/>;
}

export default SubmitButton;
