import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
export default function SystemCondition(context) {
    var binding = context.binding;
  //  alert(JSON.stringify(binding));
    if (libVal.evalIsEmpty(binding.ZSystemCondition)) {
        return '-';
    } else {
       return binding.ZSystemCondition;
    }
}