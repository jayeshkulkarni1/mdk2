// import NotificationLibrary from '../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
// import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';
export default function RequiredEndTime(context) {
    // let container = context.getControls()[0];
    // let PriorityValue = container.getControl('PrioritySeg').getValue()[0].ReturnValue;
    let date = new Date();
    // if (PriorityValue == "2") {
        date.setDate(date.getDate() + 7);
        return date;
    // }
    // date.setDate(date.getDate() + 1);
    // return date;

}