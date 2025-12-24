import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
export default function NotificationDetailsSutValue(context) {
    var binding = context.binding;
     //alert(JSON.stringify(binding));
    if (libVal.evalIsEmpty(binding.ZSUTIndicator)) {
        return '-';
    } else {
        return binding.ZSUTIndicator;
    }

    // var sLongText = "-";
    // if(context.binding.HeaderLongText && context.binding.HeaderLongText !== "" && context.binding.HeaderLongText[0].TextString.includes("SUT/GUT"))
    // {
    //     sLongText=context.binding.HeaderLongText[0].TextString;
    //     sLongText= sLongText.split("SUT/GUT").pop();
    // }
    // return sLongText;
}