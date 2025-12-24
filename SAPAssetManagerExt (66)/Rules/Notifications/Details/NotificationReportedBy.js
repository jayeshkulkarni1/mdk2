// import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import ComLib from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function NotificationDetailsReportedBy(clientAPI) {
    if (ComLib.getSapUserName(clientAPI)) {
        return ComLib.getSapUserName(clientAPI);
    }

    return '-';
}
