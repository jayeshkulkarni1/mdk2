import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';
export default function SetRequiredDate(context) {
   let date = new Date();
   let oRequiredStartTimePicker = context.getPageProxy().evaluateTargetPath('#Control:RequiredStartTimePicker');
   let oRequiredEndTimePicker = context.getPageProxy().evaluateTargetPath('#Control:RequiredEndTimePicker');
   let dRequiredStartDate = oRequiredStartTimePicker.getValue();
   let oTypeLstPkr = context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr');
   var sNotificationType = oTypeLstPkr.getValue()[0].ReturnValue;
   var sPriority = context.getValue()[0].ReturnValue;
   var noOfDays = 1;
   switch (sNotificationType) {
      case "M1":
      case "M3":
      case "M4":
         {
             if (sPriority == "3") {
               noOfDays = 14;
            } else if (sPriority == "4") {
               noOfDays = 30;
            }
            else if (sPriority == "5") {
               noOfDays = 90;
            } else if (sPriority == "6") {
               noOfDays = 180;
            }
            break;
         }
      case "M2": {
         if (sPriority == "1" || sPriority == "A") {
            noOfDays = 1;
         } else if (sPriority == "2" || sPriority == "B") {
            noOfDays = 7;
         }
         break;
      }
   }
   var ms = dRequiredStartDate.getTime() + (noOfDays * 24 * 60 * 60 * 1000);
   oRequiredEndTimePicker.setValue(new Date(ms));
}