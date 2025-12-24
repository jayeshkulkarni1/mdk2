import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
export default function NotificationFunctionLocValue(context) {
    let page = context.evaluateTargetPathForAPI('#Page:NotificationAddPage');
    let flocValue = page.evaluateTargetPath('#Control:FuncLocHierarchyExtensionControl').getValue();
}