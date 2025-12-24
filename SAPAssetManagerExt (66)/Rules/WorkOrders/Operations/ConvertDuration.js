export default function ConvertDuration(context) {
    // For PM02 Order Type assign Person responsible in requirement assignment tab in WO & Operation
    // JK PCN Changes with WorkOrderOperationCreate.action and WorkOrderOperationCreateUpdate.page
    var duration = context.evaluateTargetPath('#Page:WorkOrderOperationAddPage/#Control:Duration/#Value');
    var durInHours = Number(duration) / 60;
    return durInHours.toFixed(2);
}