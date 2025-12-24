/**
* Adjust the Start Time value based on the Duration 
* @param {IClientAPI} formCellControlProxy
*/
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import getPostingOverride from '../../../../SAPAssetManager/Rules/Confirmations/ConfirmationsGetPostingDateOverride';
import GetEndDateTime from '../../../../SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GetEndDateTime';

export default function DurationOnValueChange(formCellControlProxy) {

    let duration = formCellControlProxy.getValue();
    let pageProxy = formCellControlProxy.getPageProxy();
    let binding = pageProxy.binding;

    let now = new Date();
    let endDateTime = GetEndDateTime(pageProxy);

    /* Commenting Standard Code
    if (endDateTime > now) { //Only adjust the start date and time if the new duration causes the end date and time to be in the future

        let startDateTime = new ODataDate(binding.PostingDate); //This is done so that the Posting Date is preserved when the confirmation is being added for a different date than today
        startDateTime.date().setHours(now.getHours());
        startDateTime.date().setMinutes(now.getMinutes());

        startDateTime.date().setMinutes(now.getMinutes() - duration);

        let startDateControl = libCom.getControlProxy(pageProxy, 'StartDatePicker');
        startDateControl.setValue(startDateTime.date());

        if (getPostingOverride(formCellControlProxy)) {
            let postingDateControl = libCom.getControlProxy(pageProxy, 'PostingDatePicker');
            postingDateControl.setValue(startDateTime.date());
        }

        let startTimeControl = libCom.getControlProxy(pageProxy, 'StartTimePicker');
        startTimeControl.setValue(startDateTime.date());
    }

    */
}
